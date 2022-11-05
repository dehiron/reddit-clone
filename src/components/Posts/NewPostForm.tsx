import { Alert, AlertDescription, AlertIcon, AlertTitle, Flex, Icon, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { BiPoll } from "react-icons/bi";
import { BsLink45Deg, BsMic } from "react-icons/bs";
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import { AiFillCloseCircle } from "react-icons/ai";
import TabItem from './TabItem';
import TextInputs from './PostForm/TextInputs';
import ImageUpload from './PostForm/ImageUpload';
import { Post } from '../../atoms/postAtom';
import { User } from 'firebase/auth';
import { useRouter } from 'next/router';
import { addDoc, collection, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { firestore, storage } from '../../firebase/clientApp';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';

type NewPostProps = {
    // user?: User | null //初期化されてない時のnullを考慮しなくてはいけない
    user: User; //newPostの中の型エラー対処。上のコンポーネントでuser &&として、null or undefinedの場合が無いようにする
};

// static tab array : react component とあまり関係ないから外に置くみたい

const formTabs: TabItem[] = [
    {
        title: "Post",
        icon : IoDocumentText
    },
    {
        title: "Images & Video",
        icon : IoImageOutline
    },
    {
        title: "Link",
        icon : BsLink45Deg
    },
    {
        title: "Poll",
        icon : BiPoll
    },
    {
        title: "Talk",
        icon : BsMic
    }
]

export type TabItem = {
    title: string;
    icon: typeof Icon.arguments; //Iconの型定義
}

const NewPostForm:React.FC<NewPostProps> = ({ user }) => {

    const router = useRouter(); //post中のcommunityIdの為に必要なステート
    const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
    const [textInputs, setTextInputs] = useState({
        title: "",
        body: "",
    });
    const [selectedFile, setSelectedFile] = useState<string>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const handleCreatePost = async () => {
        
        const { communityId } = router.query; //post中のcommunityIdの為に必要なステート
        // create new post object => type Postが必要
        const newPost: Post = {
            communityId: communityId as string,
            creatorId: user.uid,
            creatorDisplayName: user.email!.split("@")[0], // ! tells ts that the value is valid FOR SURE and safe to preceed
            title: textInputs.title,
            body: textInputs.body,
            numberOfComments: 0,
            voteStatus: 0,
            // imageURL?: ,　//オプショナルだからなくてもOK
            // communityImageURL?: , //オプショナルだからなくてもOK
            createdAt: serverTimestamp() as Timestamp, // 本来serverTimestampはサーバー側でしか使えないので怒られる為の型指定
        };

        // store the post in db
        setLoading(true);
        try{
            const postDocRef = await addDoc(collection(firestore, "posts"), newPost);

            // check for selectedFile
            if (selectedFile) {
                // store in storage => getDownloadURL (return imageURL)
                const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
                await uploadString(imageRef, selectedFile, "data_url");
                const downloadURL = await getDownloadURL(imageRef);

                // update post doc by adding imageURL
                await updateDoc(postDocRef, {
                    imageURL: downloadURL,
                });

            }
        } catch (error: any) {
            console.log("handleCreatePost error", error.message)
            setError(true);
        }
        setLoading(false);

        // redirect the user back to the communiyPage using the router
        // router.back();
    };

    const onSelectImage = ( event: React.ChangeEvent<HTMLInputElement> ) => {
        const reader = new FileReader(); //JSから提供されているクラス、ファイルからデータを読み取る際に使う。
        
        if (event.target.files?.[0]) {
            reader.readAsDataURL(event.target.files[0]);
        }

        reader.onload = (readerEvent) => {
            if (readerEvent.target?.result) {
                setSelectedFile(readerEvent.target.result as string)
            }
        }
    };

    const onTextChange = ( event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> ) => {
        const {
            target: { 
                name, 
                value 
            },
        } = event;

        setTextInputs((prev) => ({
            ...prev,
            [name]: value,
        }))
    };

    return (
        <Flex direction="column" bg="white" borderRadius={4} mr={2}>
            <Flex width="100%">
                {formTabs.map((item, index) => (
                    <TabItem 
                        item={item} 
                        key = {index}
                        selected={item.title === selectedTab} 
                        setSelectedTab={setSelectedTab}
                    />
                ))}
            </Flex>
            <Flex p={4}>
                {selectedTab === "Post" &&
                    <TextInputs 
                        textInputs={textInputs} 
                        handleCreatePost={handleCreatePost} 
                        onChange={onTextChange} 
                        loading={loading}  
                    /> 
                }
                {selectedTab === "Images & Video" &&
                    <ImageUpload
                        selectedFile = {selectedFile}
                        onSelectImage = {onSelectImage}
                        setSelectedTab = {setSelectedTab}
                        setSelectedFile = {setSelectedFile}
                    /> 
                }
            </Flex>
            {error && (
                <Alert status='error'>
                    <AlertIcon />
                    <Text mr={2}>Error creating post</Text>
                </Alert>
            )}
        </Flex>
    )
}
export default NewPostForm;