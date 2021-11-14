import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { useEffect, useState } from 'react';
import { ApiError } from './services/split';

type ApiErrorReturn<T> = {
  [Key in keyof T | 'mainError']?: { error: any; isError: boolean };
};

const hasNameError = (
  error: FetchBaseQueryError | ApiError | SerializedError | undefined,
  name: string
): [any, boolean] =>
  error !== undefined
    ? 'data' in error
      ? name in error.data
        ? [error.data[name], true]
        : [undefined, false]
      : [undefined, false]
    : [undefined, false];

const checkMainError = (
  error: FetchBaseQueryError | ApiError | SerializedError | undefined
) => {
  if (
    error !== undefined &&
    'status' in error &&
    typeof error?.status === 'string'
  ) {
    return { error: 'Server error', isError: true };
  } else {
    return { error: undefined, isError: false };
  }
};

const checkErrors = <T, Key extends keyof T>(
  error: FetchBaseQueryError | ApiError | SerializedError | undefined,
  keys: Array<Key>
): ApiErrorReturn<T> => {
  return keys.reduce(
    (a, v) => {
      const [errorData, isNameError] = hasNameError(error, v as string);
      return {
        ...a,
        [v]: {
          error: errorData,
          isError: isNameError,
        },
      };
    },
    { mainError: checkMainError(error) }
  );
};

const useApiError = <RequestData, Key extends keyof RequestData>(
  error: FetchBaseQueryError | ApiError | SerializedError | undefined,
  keys: Array<Key>
): ApiErrorReturn<RequestData> => {
  const [keysOfRequestData] = useState(keys);
  const [errors, setErrors] = useState<ApiErrorReturn<RequestData>>({});

  useEffect(() => {
    setErrors(
      checkErrors<RequestData, keyof RequestData>(error, keysOfRequestData)
    );
  }, [error, keysOfRequestData]);

  return errors;
};

export default useApiError;
