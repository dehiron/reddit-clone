import { Timestamp } from "@google-cloud/firestore";
import { atom } from "recoil";

export interface Community {
    id: string;
    creatorId: string;
    numberOfMembers: number;
    privacyType: "public" | "restricted" | "private";
    createdAt?: Timestamp; //シリアライゼーションのエラーが出る要因になることも
    imageURL?: string;
}

export interface CommunitySnippet {
    communityId: string;
    isModerator?: boolean;
    imageURL?: string;
}

interface CommunityState {
    mySnippets: CommunitySnippet[]
    //visitedCommunities
}

const defaultCommunityState: CommunityState = {
    mySnippets: [],
}

export const communityState = atom<CommunityState>({
    key: "communitiesState",
    default: defaultCommunityState,
})



