import { Box, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import React from 'react';
import { InputField } from '../components/InputField';
import { useCreatePostMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { Layout } from '../components/Layout';
import { useRouter } from 'next/router';
import { useIsAuth } from '../utils/useIsAuth';

const CreatePost : React.FC<{}> = ({}) => { 
    const router = useRouter();
    useIsAuth();
    const [,createPost] = useCreatePostMutation();
    return (
        <Layout variant='small'>
            <Formik initialValues={{title: "", text: ""}} onSubmit={async (values, {setErrors}) => {
               const {error} = await createPost({input: values});
               if (!error){router.push("/")}
            }}>
                {(props) => (
                    <Form>
                        <InputField name='title' placeholder='title' label='Title'/>
                        <Box mt={4}>
                            <InputField textarea name='text' placeholder='text...' label='Text' />
                        </Box>
                        <Button type='submit' colorScheme={'teal'} mt={4} isLoading={props.isSubmitting} >Create Post</Button>
                    </Form>
                )}
            </Formik>
        </Layout>
    );
}

export default withUrqlClient(createUrqlClient)(CreatePost);