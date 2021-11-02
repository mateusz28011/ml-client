import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const emptySplitApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.API_URL }),
  endpoints: () => ({}),
});
