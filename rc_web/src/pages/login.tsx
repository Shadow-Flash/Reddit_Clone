import React from 'react';
import { Form, Formik } from "formik";
import { Box, Button, Flex, Link } from '@chakra-ui/react';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import NextLink from "next/link";

const Login: React.FC<{}> = ({}) => { 
    const router = useRouter();
    const [, login] = useLoginMutation();
        return (
            <Wrapper variant='small'>
                <Formik initialValues={{usernameOrEmail: "", password: ""}} onSubmit={async (values, {setErrors}) => {
                    const response = await login(values);
                    if(response.data?.login.errors) {
                        setErrors(toErrorMap(response.data.login.errors));
                    }
                    else if(response.data?.login.user) {
                        router.push(typeof router.query.next === "string" ? router.query.next : "/");
                    }
                }}>
                    {(props) => (
                        <Form>
                            <InputField name='usernameOrEmail' placeholder='username or email' label='Username or Email'/>
                            <Box mt={4}>
                                <InputField name='password' placeholder='password' label='Password' type='password' />
                            </Box>
                            <Flex mt={2}>
                                <NextLink href="/forgot-password">
                                    <Link>Forgot Password?</Link>
                                </NextLink>
                            </Flex>
                            <Flex>
                                <Button type='submit' colorScheme={'teal'} mt={4} isLoading={props.isSubmitting} >Login</Button>
                                <NextLink href="/">
                                    <Button colorScheme={'gray'} mt={4} ml={4}>Back to Home</Button>
                                </NextLink>
                            </Flex>
                        </Form>
                    )}
                </Formik>
            </Wrapper>
        );
}

export default withUrqlClient(createUrqlClient)(Login);