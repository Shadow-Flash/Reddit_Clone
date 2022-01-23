import React from "react";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";

interface NavBarProps {

}

const NavBar: React.FC<NavBarProps> = ({}) => { 
    const [{fetching: logoutFetching},logout] = useLogoutMutation();
    const [{data, fetching}] = useMeQuery({pause: isServer()});
    let body = null;
    //data is loading
    if (fetching) {

    }
    //user not logged in
    else if (!data?.me){
        body = (
            <>
            <NextLink href={"/login"}>
                <Button mr={2} colorScheme={'whiteAlpha'}>Login</Button>
            </NextLink>
            <NextLink href={"/register"}>
                <Button colorScheme={'whiteAlpha'}>Register</Button>
            </NextLink>
            </>
        )
    }
    //user is logged in
    else {
        body =( 
        <Flex alignItems={'center'}>
            <Text mr={4} fontSize={'xl'} >{data.me.username}</Text>
            <Button onClick={()=> {logout()}} isLoading={logoutFetching} colorScheme={'whiteAlpha'}>Logout</Button>
        </Flex>
        )
    }
    return (
    <Flex position={'sticky'} top={0} zIndex={1} bg="tomato" p={4}>
        <Box ml={"auto"}>
            {body}
        </Box>
    </Flex>
    );
}

export default NavBar;