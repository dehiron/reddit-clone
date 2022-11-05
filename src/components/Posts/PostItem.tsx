import React, { useState } from 'react';
import { Post } from '../../atoms/postAtom';
import { AiOutlineDelete } from "react-icons/ai";
import { BsChat, BsDot } from "react-icons/bs";
import { FaReddit } from "react-icons/fa";
import {
    IoArrowDownCircleOutline,
    IoArrowDownCircleSharp,
    IoArrowRedoOutline,
    IoArrowUpCircleOutline,
    IoArrowUpCircleSharp,
    IoBookmarkOutline,
} from "react-icons/io5";
import { Flex, Icon, Stack, Text, Image, Skeleton, Spinner, Alert, AlertIcon } from '@chakra-ui/react';
import moment from 'moment'

type PostItemProps = {
    post: Post;
    userIsCreator: boolean;
    userVoteValue?: number;
    onVote: () => {};
    onSelectPost: () => void; //カスタムフックで定義してる際にasyncではないのでvoidで返す必要がある
    onDeletePost: (post: Post) => Promise<Boolean>; //下のhandleDeleteで受け取るpostに合わせて型を定義,async/await関数なのでPromise型を返す

};

const PostItem:React.FC<PostItemProps> = ({ 
    post, 
    userIsCreator, 
    userVoteValue, 
    onVote, 
    onSelectPost,
    onDeletePost, 
}) => {

    const [loadingImage, setLoadingImage] = useState(true);
    const [error, setError] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);

    const handleDelete = async () => {
        setLoadingDelete(true);
        try {
            const success = await onDeletePost(post);
            if (!success) {
                throw new Error("Failed to delte post");
            }
            console.log("Post was successfully deleted");
        } catch (error: any) {
            setError(error.message)
        }
        setLoadingDelete(false);
    };
    
    return (
        <Flex 
            border="1px solid" 
            bg="white" 
            borderColor="gray.300" 
            borderRadius={4} 
            _hover={{ borderColor: "gray.500"}}
            cursor="pointer"
            onClick={onSelectPost}
        >
            <Flex 
                direction="column"
                align="center"
                bg="gray.100"
                p={2}
                width="40px"
                borderRadius={4}
            >
                <Icon 
                    as={userVoteValue === 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline} 
                    color={userVoteValue === 1 ? "brand.100" : "gray.400"}
                    fontSize={22}
                    onClick={onVote}
                    cursor="pointer"
                />
                <Text fontSize="9pt">{post.voteStatus}</Text>
                <Icon 
                    as={userVoteValue === -1 ? IoArrowDownCircleSharp : IoArrowDownCircleOutline} 
                    color={userVoteValue === -1 ? "#4379ff" : "gray.400"}
                    fontSize={22}
                    onClick={onVote}
                    cursor="pointer"
                />
            </Flex>
            <Flex direction="column" width="100%">
                {error && (
                    <Alert status='error'>
                        <AlertIcon />
                        <Text mr={2}>{error}</Text>
                    </Alert>
                )}
                <Stack spacing={1} p="10px">
                    <Stack 
                        direction="row" 
                        spacing={0.6} 
                        align="center" 
                        fontSize="9pt"
                    >
                        {/* ホームページにいるかどうかでコミュニティーアイコンの表示を制御する */}
                        <Text>
                            Posted by u/{post.creatorDisplayName}{" "} 
                            {moment(new Date(post.createdAt?.seconds * 1000)).fromNow()}
                        </Text>
                    </Stack>

                    <Text fontSize="12px" fontWeight={600}>
                        {post.title}
                    </Text>
                    <Text fontSize="10pt">{post.body}</Text>
                    {post.imageURL && (
                        <Flex justify="center" align="center" p={2}>
                            {loadingImage && (
                                <Skeleton height="200px" width="100%" borderRadius={4} />
                            )}
                            <Image 
                                src={post.imageURL} 
                                maxHeight="460px" 
                                alt="Post Image" 
                                display={loadingImage ? "none" : "unset"}
                                onLoad={() => {setLoadingImage(false)}}
                            />                        
                        </Flex>
                    )}
                </Stack>
                <Flex ml={1} mb={0.5} color="gray.500">
                    <Flex
                        align="center"
                        p="8px 10px"
                        borderRadius={4}
                        _hover={{bg: "gray.200"}}
                        cursor="pointer"
                    >
                        <Icon as={BsChat} mr={2}/>
                        <Text fontSize="9pt">{post.numberOfComments}</Text>
                    </Flex>
                    <Flex
                        align="center"
                        p="8px 10px"
                        borderRadius={4}
                        _hover={{bg: "gray.200"}}
                        cursor="pointer"
                    >
                        <Icon as={IoArrowRedoOutline} mr={2}/>
                        <Text fontSize="9pt">Share</Text>
                    </Flex>
                    <Flex
                        align="center"
                        p="8px 10px"
                        borderRadius={4}
                        _hover={{bg: "gray.200"}}
                        cursor="pointer"
                    >
                        <Icon as={IoBookmarkOutline} mr={2}/>
                        <Text fontSize="9pt">Save</Text>
                    </Flex>
                    {userIsCreator && (
                        <Flex
                            align="center"
                            p="8px 10px"
                            borderRadius={4}
                            _hover={{bg: "gray.200"}}
                            cursor="onDelete"
                            onClick={handleDelete}
                        >
                            {loadingDelete ? (
                                <Spinner size="sm" />
                            ) : (
                                <>
                                    <Icon as={AiOutlineDelete} mr={2}/>
                                    <Text fontSize="9pt">Delete</Text>
                                </>
                            )}
                        </Flex>
                    )}
                </Flex>
            </Flex>
        </Flex>
    )
}
export default PostItem;