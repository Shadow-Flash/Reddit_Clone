import { withUrqlClient } from "next-urql";
import { Layout } from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from 'next/link';
import { Link } from "@chakra-ui/react";

const Index = () => {
  const [{data}] = usePostsQuery();
  return (
    <Layout>
      <NextLink href="/create-post">
        <Link>Create Post</Link>
      </NextLink>
      <div>
      <h1>Hello World!!</h1>
      {!data ? <div>LOADING ...</div> : data.posts.map(p => <div key={p.id}>{p.title}</div>)}
      </div>
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient,{ssr: true})(Index);
