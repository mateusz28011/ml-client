import axiosConfig from '../../common/axiosConfig';
import axios, { AxiosError } from 'axios';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { FiUpload } from 'react-icons/fi';
import { Button } from '@chakra-ui/button';
import { Progress } from '@chakra-ui/react';
import { Flex } from '@chakra-ui/layout';
import { useToast } from '@chakra-ui/toast';

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
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [uploadState, setUploadState] =
    useState<UploadState>(defaultUploadState);
  const [cancelTokenSource] = useState(axios.CancelToken.source());

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
      if (axios.isAxiosError(error)) {
        const serverError = error as AxiosError;
        if (
          serverError &&
          serverError.response &&
          serverError.response.data?.file![0]
        ) {
          toast({
            title: 'Error',
            status: 'error',
            variant: 'left-accent',
            position: 'top',
            isClosable: true,
            description: serverError.response.data.file[0],
          });
          return;
        }
      }
      toast({
        title: 'Error',
        status: 'error',
        variant: 'left-accent',
        position: 'top',
        isClosable: true,
        description: 'An error occurred during file upload',
      });
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
    <Flex
      display={['block', 'flex']}
      align='center'
      justify='space-between'
      mt={5}
      marginBottom={{ base: '2.5', md: '0' }}
      px={5}
    >
      <input
        type='file'
        style={{ display: 'none' }}
        ref={fileRef}
        onChange={onChange}
        multiple={false}
        required
      />
      <Button
        leftIcon={<FiUpload />}
        w={['full', 'auto']}
        isDisabled={uploadState.isStarted}
        isLoading={uploadState.isUploading}
        variant='outline'
        loadingText='Uploading'
        onClick={() => fileRef.current?.click()}
      >
        UPLOAD DATASET
      </Button>
      {uploadState.progress ? (
        <Progress
          hasStripe
          value={uploadState.progress}
          ml={[0, 10]}
          my={[5, 0]}
          flex='1'
        />
      ) : null}
    </Flex>
  );
};

export default FileUpload;
