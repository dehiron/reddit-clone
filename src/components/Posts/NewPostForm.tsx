import { Flex, Icon } from '@chakra-ui/react';
import React, { useState } from 'react';
import { BiPoll } from "react-icons/bi";
import { BsLink45Deg, BsMic } from "react-icons/bs";
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import { AiFillCloseCircle } from "react-icons/ai";
import TabItem from './TabItem';

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
        </Flex>
    )
}
export default NewPostForm;