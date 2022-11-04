import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { Community, CommunitySnippet, communityState } from '../atoms/communitiesAtom';
import { auth, firestore } from '../firebase/clientApp';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, getDocs } from 'firebase/firestore';

const useCommunityData = () => {

    const [user] = useAuthState(auth);
    const [communityStateValue, setCommunityStateValue] = useRecoilState(communityState)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const onJoinOrLeaveCommunity = (communityData: Community, isJoined: Boolean) => {
        // is the user signed in ?
        // if not => open auth modal

        if (isJoined) {
            leaveCommunity(communityData.id);
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
        } catch (error) {
            console.log("getMySnippets error", error);
        }
        setLoading(false);
    }

    const joinCommunity = (communitData : Community) => {};

    const leaveCommunity = (communityId: string) => {};

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