import { Alert, AlertIcon, AlertTitle } from '@chakra-ui/alert';

import { Box, HStack, Link, Text, VStack } from '@chakra-ui/layout';
import React from 'react';

import { BeatLoader } from 'react-spinners';
import { useGetAlgorithmDataQuery } from '../../app/services/split/clusterings';
import PageLoader from '../../components/ui/PageLoader';
import StartAlgorithm from './StartAlgorithm';

const Algorithm = ({
  clusteringId,
  algorithmId,
}: {
  clusteringId: number;
  algorithmId: number;
}) => {
  const { data, isLoading, isError } = useGetAlgorithmDataQuery({
    clusteringId: clusteringId,
    id: algorithmId,
  });
  //   console.log(data);
  return (
    <Box>
      {isLoading ? (
        <Box textAlign='center' mt='20' mb='10'>
          <BeatLoader size='14px' color='#ED8936' />
        </Box>
      ) : data ? (
        <>
          <Text textAlign='center' fontSize='2xl'>
            {data.algorithmDisplay}
          </Text>
          <VStack alignItems='start' px={[0, 50, 150]} mt={4}>
            <HStack>
              <Text fontWeight='medium'>Status:</Text>
              <Text>{data.taskStatus || 'NOT STARTED'}</Text>
            </HStack>
            <HStack>
              <Text fontWeight='medium'>Download:</Text>
              {/* <Link href={data.file} onClick={(e) => e.stopPropagation()}>
                <Button variant='ghost' size='sm'>
                  <DownloadIcon boxSize={5} color='gray.600' />
                </Button>
              </Link> */}
            </HStack>
            <StartAlgorithm
              clusteringId={clusteringId}
              algorithmId={algorithmId}
            />
          </VStack>
        </>
      ) : isError ? (
        <Alert status='error' variant='left-accent'>
          <AlertIcon />
          <AlertTitle>Server Error</AlertTitle>
          There was a problem during loading algorithm. Try refreshing page.
        </Alert>
      ) : null}
    </Box>
  );
};

export default Algorithm;
