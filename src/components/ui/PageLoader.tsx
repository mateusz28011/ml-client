import { Box } from '@chakra-ui/layout';
import React from 'react';
import { BeatLoader } from 'react-spinners';

const PageLoader = () => {
  return (
    <Box pos='absolute' top='50%' left='50%' transform='translate(-50%,-50%)'>
      <BeatLoader size='16px' color='#ED8936' />
    </Box>
  );
};

export default PageLoader;
