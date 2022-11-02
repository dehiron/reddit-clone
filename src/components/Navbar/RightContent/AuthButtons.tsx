import { Button } from '@chakra-ui/react';
import React from 'react';
import { useSetRecoilState } from 'recoil';
import { AuthModalState } from '../../../atoms/authModalAtom';

const AuthButtons:React.FC = () => {

    //ステートのセットだけする（ステート自体は使わない）場合にこのフックを使える。
    //逆にステート値だけを使うフックもある。
    const setAuthModalState = useSetRecoilState(AuthModalState); 

    return(
        <>
            <Button 
                variant="outline" 
                height="28px"
                display={{ base: "none", sm: "flex" }}
                width={{ base: "78px", md:"110px" }}
                mr={2}
                onClick={() => {setAuthModalState({ open:true, view:"login"})}}
            >
                Log In
            </Button>
            <Button
                height="28px"
                display={{ base: "none", sm: "flex" }}
                width={{ base: "78px", md:"110px" }}
                mr={2}
                onClick={() => {setAuthModalState({ open:true, view:"signup"})}}
            >
                Sign Up
            </Button>
        </>
    )
    
}
export default AuthButtons;