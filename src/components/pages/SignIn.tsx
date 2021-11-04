import { useColorModeValue } from '@chakra-ui/color-mode';
import { Box, Link, Text } from '@chakra-ui/layout';
import { Link as RouterLink } from 'react-router-dom';
import Login from '../../features/auth/Login';

const SignIn = () => {
  return (
    <Box
      w='fit-content'
      mx='auto'
      rounded='lg'
      shadow='md'
      textAlign='center'
      mt={24}
      px={[2, 6, 10]}
      py={10}
      border={1}
      borderStyle={'solid'}
      borderColor={useColorModeValue('gray.200', 'gray.900')}
    >
      <Text fontSize='4xl' fontWeight='bold'>
        Sign in to your account
      </Text>
      <Text fontSize='large' mt={5} mb={12}>
        Don't have an account yet?
        <Link
          as={RouterLink}
          ml='2'
          to='signup'
          color='orange.400'
          fontWeight='medium'
        >
          Sign up
        </Link>
      </Text>
      <Login />
    </Box>
  );
};

export default SignIn;
