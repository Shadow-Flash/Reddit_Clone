import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Flex, IconButton } from '@chakra-ui/react';
import React from 'react';

interface UpdootSectionProps {
  points: number
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({points}) => { 
  return (
    <Flex direction={"column"} justifyContent={"center"} alignItems={"center"} mr={4} >
      <IconButton aria-label="upVote" colorScheme='blackAlpha' icon={<ChevronUpIcon size="24px"/>} onlick/>
      {points}
      <IconButton aria-label="downVote" colorScheme='blackAlpha' icon={<ChevronDownIcon size="24px"/>}/>
    </Flex>
  );
}