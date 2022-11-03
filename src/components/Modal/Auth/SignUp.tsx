import { Button, Flex, Input, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { authModalState } from '../../../atoms/authModalAtom';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../../../firebase/clientApp';
import { FIREBASE_ERRORS } from '../../../firebase/errors';

const SignUp:React.FC = () => {

    const setAuthModalState = useSetRecoilState(authModalState);
    const [signUpform, setSignUpForm] = useState({
        email: "",
        password: "",
        confirmPassword:""
    });
    const [error, setError] = useState("") // フロント側で定義したエラー制御の内容。

    //react-firebase-hooksから
    const [ 
        createUserWithEmailAndPassword,
        user, loading, userError //error -> userErrorへ。Firebaseから返るエラー内容が入る。
    ] = useCreateUserWithEmailAndPassword(auth)

    //Firebase logic
    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => { //ページリフレッシュを制御する為の型
        event.preventDefault();
        if (error) setError("");
        if (signUpform.password !== signUpform.confirmPassword) {
            setError("Passwords not match");
            return;
        }
        //passwords match
        createUserWithEmailAndPassword(signUpform.email, signUpform.password)
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => { //インプットイベントを検知する為の型
        //update form state
        setSignUpForm((prev) => ({
            ...prev,
            [event.target.name]: event.target.value
        }))
    };

    return (
        <form onSubmit={onSubmit}>
            <Input 
                required
                name="email"
                placeholder="email"
                type="email"
                mb={2}
                onChange={onChange}
                fontSize="10pt"
                _placeholder={{ color:"gray.500" }}
                _hover={{
                    bg: "white",
                    border: "1px solid",
                    borderColor: "blue.500"
                }}
                _focus={{
                    outline: "none",
                    bg: "white",
                    border:"1px solid",
                    borderColor: "blue.500",
                }}
                bg="gray.50"
            />
            <Input 
                required
                name="password"
                placeholder="password"
                type="password"
                mb={2}
                onChange={onChange}
                fontSize="10pt"
                _placeholder={{ color:"gray.500" }}
                _hover={{
                    bg: "white",
                    border: "1px solid",
                    borderColor: "blue.500"
                }}
                _focus={{
                    outline: "none",
                    bg: "white",
                    border:"1px solid",
                    borderColor: "blue.500",
                }}
                bg="gray.50"
            />
            <Input 
                required
                name="confirmPassword"
                placeholder="confirm password"
                type="password"
                mb={2}
                onChange={onChange}
                fontSize="10pt"
                _placeholder={{ color:"gray.500" }}
                _hover={{
                    bg: "white",
                    border: "1px solid",
                    borderColor: "blue.500"
                }}
                _focus={{
                    outline: "none",
                    bg: "white",
                    border:"1px solid",
                    borderColor: "blue.500",
                }}
                bg="gray.50"
            />
            <Text textAlign="center" color="red" fontSize="10pt">
                {/* //errorはフロント側で定義したエラー制御の内容、userErrorはFirebaseから返るエラー内容 */}    
                {error 
                    || FIREBASE_ERRORS[userError?.message as keyof typeof FIREBASE_ERRORS] // タイプキャスティング？のテクニックみたい
                }
            </Text>
            {/* Buttonはtype=submitにしてformでラップすることにより効力を発揮する */}
            <Button width="100%" height="36px" mt={2} mb={2} type="submit" isLoading={loading}> 
                Sign Up
            </Button>
            <Flex fontSize="9pt" justifyContent="center">
                <Text mr={1}>Already a redditor?</Text>
                <Text 
                    color="blue.500" 
                    fontWeight={700} 
                    cursor="pointer"
                    onClick={() => {setAuthModalState((prev) => ({
                        ...prev,
                        view: "login"
                    }))}}
                >
                    LOG IN
                </Text>
            </Flex>
        </form>
    );
}
export default SignUp;