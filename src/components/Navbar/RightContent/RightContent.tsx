import { Button, Flex } from '@chakra-ui/react';
import { signOut, User } from 'firebase/auth';
import React from 'react';
import { auth } from '../../../firebase/clientApp';
import AuthModal from '../../Modal/Auth/AuthModal';
import AuthButtons from './AuthButtons';
import Icons from './Icons'
import UserMenu from './UserMenu';


type RightContentProps = {
    user?: User | null //firebase/authからインポートしてるUserの型。userがundefinedの場合nullを返す
};

const RightContent:React.FC<RightContentProps> = ({ user }) => { //destructure
    return(
        <>
            <AuthModal />
            <Flex align="center" justify="center">
                {user ? (
                    <Icons />
                ) : (
                    <AuthButtons />
                )}
                <UserMenu user={user}/>
            </Flex>
        </>
    )
}
export default RightContent;