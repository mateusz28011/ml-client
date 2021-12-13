import { Box, Center, Text, Flex, HStack } from '@chakra-ui/layout';
import React, { useEffect, useState } from 'react';
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
import { Button } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import CompareAlgorithms from '../plots/CompareAlgorithms';
import useQuerySearch from '../../hooks/useQuerySearch';
import qs from 'qs';

const initialCompareAlgorithms = { isChoosing: false, algorithms: [] };

const toQuerySearch = (ids: any[]): [string, number[]] => {
  // const checkedIds = ids.filter((id) => parseInt(id));
  const checkedIds = ids.reduce((previousValue, currentValue) => {
    let id = parseInt(currentValue);
    if (id) {
      return [...previousValue, id];
    } else return previousValue;
  }, []);
  return [
    checkedIds.length > 0
      ? qs.stringify(
          { ids: checkedIds },
          { arrayFormat: 'repeat', addQueryPrefix: true }
        )
      : '',
    checkedIds,
  ];
};

const Clustering = ({ clusteringId }: { clusteringId: number }) => {
  const history = useHistory();
  const querySearch = useQuerySearch();
  const [querySearchIds, setQuerySearchIds] = useState('');
  const { id, algorithmId } = useParams<{ id: string; algorithmId: string }>();
  const [page, setPage] = useState<number>();
  const [compareAlgorithms, setCompareAlgorithms] = useState<{
    isChoosing: boolean;
    algorithms: number[];
  }>({
    ...initialCompareAlgorithms,
    isChoosing: (history.location.state as any)?.clickCompareFromAlgorithm
      ? true
      : false,
  });
  const { data, isError, isLoading, isFetching } = useGetAlgorithmsDataQuery({
    id: clusteringId,
    page: page,
  });
  const [isAddAlgorithmOpen, setIsAddAlgorithmOpen] = useState(false);

  useEffect(() => {
    if (querySearch.ids && Array.isArray(querySearch.ids)) {
      const [query, checkedIds] = toQuerySearch(querySearch.ids);
      if (query && checkedIds.length >= 2) {
        setQuerySearchIds(query);
        compareAlgorithms.algorithms.length === 0 &&
          setCompareAlgorithms((prev) => {
            return { ...prev, algorithms: checkedIds };
          });
      }
    }
  }, [querySearch, compareAlgorithms.algorithms]);

  const chooseAlgorithm = (id: number) => {
    setCompareAlgorithms((prev) => {
      if (prev.algorithms.includes(id)) {
        return {
          ...prev,
          algorithms: prev.algorithms.filter((prevId) => prevId !== id),
        };
      }
      return { ...prev, algorithms: [...prev.algorithms, id] };
    });
  };

  const toggleChoosingAlgorithm = () => {
    setCompareAlgorithms((prev) => {
      return { ...prev, isChoosing: !prev.isChoosing };
    });
  };

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
                  <Th as={RTh}>Id</Th>
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
                    onClick={() => {
                      compareAlgorithms.isChoosing
                        ? chooseAlgorithm(algorithmData.id)
                        : history.push(
                            `/datasets/${id}/clustering/${clusteringId}/${
                              algorithmData.id !== parseInt(algorithmId)
                                ? `algorithm/${algorithmData.id}`
                                : ''
                            }`
                          );
                    }}
                    key={algorithmData.id}
                    bg={index % 2 ? undefined : 'orange.100'}
                    _hover={{
                      bg: 'orange.200',
                      cursor: 'pointer',
                    }}
                  >
                    <Td as={RTd} fontWeight='medium'>
                      {algorithmData.id}
                    </Td>
                    <Td as={RTd}>{algorithmData.algorithmDisplay}</Td>
                    <Td as={RTd}>
                      {algorithmData.taskStatus || 'NOT STARTED'}
                    </Td>
                    <Td isNumeric as={RTd}>
                      {algorithmData.clustersCount}
                    </Td>
                    {(parseInt(algorithmId) === algorithmData.id ||
                      compareAlgorithms.algorithms.includes(
                        algorithmData.id
                      )) && (
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
        {!isError && !isLoading && (
          <Flex
            w='full'
            wrap={['wrap', 'nowrap']}
            mt={5}
            marginBottom={{ base: '2.5', md: '0' }}
            px={5}
          >
            {!compareAlgorithms.isChoosing && (
              <AddAlgorithm
                clusteringId={clusteringId}
                isOpen={isAddAlgorithmOpen}
                setIsOpen={setIsAddAlgorithmOpen}
              />
            )}
            {data?.count !== 0 && !isAddAlgorithmOpen ? (
              compareAlgorithms.isChoosing ? (
                <Box>
                  <HStack
                    wrap={['wrap', 'nowrap']}
                    spacing={[0, 3]}
                    justify={['space-between', 'normal']}
                  >
                    <Button
                      // isLoading={isLoading}
                      loadingText='Creating'
                      // type='submit'
                      // ml={['0px !important', '12px !important']}
                      isDisabled={compareAlgorithms.algorithms.length < 2}
                      mr={['12px !important', '0px !important']}
                      colorScheme='green'
                      flex={['1', '0 1 auto']}
                      onClick={() =>
                        history.push(
                          `/datasets/${id}/clustering/${clusteringId}${qs.stringify(
                            { ids: compareAlgorithms.algorithms },
                            { arrayFormat: 'repeat', addQueryPrefix: true }
                          )}`
                        )
                      }
                    >
                      CONFIRM
                    </Button>
                    <Button
                      // isDisabled={isLoading}
                      colorScheme='red'
                      onClick={() =>
                        setCompareAlgorithms(initialCompareAlgorithms)
                      }
                    >
                      <CloseIcon />
                    </Button>
                  </HStack>
                </Box>
              ) : (
                <Button
                  variant='outline'
                  w={['full', 'auto']}
                  onClick={() => {
                    toggleChoosingAlgorithm();
                    algorithmId &&
                      history.push(
                        `/datasets/${id}/clustering/${clusteringId}`,
                        {
                          clickCompareFromAlgorithm: algorithmId ? true : false,
                        }
                      );
                  }}
                >
                  COMPARE ALGORITHMS
                </Button>
              )
            ) : null}
          </Flex>
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
      {data && algorithmId ? (
        <Algorithm
          clusteringId={clusteringId}
          algorithmId={parseInt(algorithmId)}
        />
      ) : querySearchIds ? (
        <CompareAlgorithms
          querySearchIds={querySearchIds}
          clusteringId={clusteringId}
        />
      ) : null}
    </>
  );
};

export default Clustering;
