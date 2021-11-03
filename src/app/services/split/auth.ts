import { emptySplitApi } from './';

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

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiration: Date;
}

export interface LogoutRespone {
  detail: string;
}

export const authApi = emptySplitApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: 'dj-rest-auth/login/',
        method: 'POST',
        body: credentials,
      }),
    }),
    refreshToken: build.mutation<void, RefreshTokenResponse>({
      query: () => ({
        url: 'dj-rest-auth/token/refresh',
        method: 'POST',
      }),
    }),
    logout: build.mutation<void, LogoutRespone>({
      query: () => ({
        url: 'dj-rest-auth/logout',
        method: 'POST',
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation } = authApi;
