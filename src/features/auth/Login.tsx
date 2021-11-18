import { Button } from '@chakra-ui/button';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input';
import { Box, VStack } from '@chakra-ui/layout';
import { useState } from 'react';

import { useForm } from 'react-hook-form';

import { LoginRequest, useLoginMutation } from '../../app/services/split/auth';
import useApiError from '../../app/useApiError';
import ApiError from '../../components/ui/ApiError';

const Login = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const { handleSubmit, register } = useForm<LoginRequest>();
  const [login, { isLoading, error }] = useLoginMutation();
  const apiErrors = useApiError<LoginRequest, keyof LoginRequest>(error, [
    'email',
    'password',
  ]);

  const onSubmit = (data: LoginRequest) => {
    login(data);
  };

  return (
    <Box maxW='sm' paddingX='1rem' marginX='auto'>
      <ApiError error={apiErrors.mainError} />
      <ApiError error={apiErrors.nonFieldErrors} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={3}>
          <FormControl isInvalid={apiErrors.email?.isError} w='full'>
            <FormLabel htmlFor='email'>Email</FormLabel>
            <Input type='email' required {...register('email')} />
            <ApiError error={apiErrors.email?.error} isFormError />
          </FormControl>
          <FormControl isInvalid={apiErrors.password?.isError} w='full'>
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
            <ApiError error={apiErrors.password?.error} isFormError />
          </FormControl>
        </VStack>

        <Button width='full' marginTop='4' isLoading={isLoading} type='submit'>
          Sign In
        </Button>
      </form>
    </Box>
  );
};

export default Login;
