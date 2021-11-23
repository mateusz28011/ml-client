import { Button } from '@chakra-ui/button';
import { DownloadIcon } from '@chakra-ui/icons';
import { Box, HStack, Link, Text, VStack } from '@chakra-ui/layout';
import { useGetDatasetQuery } from '../../app/services/split/datasets';
import { Alert, AlertIcon, AlertTitle } from '@chakra-ui/alert';
import PageLoader from '../../components/ui/PageLoader';
import { useParams } from 'react-router';
import Clusterings from '../clusterings/Clusterings';

const Dataset = () => {
  const { id } = useParams<{ id: string }>();
  const {
    data: dataset,
    isLoading,
    isError,
  } = useGetDatasetQuery(parseInt(id));

  return (
    <Box>
      {isLoading ? (
        <PageLoader />
      ) : dataset ? (
        <>
          <Text textAlign='center' fontSize='2xl'>
            {dataset.name}
          </Text>
          <VStack alignItems='start' px={[0, 50, 150]} mt={4}>
            <HStack>
              <Text fontWeight='medium'>Uploaded:</Text>
              <Text>{new Date(dataset.created).toLocaleString()}</Text>
            </HStack>
            <HStack>
              <Text fontWeight='medium'>Download:</Text>
              <Link href={dataset.file} onClick={(e) => e.stopPropagation()}>
                <Button variant='ghost' size='sm'>
                  <DownloadIcon boxSize={5} color='gray.600' />
                </Button>
              </Link>
            </HStack>
          </VStack>
          {id && <Clusterings id={parseInt(id)} />}
        </>
      ) : isError ? (
        <Alert status='error' variant='left-accent'>
          <AlertIcon />
          <AlertTitle>Server Error</AlertTitle>
          There was a problem during loading your dataset. Try refreshing page.
        </Alert>
      ) : (
        <PageLoader />
      )}
    </Box>
  );
};

export default Dataset;
