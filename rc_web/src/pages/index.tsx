import { withUrqlClient } from "next-urql";
import { Layout } from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from 'next/link';
import { Box, Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";

const Index = () => {
  const [{data, fetching}] = usePostsQuery({variables: {
    limit: 10,
  }});
  return (
    <Layout>
      <Flex>
        <Heading mb={4}>Reddit_Clone</Heading>
        <NextLink href="/create-post">
          <Button ml="auto" mb={4} colorScheme={'red'} >Create Post</Button>
        </NextLink>
      </Flex>
      {fetching && !data ? <div>LOADING ...</div> : (
      <Stack spacing={8}>
        {data!.posts.map(p => ( 
          <Box key={p.id} p={5} shadow="md" borderWidth="1px">
            <Heading fontSize="xl">
              {p.title}
            </Heading>
            <Text mt={4}>{p.textSnippet}</Text>
          </Box>
        ))}
      <Flex>
        <Button m="auto" mb={4}>
          Load More
        </Button>
      </Flex>
      </Stack>
      )}
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient,{ssr: true})(Index);
