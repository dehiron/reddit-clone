import { doc, getDoc } from 'firebase/firestore';
import { GetServerSidePropsContext } from 'next';
import React from 'react';
import { Community } from '../../../atoms/communitiesAtom';
import { firestore } from '../../../firebase/clientApp';
import safeJsonStringify from 'safe-json-stringify'

type communitPageProps = {
    communityData: Community;
};

const communityPage: React.FC<communitPageProps> = ({ communityData }) => {

    console.log("here is data", communityData)

    return <div>WELCOME TO {communityData.id}</div>;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {

    //get community data and pass it to client

    try {
        const communityDocRef = doc(
            firestore, 
            "communities", 
            context.query.communityId as string //パラメータの値を渡す方法
        );
        const communityDoc = await getDoc(communityDocRef);


        return {
            props: {
                communityData: JSON.parse(
                    safeJsonStringify({ id: communityDoc.id, ...communityDoc.data()})
                )
            }
        }
    } catch (error) {
        // Could add error page here
        console.log("getServerSideProps error", error)
    }
}

export default communityPage;