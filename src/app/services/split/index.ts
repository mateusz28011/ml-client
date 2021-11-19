import { createApi } from '@reduxjs/toolkit/query/react';

import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
// import { clearUser } from '../../../features/auth/authSlice';

export type ApiError = { data: any; status: number };

export interface Pagination {
  count: number;
  next: number;
  previous: number;
  totalPages: number;
  currentPage: number;
}

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API_URL,
  credentials: 'include',
});
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError | ApiError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    const refreshResult = await baseQuery(
      { url: '/dj-rest-auth/token/refresh/', method: 'POST' },
      api,
      extraOptions
    );
    if (refreshResult.data) {
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch({ type: 'auth/clearUser' });
    }
  }
  return result;
};

export const emptySplitApi = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Dataset'],
  endpoints: () => ({}),
});
