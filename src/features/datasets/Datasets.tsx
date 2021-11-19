import { Button } from '@chakra-ui/button';
import { Box, Flex, Link } from '@chakra-ui/layout';
import { Progress } from '@chakra-ui/react';
import { Table, Tbody, Td, Tfoot, Th, Thead, Tr } from '@chakra-ui/table';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

import {
  datasetsApi,
  useGetDatasetsQuery,
} from '../../app/services/split/datasets';
import Paginator from '../../components/ui/Paginator';
import axiosConfig from '../../common/axiosConfig';
import axios from 'axios';
import { DownloadIcon } from '@chakra-ui/icons';
import { useAppDispatch } from '../../app/hooks';
import { BeatLoader } from 'react-spinners';

const Datasets = () => {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState<number>();
  const { data, isError, isLoading, isFetching, isUninitialized } =
    useGetDatasetsQuery(page);

  const refetchDatasets = () => {
    dispatch(datasetsApi.util.invalidateTags(['Dataset']));
    setPage(undefined);
  };
  console.log(isUninitialized);
  return (
    <Box
      my={5}
      border={1}
      borderStyle='solid'
      borderColor='gray.200'
      rounded='2xl'
      shadow='sm'
      w={{ md: '60%' }}
      mx='auto'
    >
      <Table size='md'>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Uploaded</Th>
            <Th>
              <Box
                textAlign='center'
                visibility={isFetching ? 'visible' : 'hidden'}
              >
                <BeatLoader size={5} />
              </Box>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {data &&
            data.results.map((dataset) => (
              <Tr key={dataset.id}>
                <Td>{dataset.name || '-'}</Td>
                <Td>{new Date(dataset.created).toLocaleString()}</Td>
                <Td textAlign='center'>
                  <Link href={dataset.file}>
                    <DownloadIcon boxSize={5} color='orange.500' />
                  </Link>
                </Td>
              </Tr>
            ))}
        </Tbody>
        <Tfoot>
          <Tr>
            <Th colSpan={3}>
              {!isError && !isLoading && (
                <FileUpload refetchDatasets={refetchDatasets} />
              )}
            </Th>
          </Tr>
        </Tfoot>
      </Table>
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

interface UploadState {
  progress: number | undefined;
  isStarted: boolean;
  isUploading: boolean;
}

const defaultUploadState: UploadState = {
  progress: undefined,
  isStarted: false,
  isUploading: false,
};

const FileUpload = ({ refetchDatasets }: { refetchDatasets: () => void }) => {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [uploadState, setUploadState] =
    useState<UploadState>(defaultUploadState);
  const [cancelTokenSource] = useState(axios.CancelToken.source());
  console.log(uploadState);

  const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setUploadState((prev) => ({ ...prev, isStarted: true }));
    const target = e.currentTarget as HTMLInputElement;
    const file = target.files![0];

    const config = {
      cancelToken: cancelTokenSource.token,
      onUploadProgress: function (progressEvent: ProgressEvent) {
        var percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadState((prev) => ({ ...prev, progress: percentCompleted }));
      },
    };

    let formData = new FormData();
    formData.append('file', file);

    try {
      setUploadState((prev) => ({ ...prev, isUploading: true }));
      await axiosConfig.post('/datasets/', formData, config);
      refetchDatasets();
    } catch (error) {
      if (axios.isCancel(error)) {
        return;
      }
    }
    setUploadState(defaultUploadState);
    target.value = '';
  };

  useEffect(() => {
    return () => {
      console.log('clear');
      cancelTokenSource.cancel();
    };
  }, [cancelTokenSource]);

  return (
    <Flex align='center' justify='space-between'>
      <input
        type='file'
        style={{ display: 'none' }}
        ref={fileRef}
        onChange={onChange}
        multiple={false}
        required
      />
      <Button
        isDisabled={uploadState.isStarted}
        isLoading={uploadState.isUploading}
        variant='solid'
        loadingText='Uploading'
        onClick={() => fileRef.current?.click()}
      >
        UPLOAD DATASET
      </Button>
      {uploadState.progress ? (
        <Progress hasStripe value={uploadState.progress} ml={10} flex='1' />
      ) : null}
    </Flex>
  );
};

export default Datasets;
