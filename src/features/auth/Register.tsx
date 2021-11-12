import { Alert, AlertIcon } from '@chakra-ui/alert';
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
import hasSpecificNameInApiError from '../../common/hasSpecificNameInApiError';
import ApiError from '../../components/ui/ApiError';

const Register = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const { handleSubmit, register: registerInput } = useForm<RegisterRequest>();
  const [register, { isLoading, error }] = useRegisterMutation();
  const onSubmit = (data: RegisterRequest) => {
    register(data);
  };

  return (
    <Box maxW='sm' paddingX='1rem' marginX='auto'>
      <ApiError error={error} isServerError />
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={3}>
          <FormControl
            isInvalid={hasSpecificNameInApiError(error, 'firstName')}
            w='full'
          >
            <FormLabel htmlFor='firstName'>First name</FormLabel>
            <Input type='firstName' required {...registerInput('firstName')} />
            <ApiError error={error} name='firstName' isFormError />
          </FormControl>
          <FormControl
            isInvalid={hasSpecificNameInApiError(error, 'lastName')}
            w='full'
          >
            <FormLabel htmlFor='lastName'>Last name</FormLabel>
            <Input type='lastName' required {...registerInput('lastName')} />
            <ApiError error={error} name='lastName' isFormError />
          </FormControl>
          <FormControl
            isInvalid={hasSpecificNameInApiError(error, 'email')}
            w='full'
          >
            <FormLabel htmlFor='email'>Email</FormLabel>
            <Input type='email' required {...registerInput('email')} />
            <ApiError error={error} name='email' isFormError />
          </FormControl>
          <FormControl
            isInvalid={hasSpecificNameInApiError(error, 'password1')}
            w='full'
          >
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
            <ApiError error={error} name='password1' isFormError />
          </FormControl>
          <FormControl
            isInvalid={hasSpecificNameInApiError(error, 'nonFieldErrors')}
            w='full'
          >
            <FormLabel htmlFor='password2'>Confirm password</FormLabel>
            <Input
              pr='4.5rem'
              type={show ? 'text' : 'password'}
              required
              {...registerInput('password2')}
            />
            <ApiError error={error} name='nonFieldErrors' isFormError />
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
