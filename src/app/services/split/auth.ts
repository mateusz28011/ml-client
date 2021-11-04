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
  access: string;
  refresh: string;
  user: User;
}

export interface RefreshTokenResponse {
  access: string;
  refresh: string;
  accessTokenExpiration: Date;
}

export interface LogoutRespone {
  detail: string;
}

export const authApi = emptySplitApi.injectEndpoints({
  endpoints: (build) => ({
    getLoggedUser: build.query<User, void>({
      query: () => ({
        url: 'dj-rest-auth/user/',
      }),
    }),
    login: build.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: 'dj-rest-auth/login/',
        method: 'POST',
        body: credentials,
      }),
    }),
    refreshToken: build.mutation<RefreshTokenResponse, void>({
      query: () => ({
        url: 'dj-rest-auth/token/refresh/',
        method: 'POST',
      }),
    }),
    logout: build.mutation<LogoutRespone, void>({
      query: () => ({
        url: 'dj-rest-auth/logout/',
        method: 'POST',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useLazyGetLoggedUserQuery,
  useRefreshTokenMutation,
} = authApi;
