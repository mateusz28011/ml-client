import { FormErrorMessage } from '@chakra-ui/form-control';
import { Box } from '@chakra-ui/layout';
import { v4 } from 'uuid';

export const Error = ({
  error,
  isFormError,
}: {
  error: any;
  isFormError?: boolean;
}) => {
  while (typeof error === 'object') error = error[Object.keys(error)[0]];

  return error ? (
    isFormError ? (
      <FormErrorMessage>{error}</FormErrorMessage>
    ) : (
      <Box fontSize='sm' color='red.500'>
        {error}
      </Box>
    )
  ) : null;
};

const ApiError = ({
  error,
  name,
  isFormError = false,
}: {
  error: any;
  name?: string;
  isFormError?: boolean;
}) => {
  error = error?.data;
  error = error && name ? error[0][name] : error;
  return error ? (
    <>
      {Array.isArray(error) ? (
        error.map((error) => (
          <Error error={error} isFormError={isFormError} key={v4()} />
        ))
      ) : (
        <Error error={error} isFormError={isFormError} />
      )}
    </>
  ) : null;
};

export default ApiError;
