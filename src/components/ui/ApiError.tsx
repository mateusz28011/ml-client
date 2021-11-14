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
  isFormError = false,
}: {
  error: any;
  isFormError?: boolean;
}) => {
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
