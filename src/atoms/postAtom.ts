import { Timestamp } from "firebase/firestore";
import { atom } from "recoil";

export type Post = {
    id?: string;
    communityId: string;
    creatorId: string;
    creatorDisplayName: string;
    title: string;
    body: string;
    numberOfComments: number;
    voteStatus: number;
    imageURL?: string;
    communityImageURL?: string;
    createdAt: Timestamp
}

// To model actual post stateの為にinterfaceを作る必要がある
interface PostState {
    selectedPost: Post | null;
    posts: Post[]
    //postVotes
}

//PostStateの初期値
const defaultPostState: PostState = {
    selectedPost: null,
    posts: [],
}

export const postState = atom<PostState>({
    key: "postState",
    default: defaultPostState,
})