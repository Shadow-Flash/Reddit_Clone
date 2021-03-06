import React from 'react';
import { Form, Formik } from "formik";
import { Box, Button } from '@chakra-ui/react';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import NextLink from 'next/link';

const Register: React.FC<{}> = ({}) => { 
    const router = useRouter();
    const [, register] = useRegisterMutation();
        return (
            <Wrapper variant='small'>
                <Formik initialValues={{email: "", username: "", password: ""}} onSubmit={async (values, {setErrors}) => {
                    const response = await register({options: values});
                    if(response.data?.register.errors) {
                        setErrors(toErrorMap(response.data.register.errors));
                    }
                    else if(response.data?.register.user) {
                        router.push("/");
                    }
                }}>
                    {(props) => (
                        <Form>
                            <InputField name='username' placeholder='username' label='Username'/>
                             <Box mt={4}>
                                <InputField name='email' placeholder='email' label='Email' type='email' />
                            </Box>
                            <Box mt={4}>
                                <InputField name='password' placeholder='password' label='Password' type='password' />
                            </Box>
                            <Button type='submit' colorScheme={'teal'} mt={4} isLoading={props.isSubmitting} >Register</Button>
                            <NextLink href="/">
                                <Button colorScheme={'gray'} mt={4} ml={4}>Back to Home</Button>
                            </NextLink>
                        </Form>
                    )}
                </Formik>
            </Wrapper>
        );
}

export default withUrqlClient(createUrqlClient)(Register);