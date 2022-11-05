import { Box, Text } from '@chakra-ui/react';
import React from 'react';
import PageContent from '../../../components/Layout/PageContent';
import { useAuthState } from 'react-firebase-hooks/auth';
import NewPostForm from '../../../components/Posts/NewPostForm';
import { auth } from '../../../firebase/clientApp';

const SubmitPostPage:React.FC = () => {

    const [user] = useAuthState(auth) //ポストのatom定義の中でユーザーデータ使っている為に必要
    
    return (
        <PageContent>
            <> 
                <Box p="14px 0px" borderBottom="1px solid" borderColor="white">
                    <Text>Create a post</Text>
                </Box>            
                {user && <NewPostForm user={user} />}
            </>
            <>
                {/* About */}
            </>
        </PageContent>
    )
}
export default SubmitPostPage;