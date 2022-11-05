import { Flex, Icon } from '@chakra-ui/react';
import React, { useState } from 'react';
import { BiPoll } from "react-icons/bi";
import { BsLink45Deg, BsMic } from "react-icons/bs";
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import { AiFillCloseCircle } from "react-icons/ai";
import TabItem from './TabItem';
import TextInputs from './PostForm/TextInputs';

type NewPostProps = {};

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

const NewPostForm:React.FC<NewPostProps> = () => {

    const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
    const [textInputs, setTextInputs] = useState({
        title: "",
        body: "",
    });
    const [selectedFile, setSelectedFile] = useState<string>();
    const [loading, setLoading] = useState(false);

    const handleCreatePost = async () => {};

    const onSelectImage = () => {};

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
                {selectedTab ==="Post" &&
                    <TextInputs 
                        textInputs={textInputs} 
                        handleCreatePost={handleCreatePost} 
                        onChange={onTextChange} 
                        loading={loading}  
                    /> 
                }
            </Flex>
        </Flex>
    )
}
export default NewPostForm;