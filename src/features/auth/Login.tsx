import { Button } from '@chakra-ui/button';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';

import { useForm } from 'react-hook-form';
import { useAppSelector } from '../../app/hooks';
import { useLoginMutation } from '../../app/services/split/auth';
import ApiError from '../../components/ui/ApiError';
import { selectCurrentUser } from './authSlice';

interface Inputs {
  email: string;
  password: string;
}

const Login = () => {
  const { handleSubmit, register } = useForm<Inputs>();

  const user = useAppSelector(selectCurrentUser);
  console.log(user);

  const [login, { isLoading, error }] = useLoginMutation();

  // console.log(data, isLoading, error);

  const onSubmit = (data: Inputs) => {
    login(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormLabel htmlFor='email'>Email</FormLabel>
      <Input type='email' required {...register('email')} />
      <FormLabel htmlFor='password'>Password</FormLabel>
      <Input type='password' required {...register('password')} />

      <FormControl isInvalid={error !== undefined}>
        <ApiError error={error} isFormError />
      </FormControl>
      <Button isLoading={isLoading} type='submit'>
        Submit
      </Button>
    </form>
  );
};

export default Login;
