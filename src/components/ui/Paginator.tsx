import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Box, Center, Text } from '@chakra-ui/layout';
import React, { Dispatch, SetStateAction } from 'react';
import { Pagination } from '../../app/services/split/index';

const Paginator = ({
  count,
  totalPages,
  currentPage,
  next,
  previous,
  setPage,
}: Pagination & { setPage: Dispatch<SetStateAction<number | undefined>> }) => {
  return (
    <Center position='relative' py={1.5}>
      {totalPages > 1 && (
        <>
          <ChevronLeftIcon
            boxSize={8}
            color={previous ? 'gray.600' : 'gray.300'}
            cursor={previous ? 'pointer' : 'default'}
            onClick={() => previous && setPage(previous)}
          />
          <Text fontSize='xl' mx={3}>{`${currentPage} of ${totalPages}`}</Text>
          <ChevronRightIcon
            boxSize={8}
            color={next ? 'gray.600' : 'gray.300'}
            cursor={next ? 'pointer' : 'default'}
            onClick={() => next && setPage(next)}
          />
          <Box position='absolute' right='5'>{`${count} ITEMS`}</Box>
        </>
      )}
    </Center>
  );
};

export default Paginator;
