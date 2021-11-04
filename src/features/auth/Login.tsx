import { Button } from '@chakra-ui/button';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input';
import { Box, VStack } from '@chakra-ui/layout';
import { useState } from 'react';

import { useForm } from 'react-hook-form';
// import { useAppSelector } from '../../app/hooks';
import { useLoginMutation } from '../../app/services/split/auth';
import ApiError from '../../components/ui/ApiError';
// import { selectCurrentUser } from './authSlice';

interface Inputs {
  email: string;
  password: string;
}

const Login = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const { handleSubmit, register } = useForm<Inputs>();
  // const user = useAppSelector(selectCurrentUser);
  const [login, { isLoading, error }] = useLoginMutation();

  const onSubmit = (data: Inputs) => {
    login(data);
  };

  return (
    <Box maxW='sm' paddingX='1rem' marginX='auto'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={3}>
          <Box w='full'>
            <FormLabel htmlFor='email'>Email</FormLabel>
            <Input type='email' required {...register('email')} />
          </Box>
          <Box w='full'>
            <FormLabel htmlFor='password'>Password</FormLabel>
            <InputGroup size='md'>
              <Input
                pr='4.5rem'
                type={show ? 'text' : 'password'}
                required
                {...register('password')}
              />
              <InputRightElement width='4.5rem'>
                <Button h='1.75rem' size='sm' onClick={handleClick}>
                  {show ? 'Hide' : 'Show'}
                </Button>
              </InputRightElement>
            </InputGroup>
          </Box>
        </VStack>
        <FormControl isInvalid={error !== undefined}>
          <ApiError error={error} isFormError />
        </FormControl>
        <Button width='full' marginTop='4' isLoading={isLoading} type='submit'>
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default Login;
