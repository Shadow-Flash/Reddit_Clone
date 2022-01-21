import { Box, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import React, { useState } from 'react';
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';
import { useForgotPasswordMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

const ForgotPassword : React.FC<{}> = ({}) => { 
    const [complete, setComplete] = useState(false);
    const [, forgotPassword] = useForgotPasswordMutation();
        return (
            <Wrapper variant='small'>
                <Formik initialValues={{email: ""}} onSubmit={async (values) => {
                    await forgotPassword(values);
                    setComplete(true);
                }}>
                    {(isSubmitting: boolean) => complete ? <Box>if an account with that email exsits, we will sent you an email</Box> : (
                        <Form>
                            <InputField name='email' placeholder='email' label='Email'/>
                            <Button type='submit' colorScheme={'teal'} mt={4} isLoading={isSubmitting} >Forgot Password</Button>
                        </Form>
                    )}
                </Formik>
            </Wrapper>
        );
}

export default withUrqlClient(createUrqlClient)(ForgotPassword);