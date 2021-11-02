import { emptySplitApi } from './emptySplitApi';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  joinDate: Date;
  isStaff: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

const authApi = emptySplitApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: 'dj-rest-auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation } = authApi;
