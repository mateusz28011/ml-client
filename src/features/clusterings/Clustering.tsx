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

const Clustering = ({ clusteringId }: { clusteringId: number }) => {
  const [page, setPage] = useState<number>();
  const { data, isError, isLoading, isFetching } = useGetAlgorithmsDataQuery({
    id: clusteringId,
    page: page,
  });

  console.log(data);

  return isLoading ? (
    <Box textAlign='center' mt='20' mb='10'>
      <BeatLoader size='14px' color='#ED8936' />
    </Box>
  ) : (
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
                <Th as={RTh}>Uploaded</Th>
                <Th as={RTh}></Th>
              </Tr>
            </Thead>
            <Tbody as={RTbody}>
              {data.results.map((algorithmData, index) => (
                <Tr
                  as={RTr}
                  border='0 !important'
                  //    onClick={() => history.push(`datasets/${dataset.id}`)}
                  key={algorithmData.id}
                  bg={index % 2 ? undefined : 'orange.100'}
                  _hover={{
                    bg: 'orange.200',
                    cursor: 'pointer',
                  }}
                >
                  <Td as={RTd}>{algorithmData.algorithmDisplay || '-'}</Td>
                  <Td as={RTd}>
                    {/* {new Date(dataset.created).toLocaleString()} */}
                  </Td>
                  <Td as={RTd}>
                    {/* <Center h={4}>
                       <Link
                         href={dataset.file}
                         onClick={(e) => e.stopPropagation()}
                       >
                         <Button variant='ghost' size='sm'>
                           <DownloadIcon boxSize={5} color='gray.600' />
                         </Button>
                       </Link>
                     </Center> */}
                  </Td>
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
  );
};

export default Clustering;
