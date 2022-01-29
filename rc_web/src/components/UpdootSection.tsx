import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Flex, IconButton } from '@chakra-ui/react';
import React from 'react';
import { PostSnippetFragment, useVoteMutation } from '../generated/graphql';

interface UpdootSectionProps {
  post: PostSnippetFragment
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({post}) => { 
  const [,vote] = useVoteMutation();
  return (
    <Flex direction={"column"} justifyContent={"center"} alignItems={"center"} mr={4} >
      <IconButton aria-label="upVote" colorScheme='blackAlpha' icon={<ChevronUpIcon size="24px"/>} onClick={async () => await vote({postId: post.id, value : 1})}/>
      {post.points}
      <IconButton aria-label="downVote" colorScheme='blackAlpha' icon={<ChevronDownIcon size="24px"/>} onClick={async () => await vote({postId: post.id, value : -1})}/>
    </Flex>
  );
}