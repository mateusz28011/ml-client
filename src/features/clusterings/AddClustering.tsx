import { Button } from '@chakra-ui/button';
import { FormControl } from '@chakra-ui/form-control';
import { CloseIcon } from '@chakra-ui/icons';
import { Input } from '@chakra-ui/input';
import { Box, HStack } from '@chakra-ui/layout';
import { useToast } from '@chakra-ui/toast';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  PostClustering,
  usePostClusteringMutation,
} from '../../app/services/split/clusterings';

const AddClustering = ({ dataset }: { dataset: number }) => {
  const toast = useToast();
  const { handleSubmit, register, reset } = useForm<PostClustering>();
  const [isOpen, setIsOpen] = useState(false);
  const [postClustering, { isLoading, isSuccess, isError }] =
    usePostClusteringMutation();

  const toggleIsOpen = () => setIsOpen((prev) => !prev);

  const onSubmit = ({ name }: { name: string }) => {
    postClustering({ name: name, dataset: dataset });
  };

  useEffect(() => {
    if (isSuccess === true && isLoading === false) {
      console.log(123);
      toast({
        title: 'Successfuly created group',
        status: 'success',
        variant: 'left-accent',
        position: 'top',
        isClosable: true,
        duration: 3000,
      });
      reset();
      toggleIsOpen();
    } else if (isError === true && isLoading === false) {
      toast({
        title: 'An error occurred during creating group',
        status: 'error',
        variant: 'left-accent',
        position: 'top',
        isClosable: true,
        duration: 3000,
      });
    }
  }, [isSuccess, isLoading, isError, reset, toast]);

  return (
    <Box mt={5} marginBottom={{ base: '2.5', md: '0' }} px={5}>
      {!isOpen ? (
        <Button variant='outline' w={['full', 'auto']} onClick={toggleIsOpen}>
          CREATE GROUP
        </Button>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isDisabled={isLoading}>
            <HStack
              wrap={['wrap', 'nowrap']}
              spacing={[0, 3]}
              justify={['space-between', 'normal']}
            >
              <Input
                required
                maxLength={50}
                {...register('name')}
                placeholder='Name'
                borderColor='orange.300'
                w={['full', 'auto']}
                mb={[3, 0]}
              />
              <Button
                isLoading={isLoading}
                loadingText='Creating'
                type='submit'
                ml={['0px !important', '12px !important']}
                mr={['12px !important', '0px !important']}
                colorScheme='green'
                // variant='outline'
                flex={['1', '0 1 auto']}
              >
                SUBMIT
              </Button>
              <Button
                isDisabled={isLoading}
                colorScheme='red'
                // variant='link'
                onClick={() => {
                  toggleIsOpen();
                  reset();
                }}
              >
                <CloseIcon />
              </Button>
            </HStack>
          </FormControl>
        </form>
      )}
    </Box>
  );
};

export default AddClustering;
