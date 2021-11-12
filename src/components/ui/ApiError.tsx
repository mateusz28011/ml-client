import { Alert, AlertIcon } from '@chakra-ui/alert';
import { FormErrorMessage } from '@chakra-ui/form-control';
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
      <Alert status='error' variant='left-accent' my={2}>
        <AlertIcon />
        {error}
      </Alert>
    )
  ) : null;
};

const ApiError = ({
  error,
  name,
  isServerError = false,
  isFormError = false,
}: {
  error: any;
  name?: string;
  isServerError?: boolean;
  isFormError?: boolean;
}) => {
  if (!isServerError) {
    error = error?.data;
    error = error && name ? error[name] : error;
  } else if (typeof error?.status === 'string') {
    error = 'Server error';
  } else {
    error = null;
  }
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
