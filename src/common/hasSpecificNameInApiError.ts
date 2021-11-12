import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { ApiError } from '../app/services/split';

const hasSpecificNameInApiError = (
  error: FetchBaseQueryError | ApiError | SerializedError | undefined,
  name: string
): boolean =>
  error !== undefined ? ('data' in error ? name in error.data : false) : false;

export default hasSpecificNameInApiError;
