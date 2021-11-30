import { Button } from '@chakra-ui/button';
import { DeleteIcon } from '@chakra-ui/icons';
import { useToast } from '@chakra-ui/toast';
import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import { useDeleteAlgorithmMutation } from '../../app/services/split/clusterings';

const DeleteAlgorithm = ({
  clusteringId,
  algorithmId,
}: {
  clusteringId: number;
  algorithmId: number;
}) => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const toast = useToast();
  const [deleteAlgorithm, { isSuccess, isError, isLoading }] =
    useDeleteAlgorithmMutation();

  useEffect(() => {
    if (isSuccess === true && isLoading === false) {
      toast({
        title: 'Successfuly deleted algorithm',
        status: 'success',
        variant: 'left-accent',
        position: 'top',
        isClosable: true,
        duration: 3000,
      });
      history.push(`/datasets/${id}/clustering/${clusteringId}/`);
    } else if (isError === true && isLoading === false) {
      toast({
        title: 'An error occurred during deleting algorithm',
        status: 'error',
        variant: 'left-accent',
        position: 'top',
        isClosable: true,
        duration: 3000,
      });
    }
  }, [isSuccess, isLoading, isError, toast, clusteringId, history, id]);

  const handleDelete = () => {
    deleteAlgorithm({ clusteringId: clusteringId, id: algorithmId });
  };

  return (
    <Button
      ml='0.5rem'
      variant='ghost'
      size='sm'
      isLoading={isLoading}
      onClick={handleDelete}
    >
      <DeleteIcon w={5} h={5} color='red.500' />
    </Button>
  );
};

export default DeleteAlgorithm;
