import { ChevronDownIcon } from '@chakra-ui/icons';
import { Menu, MenuButton, Button, MenuList, MenuItem, Icon, Flex, MenuDivider } from '@chakra-ui/react';
import { signOut, User } from 'firebase/auth';
import React from 'react';
import { FaRedditSquare } from "react-icons/fa";
import { VscAccount } from "react-icons/vsc";
import { IoSparkles } from "react-icons/io5"; 
import { CgProfile } from "react-icons/cg"; 
import { MdOutlineLogin } from "react-icons/md"
import { auth } from '../../../firebase/clientApp';
import { useSetRecoilState } from 'recoil';
import { authModalState } from '../../../atoms/authModalAtom';



type UserMenuProps = {
    user? : User | null;
}

const UserMenu:React.FC<UserMenuProps> = ({ user }) => {

    const setAuthModalState = useSetRecoilState(authModalState);
    
    return (
        <Menu>
            <MenuButton 
                cursor="pointer"
                padding="0px 6px"
                borderRadius={4}
                _hover={{ outline: "1px solid", outlineColor:"gray.200" }}
            >
                <Flex alignItems="center">
                    <Flex alignItems="center">
                        {user ? (
                            <>
                                <Icon 
                                    fontSize={24} 
                                    mr={1}
                                    color="gray.300"
                                    as={FaRedditSquare} 
                                />
                            </>        
                        ) : ( 
                            <Icon fontSize={24} color="gray.400" mr={1} as={VscAccount} />
                        )}
                    </Flex>
                    <ChevronDownIcon />
                </Flex>
            </MenuButton>
            <MenuList>
                {user ? (
                    <>
                        <MenuItem 
                            fontSize="10pt"
                            fontWeight={700}
                            _hover={{ bg: "blue.500", color: "white" }}
                        >
                            <Flex align="center">
                                <Icon as={CgProfile} fontSize={20} mr={2} />
                                Profile
                            </Flex>
                        </MenuItem>
                        <MenuDivider />
                        <MenuItem 
                            fontSize="10pt"
                            fontWeight={700}
                            _hover={{ bg: "blue.500", color: "white" }}
                            onClick={() => {signOut(auth)}}
                        >
                            <Flex align="center">
                                <Icon as={MdOutlineLogin} fontSize={20} mr={2} />
                                Log Out
                            </Flex>
                        </MenuItem>
                    </>
                ) : (
                    <>
                        <MenuItem 
                            fontSize="10pt"
                            fontWeight={700}
                            _hover={{ bg: "blue.500", color: "white" }}
                            onClick={() => setAuthModalState(({ open: true, view: "login" }))}
                        >
                            <Flex align="center">
                                <Icon as={MdOutlineLogin} fontSize={20} mr={2} />
                                Log In / Sign Up
                            </Flex>
                        </MenuItem>
                    </>
                )}
            </MenuList>
        </Menu>
    ) 
}
export default UserMenu;