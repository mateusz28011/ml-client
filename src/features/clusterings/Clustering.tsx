import { Box, Center, Text } from '@chakra-ui/layout';
import React, { useState } from 'react';
import { useGetAlgorithmsDataQuery } from '../../app/services/split/clusterings';
import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/table';
import {
  Table as RTable,
  Thead as RThead,
  Tbody as RTbody,
  Tr as RTr,
  Th as RTh,
  Td as RTd,
} from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { BeatLoader } from 'react-spinners';
import Paginator from '../../components/ui/Paginator';
import { Alert, AlertIcon, AlertTitle } from '@chakra-ui/alert';
import AddAlgorithm from './AddAlgorithm';
import { useHistory, useParams } from 'react-router';
import Algorithm from './Algorithm';

const Clustering = ({ clusteringId }: { clusteringId: number }) => {
  const history = useHistory();
  const { id, algorithmId } = useParams<{ id: string; algorithmId: string }>();
  const [page, setPage] = useState<number>();
  const { data, isError, isLoading, isFetching } = useGetAlgorithmsDataQuery({
    id: clusteringId,
    page: page,
  });

  return isLoading ? (
    <Box textAlign='center' mt='20' mb='10'>
      <BeatLoader size='14px' color='#ED8936' />
    </Box>
  ) : (
    <>
      <Box
        my={5}
        border={1}
        borderStyle='solid'
        borderColor='gray.200'
        rounded='2xl'
        shadow='sm'
        w={{ md: '80%' }}
        mx='auto'
        pos='relative'
      >
        <Box
          pos={data ? 'absolute' : 'static'}
          top='1.40rem'
          right='6'
          textAlign='center'
          visibility={isFetching ? 'visible' : 'hidden'}
        >
          <BeatLoader size={5} />
        </Box>
        <Text
          fontSize='3xl'
          py={3}
          textAlign='center'
          fontWeight='medium'
          color='gray.700'
          borderBottomWidth={1}
        >
          ALGORITHMS
        </Text>
        {data ? (
          data.results.length !== 0 ? (
            <Table as={RTable} size='md'>
              <Thead as={RThead}>
                <Tr as={RTr}>
                  <Th as={RTh}>Name</Th>
                  <Th as={RTh}>Status</Th>
                  <Th isNumeric as={RTh}>
                    Clusters count
                  </Th>
                </Tr>
              </Thead>
              <Tbody as={RTbody}>
                {data.results.map((algorithmData, index) => (
                  <Tr
                    as={RTr}
                    pos='relative'
                    border='0 !important'
                    onClick={() =>
                      history.push(
                        `/datasets/${id}/clustering/${clusteringId}/algorithm/${algorithmData.id}`
                      )
                    }
                    key={algorithmData.id}
                    bg={index % 2 ? undefined : 'orange.100'}
                    _hover={{
                      bg: 'orange.200',
                      cursor: 'pointer',
                    }}
                  >
                    <Td as={RTd}>{algorithmData.algorithmDisplay}</Td>
                    <Td as={RTd}>
                      {algorithmData.taskStatus || 'NOT STARTED'}
                    </Td>
                    <Td isNumeric as={RTd}>
                      {algorithmData.clustersCount}
                    </Td>
                    {parseInt(algorithmId) === algorithmData.id && (
                      <Td
                        columnkey='000'
                        position='absolute'
                        h='full'
                        borderLeftRadius='lg'
                        zIndex='100'
                        pos='absolute'
                        borderLeft='8px'
                        borderLeftColor='orange.400'
                        left='-0.50rem'
                        bottom='0'
                      ></Td>
                    )}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          ) : (
            <Center mt='3' px='4'>
              Nothing was found
            </Center>
          )
        ) : isError ? (
          <Box px={4}>
            <Alert mb={5} status='error' variant='left-accent'>
              <AlertIcon />
              <AlertTitle>Server Error</AlertTitle>
              There was a problem during loading your algorithms. Try refreshing
              page.
            </Alert>
          </Box>
        ) : null}
        {!isError && !isLoading && <AddAlgorithm clusteringId={clusteringId} />}
        {data && (
          <Paginator
            setPage={setPage}
            count={data.count}
            totalPages={data.totalPages}
            currentPage={data.currentPage}
            next={data.next}
            previous={data.previous}
          />
        )}
      </Box>
      {data && algorithmId && (
        <Algorithm
          clusteringId={clusteringId}
          algorithmId={parseInt(algorithmId)}
        />
      )}
    </>
  );
};

export default Clustering;
