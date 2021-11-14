import { Button } from '@chakra-ui/button';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input';
import { Box, VStack } from '@chakra-ui/layout';
import { useState } from 'react';

import { useForm } from 'react-hook-form';

import {
  useRegisterMutation,
  RegisterRequest,
} from '../../app/services/split/auth';
import useApiError from '../../app/useApiError';
import ApiError from '../../components/ui/ApiError';

const Register = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const { handleSubmit, register: registerInput } = useForm<RegisterRequest>();
  const [register, { isLoading, error }] = useRegisterMutation();
  const apiErrors = useApiError<RegisterRequest, keyof RegisterRequest>(error, [
    'firstName',
    'lastName',
    'email',
    'password1',
    'password2',
  ]);

  const onSubmit = (data: RegisterRequest) => {
    register(data);
  };

  return (
    <Box maxW='sm' paddingX='1rem' marginX='auto'>
      <ApiError error={apiErrors.mainError} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={3}>
          <FormControl isInvalid={apiErrors.firstName?.isError} w='full'>
            <FormLabel htmlFor='firstName'>First name</FormLabel>
            <Input type='firstName' required {...registerInput('firstName')} />
            <ApiError error={apiErrors.firstName?.error} isFormError />
          </FormControl>
          <FormControl isInvalid={apiErrors.lastName?.isError} w='full'>
            <FormLabel htmlFor='lastName'>Last name</FormLabel>
            <Input type='lastName' required {...registerInput('lastName')} />
            <ApiError error={apiErrors.lastName?.error} isFormError />
          </FormControl>
          <FormControl isInvalid={apiErrors.email?.isError} w='full'>
            <FormLabel htmlFor='email'>Email</FormLabel>
            <Input type='email' required {...registerInput('email')} />
            <ApiError error={apiErrors.email?.error} isFormError />
          </FormControl>
          <FormControl isInvalid={apiErrors.password1?.isError} w='full'>
            <FormLabel htmlFor='password1'>Password</FormLabel>
            <InputGroup size='md'>
              <Input
                pr='4.5rem'
                type={show ? 'text' : 'password'}
                required
                {...registerInput('password1')}
              />
              <InputRightElement width='4.5rem'>
                <Button h='1.75rem' size='sm' onClick={handleClick}>
                  {show ? 'Hide' : 'Show'}
                </Button>
              </InputRightElement>
            </InputGroup>
            <ApiError error={apiErrors.password1?.error} isFormError />
          </FormControl>
          <FormControl isInvalid={apiErrors.password2?.isError} w='full'>
            <FormLabel htmlFor='password2'>Confirm password</FormLabel>
            <Input
              pr='4.5rem'
              type={show ? 'text' : 'password'}
              required
              {...registerInput('password2')}
            />
            <ApiError error={apiErrors.password2?.error} isFormError />
          </FormControl>
        </VStack>

        <Button width='full' marginTop='4' isLoading={isLoading} type='submit'>
          Sign Up
        </Button>
      </form>
    </Box>
  );
};

export default Register;
