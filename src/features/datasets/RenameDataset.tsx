import { Button } from '@chakra-ui/button';
import { FormControl } from '@chakra-ui/form-control';
import { CloseIcon, EditIcon } from '@chakra-ui/icons';
import { Input } from '@chakra-ui/input';
import { Flex, HStack, Text } from '@chakra-ui/layout';
import { useToast } from '@chakra-ui/toast';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRenameDatasetMutation } from '../../app/services/split/datasets';

const RenameDataset = ({ name, id }: { name: string; id: number }) => {
  const { handleSubmit, register, reset } = useForm<{ name: string }>();
  const toast = useToast();
  const [showEdit, setShowEdit] = useState(false);
  const [renameDataset, { isSuccess, isError, isLoading }] =
    useRenameDatasetMutation();

  const toggleShowEdit = () => setShowEdit((prev) => !prev);

  useEffect(() => {
    if (isSuccess === true && isLoading === false) {
      toast({
        title: 'Successfuly renamed dataset',
        status: 'success',
        variant: 'left-accent',
        position: 'top',
        isClosable: true,
        duration: 3000,
      });
      reset();
      toggleShowEdit();
    } else if (isError === true && isLoading === false) {
      toast({
        title: 'An error occurred during renaming dataset',
        status: 'error',
        variant: 'left-accent',
        position: 'top',
        isClosable: true,
        duration: 3000,
      });
    }
  }, [isSuccess, isLoading, isError, toast, reset]);

  const onSubmit = ({ name }: { name: string }) => {
    renameDataset({ id: id, name: name });
  };

  return (
    <Flex mx='auto' align='center' justify='center'>
      {showEdit ? (
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
                defaultValue={name}
                borderColor='orange.300'
                w={['full', 'auto']}
                mb={[3, 0]}
                variant='flushed'
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
                  toggleShowEdit();
                  reset();
                }}
              >
                <CloseIcon />
              </Button>
            </HStack>
          </FormControl>
        </form>
      ) : (
        <>
          <Text fontSize='2xl'>{name}</Text>
          <Button
            ml='0.5rem'
            variant='ghost'
            size='sm'
            // isLoading={isLoading}
            onClick={toggleShowEdit}
          >
            <EditIcon w={5} h={5} />
          </Button>
        </>
      )}
    </Flex>
  );
};

export default RenameDataset;
