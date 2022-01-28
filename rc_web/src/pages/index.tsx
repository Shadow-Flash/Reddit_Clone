import { withUrqlClient } from "next-urql";
import { Layout } from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from 'next/link';
import { Box, Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { UpdootSection } from "../components/UpdootSection";

const Index = () => {
  const [variables, setVariables] = useState({limit: 10, cursor: null as null | string });
  const [{data, fetching}] = usePostsQuery({variables});
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
        {data!.posts.posts.map(p => ( 
          <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
            <UpdootSection points={p.points}/>
            <Box>
              <Heading fontSize="xl">
                {p.title}
              </Heading>
              <Text>Posted By: {p.creator.username}</Text>
              <Text mt={4}>{p.textSnippet}</Text>
            </Box>
          </Flex>
        ))}
      {data && data.posts.hasMore ? (<Flex>
        <Button onClick={() => {
          setVariables({
            limit: variables.limit,
            cursor: data!.posts.posts[data!.posts.posts.length - 1].createdAt,
          })
        }} m="auto" mb={4}>
          Load More
        </Button>
      </Flex>) : null}
      </Stack>
      )}
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient,{ssr: true})(Index);
