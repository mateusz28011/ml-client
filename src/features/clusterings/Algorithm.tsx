import { Alert, AlertIcon, AlertTitle } from '@chakra-ui/alert';
import { Button } from '@chakra-ui/button';
import { DeleteIcon, DownloadIcon } from '@chakra-ui/icons';

import {
  Box,
  Center,
  Flex,
  HStack,
  Link,
  List,
  ListIcon,
  ListItem,
  Text,
  UnorderedList,
  VStack,
} from '@chakra-ui/layout';
import React from 'react';

import { BeatLoader } from 'react-spinners';
import { useGetAlgorithmDataQuery } from '../../app/services/split/clusterings';
import DeleteAlgorithm from './DeleteAlgorithm';
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

  console.log(data);

  return (
    <Box mb='6rem'>
      {isLoading ? (
        <Box textAlign='center' mt='20' mb='10'>
          <BeatLoader size='14px' color='#ED8936' />
        </Box>
      ) : data ? (
        <>
          <Flex mx='auto' align='center' justify='center'>
            <Text textAlign='center' fontSize='2xl'>
              {data.algorithmDisplay}
            </Text>
            <DeleteAlgorithm
              clusteringId={clusteringId}
              algorithmId={algorithmId}
            />
          </Flex>
          <VStack alignItems='start' px={[0, 50, 150]} mt={4}>
            <HStack>
              <Text fontWeight='medium'>Clusters count:</Text>
              <Text>{data.clustersCount}</Text>
            </HStack>
            <HStack>
              <Text fontWeight='medium'>Status:</Text>
              <Text>{data.taskStatus || 'NOT STARTED'}</Text>
            </HStack>
            {data.resultData && (
              <HStack>
                <Text fontWeight='medium'>Download result data:</Text>
                <Link
                  href={data.resultData}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button variant='ghost' size='sm'>
                    <DownloadIcon boxSize={5} color='gray.600' />
                  </Button>
                </Link>
              </HStack>
            )}
            {data.scores && (
              <>
                <Text fontWeight='medium'>Scores:</Text>
                <UnorderedList ml='2.5rem !important'>
                  <ListItem>
                    <HStack>
                      <Text fontWeight='medium'>
                        Calinski and Harabasz score:
                      </Text>
                      <Text>
                        {Number(data.scores.calinskiHarabaszScore).toPrecision(
                          4
                        )}
                      </Text>
                    </HStack>
                  </ListItem>
                  <ListItem>
                    <HStack>
                      <Text fontWeight='medium'>Davies-Bouldin score:</Text>
                      <Text>
                        {Number(data.scores.daviesBouldinScore).toPrecision(4)}
                      </Text>
                    </HStack>
                  </ListItem>
                  <ListItem>
                    <HStack>
                      <Text fontWeight='medium'>Silhouette Coefficient:</Text>
                      <Text>
                        {Number(data.scores.silhouetteScore).toPrecision(4)}
                      </Text>
                    </HStack>
                  </ListItem>
                </UnorderedList>
              </>
            )}
            {(data.taskStatus === null ||
              ['FAILURE'].includes(data.taskStatus)) && (
              <StartAlgorithm
                clusteringId={clusteringId}
                algorithmId={algorithmId}
              />
            )}
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
