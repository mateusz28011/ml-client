import { Box, Center, Link } from '@chakra-ui/layout';
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
import { Alert, AlertIcon } from '@chakra-ui/alert';

const Datasets = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const [page, setPage] = useState<number>();
  const { data, isError, isLoading, isFetching } = useGetDatasetsQuery(page);

  const refetchDatasets = () => {
    dispatch(datasetsApi.util.invalidateTags(['Dataset']));
    setPage(undefined);
  };

  return (
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
        pos='absolute'
        top='0'
        right='4'
        textAlign='center'
        visibility={isFetching ? 'visible' : 'hidden'}
      >
        <BeatLoader size={5} />
      </Box>
      <Table as={RTable} size='md' mt={['6', '6', '0']}>
        <Thead as={RThead}>
          <Tr as={RTr}>
            <Th as={RTh}>Name</Th>
            <Th as={RTh}>Uploaded</Th>
            <Th as={RTh}></Th>
          </Tr>
        </Thead>
        <Tbody as={RTbody}>
          {data && data.results.length !== 0 ? (
            data.results.map((dataset, index) => (
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
                  <Center>
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
            ))
          ) : isLoading ? null : (
            <Tr>
              <Td colSpan={3} textAlign='center'>
                {isError ? (
                  <Alert status='error' variant='left-accent'>
                    <AlertIcon />
                    Server error
                  </Alert>
                ) : (
                  'No data uploaded'
                )}
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>

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
