import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Community } from '../../atoms/communitiesAtom';
import { Post } from '../../atoms/postAtom';
import { auth, firestore } from '../../firebase/clientApp';
import usePosts from '../../hooks/usePosts';
import PostItem from './PostItem';
import { useAuthState } from 'react-firebase-hooks/auth'
import { Stack } from '@chakra-ui/react';
import PostLoader from './PostLoader';

type PostsProps = {
    communityData: Community ;
};

const Posts:React.FC<PostsProps> = ({ communityData }) => {
    const [user] = useAuthState(auth)
    const [loading, setLoading] = useState(false);
    const {postStateValue, setPostStateValue, onVote, onDeletePost, onSelectPost} = usePosts()

    const getPosts = async () => {
        setLoading(true);
        try {
            // get posts for this community
            const postsQuery = query(
                collection(firestore, "posts"), 
                where("communityId", "==",  communityData.id), 
                orderBy("createdAt", "desc")
            )
            const postDocs = await getDocs(postsQuery);

            // Store in post state
            const posts = postDocs.docs.map((doc) => ({ id:doc.id, ...doc.data() }));
            setPostStateValue((prev) => ({
                ...prev,
                posts: posts as Post[]
            }))

            console.log("posts", posts)

        } catch (error: any) {
            console.log("getPosts error", error.message);
        }
        setLoading(false);
    };

    useEffect(() => {
        getPosts();
    }, []);

    return (
        <>
            {loading ? (
                <PostLoader />
            ) : (
                <Stack>
                    {postStateValue.posts.map((item, index) => (
                        <PostItem  
                            key={index}
                            post={item} 
                            userIsCreator={user?.uid === item.creatorId} 
                            userVoteValue={undefined} 
                            onVote={onVote} 
                            onSelectPost={onSelectPost}
                            onDeletePost={onDeletePost}
                        />
                    ))}
                </Stack>
            )}
        </>
    )
}
export default Posts;