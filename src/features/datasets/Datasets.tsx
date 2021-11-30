import { Box, Center, Link, Text } from '@chakra-ui/layout';
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

import { useState } from 'react';

import {
  datasetsApi,
  useGetDatasetsQuery,
} from '../../app/services/split/datasets';
import Paginator from '../../components/ui/Paginator';

import { DownloadIcon } from '@chakra-ui/icons';
import { useAppDispatch } from '../../app/hooks';
import { BeatLoader } from 'react-spinners';
import FileUpload from './FileUpload';
import { useHistory } from 'react-router';
import { Button } from '@chakra-ui/button';
import { Alert, AlertIcon, AlertTitle } from '@chakra-ui/alert';
import PageLoader from '../../components/ui/PageLoader';

const Datasets = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const [page, setPage] = useState<number>();
  const { data, isError, isLoading, isFetching } = useGetDatasetsQuery(page);

  const refetchDatasets = () => {
    dispatch(datasetsApi.util.invalidateTags(['Datasets']));
    setPage(undefined);
  };

  return isLoading ? (
    <PageLoader />
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
        DATASETS
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
              {data.results.map((dataset, index) => (
                <Tr
                  as={RTr}
                  border='0 !important'
                  onClick={() => history.push(`datasets/${dataset.id}`)}
                  key={dataset.id}
                  bg={index % 2 ? undefined : 'orange.100'}
                  _hover={{
                    bg: 'orange.200',
                    cursor: 'pointer',
                  }}
                >
                  <Td as={RTd}>{dataset.name || '-'}</Td>
                  <Td as={RTd}>{new Date(dataset.created).toLocaleString()}</Td>
                  <Td as={RTd}>
                    <Center h={4}>
                      <Link
                        href={dataset.file}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button variant='ghost' size='sm'>
                          <DownloadIcon boxSize={5} color='gray.600' />
                        </Button>
                      </Link>
                    </Center>
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
            There was a problem during loading your datasets. Try refreshing
            page.
          </Alert>
        </Box>
      ) : null}
      {!isError && !isLoading && (
        <FileUpload refetchDatasets={refetchDatasets} />
      )}
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

export default Datasets;
