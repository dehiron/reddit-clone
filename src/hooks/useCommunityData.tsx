import React, { useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { Community, CommunitySnippet, communityState } from '../atoms/communitiesAtom';
import { auth, firestore } from '../firebase/clientApp';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, doc, getDocs, increment, writeBatch } from 'firebase/firestore';
import { authModalState } from '../atoms/authModalAtom';

const useCommunityData = () => {

    const [user] = useAuthState(auth);
    const [communityStateValue, setCommunityStateValue] = useRecoilState(communityState);
    const setAuthModalState = useSetRecoilState(authModalState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const onJoinOrLeaveCommunity = (communityData: Community, isJoined: Boolean) => {
        // is the user signed in ?
        // if not => open auth modal
        if (!user) {
            //open modal
            setAuthModalState({ open: true, view:"login" });
            return;
        }

        setLoading(true);
        if (isJoined) { 
            leaveCommunity(communityData.id);
            return;
        }
        joinCommunity(communityData)

    }

    const getMySnippets = async () => {
        setLoading(true);
        try {
            //get user snippets
            const snippetDocs = await getDocs(
                collection(firestore, `users/${user?.uid}/communitySnippets`)
            );
            const snippets = snippetDocs.docs.map((doc) => ({ ...doc.data() }));
            setCommunityStateValue((prev) => ({
                ...prev,
                mySnippets: snippets as CommunitySnippet[],
                // mySnippets: snippets as Array<CommunitySnippet>, //上と同じこと
            }))
            console.log("here are snippets", snippets);
        } catch (error: any) {
            console.log("getMySnippets error", error);
            setError(error.message)
        }
        setLoading(false);
    }



    const joinCommunity = async (communityData : Community) => {
        // batch write
            try {
                const batch = writeBatch(firestore); //transactionと違って書き込みオンリーのアトミックオペレーション

                // creating a new community snippet
                const newSnippet: CommunitySnippet = {
                    communityId: communityData.id,
                    imageURL: communityData.imageURL || "",
                    //ジョインするだけなのでモデレーター関連のキーは要らない
                };

                batch.set(
                    doc(
                        firestore, 
                        `users/${user?.uid}/communitySnippets`, 
                        communityData.id
                    ), 
                    newSnippet
                );

                // updating the number of Members (1)
                batch.update(doc(firestore, "communities", communityData.id), {
                    numberOfMembers: increment(1),
                })

                await batch.commit();

                // update recoil state - communityState.mySnippets
                setCommunityStateValue((prev) => ({
                    ...prev,
                    mySnippets: [...prev.mySnippets, newSnippet]
                }))
            } catch (error:any) {
                console.log("joinCommunity error", error);
                setError(error.message)
            }
            setLoading(false)
    };

    const leaveCommunity = async (communityId: string) => {
        // batch write
        try {
            const batch = writeBatch(firestore);

            // deleting the community snippet from user
            batch.delete(
                doc(
                    firestore, 
                    `users/${user?.uid}/communitySnippets`, 
                    communityId
                )
            );

            // updating the numberOfMembers (-1)
            batch.update(doc(firestore, "communities", communityId), {
                numberOfMembers: increment(-1),
            })

            await batch.commit();

            // update recoil state - communityState.mySnippets
            setCommunityStateValue((prev) => ({
                ...prev,
                mySnippets: prev.mySnippets.filter(
                    (item) => item.communityId !== communityId
                ),
            }));
        } catch (error: any) {
            console.log("leaveCommunity error", error.message)
            setError(error.message)
        }

        setLoading(false);
    };

    useEffect(() => {
        if (!user) return;
        getMySnippets();
    }, [user])

    return {
        //data and functions 
        communityStateValue,
        onJoinOrLeaveCommunity,
        loading,
    };

}
export default useCommunityData;