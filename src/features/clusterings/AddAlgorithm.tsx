import { Button } from '@chakra-ui/button';
import { FormControl } from '@chakra-ui/form-control';
import { CloseIcon } from '@chakra-ui/icons';
import { HStack } from '@chakra-ui/layout';
import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from '@chakra-ui/number-input';
import { Select } from '@chakra-ui/select';
import { useToast } from '@chakra-ui/toast';
import React, { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  PostAlgorithmData,
  usePostAlgorithmDataMutation,
} from '../../app/services/split/clusterings';

const AddAlgorithm = ({
  clusteringId,
  isOpen,
  setIsOpen,
}: {
  clusteringId: number;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const toast = useToast();
  const { handleSubmit, register, reset } = useForm<PostAlgorithmData>();
  // const [isOpen, setIsOpen] = useState(false);
  const [postAlgorithmData, { isLoading, isSuccess, isError }] =
    usePostAlgorithmDataMutation();

  const toggleIsOpen = useCallback(
    () => setIsOpen((prev) => !prev),
    [setIsOpen]
  );

  const onSubmit = (data: PostAlgorithmData) => {
    postAlgorithmData({ id: clusteringId, data: data });
  };

  useEffect(() => {
    if (isSuccess === true && isLoading === false) {
      console.log(123);
      toast({
        title: 'Successfuly added algorithm',
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
        title: 'An error occurred during adding algorithm',
        status: 'error',
        variant: 'left-accent',
        position: 'top',
        isClosable: true,
        duration: 3000,
      });
    }
  }, [isSuccess, isLoading, isError, reset, toast, toggleIsOpen]);

  return !isOpen ? (
    <Button
      variant='outline'
      w={['full', 'auto']}
      mr={{ base: 0, sm: 5 }}
      mb={{ base: 3, sm: 0 }}
      onClick={toggleIsOpen}
    >
      ADD ALGORITHM
    </Button>
  ) : (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl isDisabled={isLoading}>
        <HStack
          wrap={['wrap', 'nowrap']}
          spacing={[0, 3]}
          justify={['space-between', 'normal']}
        >
          <Select
            placeholder='Select algorithm'
            required
            borderColor='orange.300'
            {...register('algorithm')}
            w={['full', '48']}
            mb={['8px !important', '0px !important']}
          >
            <option value='0'>K-means</option>
            <option value='1'>Spectral Clustering</option>
            <option value='2'>Gaussian Mixtiure</option>
          </Select>
          <NumberInput
            allowMouseWheel
            w={['full', '20']}
            mb={['8px !important', '0px !important']}
            min={2}
            defaultValue={2}
          >
            <NumberInputField
              required
              {...register('clustersCount')}
              borderColor='orange.300'
            />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>

          <Button
            isLoading={isLoading}
            loadingText='Creating'
            type='submit'
            ml={['0px !important', '12px !important']}
            mr={['12px !important', '0px !important']}
            colorScheme='green'
            flex={['1', '0 1 auto']}
          >
            SUBMIT
          </Button>
          <Button
            isDisabled={isLoading}
            colorScheme='red'
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
  );
};

export default AddAlgorithm;
