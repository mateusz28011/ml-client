import { useColorModeValue } from '@chakra-ui/color-mode';
import { Box, Link, Text } from '@chakra-ui/layout';
import { Link as RouterLink } from 'react-router-dom';
import Register from '../../features/auth/Register';

const SignUp = () => {
  return (
    <Box
      w='fit-content'
      mx='auto'
      rounded='lg'
      shadow='md'
      mt={24}
      px={[2, 6, 10]}
      py={10}
      border={1}
      borderStyle={'solid'}
      borderColor={useColorModeValue('gray.200', 'gray.900')}
    >
      <Text fontSize='4xl' fontWeight='bold' textAlign='center'>
        Create your account
      </Text>
      <Text fontSize='large' mt={5} mb={12} textAlign='center'>
        Already has account?
        <Link
          as={RouterLink}
          ml='2'
          to='signin'
          color='orange.400'
          fontWeight='medium'
        >
          Sign in
        </Link>
      </Text>
      <Register />
    </Box>
  );
};

export default SignUp;
