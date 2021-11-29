import { useHistory, useParams } from 'react-router';
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
import { useGetClusteringsQuery } from '../../app/services/split/clusterings';
import { useState } from 'react';
import AddClustering from './AddClustering';
import { Box, Center, Text } from '@chakra-ui/layout';
import { Alert, AlertIcon } from '@chakra-ui/alert';
import Clustering from './Clustering';

const Clusterings = ({ id }: { id: number }) => {
  const { clusteringId } = useParams<{ clusteringId: string }>();
  const history = useHistory();
  const [page, setPage] = useState<number>();
  const { data, isError, isLoading, isFetching } = useGetClusteringsQuery({
    id: id,
    page: page,
  });

  return (
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
          pos={'absolute'}
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
          GROUPS
        </Text>
        {data ? (
          data.results.length !== 0 ? (
            <Table as={RTable} size='md'>
              <Thead as={RThead}>
                <Tr as={RTr}>
                  <Th as={RTh}>Name</Th>
                  {/* <Th as={RTh}>Uploaded</Th>
                    <Th as={RTh}></Th> */}
                </Tr>
              </Thead>
              <Tbody as={RTbody}>
                {data.results.map((clustering, index) => (
                  <Tr
                    as={RTr}
                    pos='relative'
                    border='0 !important'
                    onClick={() =>
                      history.push(
                        `/datasets/${id}/clustering/${clustering.id}`
                      )
                    }
                    key={clustering.id}
                    bg={index % 2 ? undefined : 'orange.100'}
                    _hover={{
                      bg: 'orange.200',
                      cursor: 'pointer',
                    }}
                  >
                    <Td as={RTd}>{clustering.name}</Td>
                    {parseInt(clusteringId) === clustering.id && (
                      <Box
                        borderLeftRadius='full'
                        zIndex='100'
                        pos='absolute'
                        h='full'
                        borderLeft='8px'
                        borderLeftColor='orange.400'
                        left='-0.50rem'
                        bottom='0'
                      />
                    )}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          ) : (
            <Center mt='3' px='4'>
              {isError ? (
                <Alert status='error' variant='left-accent'>
                  <AlertIcon />
                  Server error
                </Alert>
              ) : (
                'Nothing was found'
              )}
            </Center>
          )
        ) : null}
        {!isError && !isLoading && <AddClustering dataset={id} />}
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
      {data && clusteringId && (
        <Clustering clusteringId={parseInt(clusteringId)} />
      )}
    </>
  );
};

export default Clusterings;
