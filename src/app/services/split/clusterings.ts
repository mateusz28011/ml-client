import { emptySplitApi, Pagination } from './';

export interface Clustering {
  id: number;
  name?: string;
  created: Date;
}

export interface PostClustering {
  name: string;
  dataset: number;
}

export interface AlgorithmData {
  id: number;
  taskStatus: string;
  // resultData:string;
  // algorithm:number;
  algorithmDisplay: string;
  clustersCount: number;
}

export interface PostAlgorithmData {
  algorithm: number;
  clustersCount: number;
}

export const clusteringsApi = emptySplitApi.injectEndpoints({
  endpoints: (build) => ({
    getClusterings: build.query<
      Pagination & { results: Array<Clustering> },
      { id: number; page?: number }
    >({
      query: ({ id, page }) => ({
        url: `datasets/${id}/clusterings/`,
        params: { page },
      }),
      providesTags: ['Clusterings'],
    }),
    postClustering: build.mutation<Clustering, PostClustering>({
      query: (data) => ({
        url: `/clusterings/`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Clusterings'],
    }),
    getAlgorithmsData: build.query<
      Pagination & { results: Array<AlgorithmData> },
      { id: number; page?: number }
    >({
      query: ({ id, page }) => ({
        url: `clusterings/${id}/algorithms/`,
        params: { page },
      }),
      providesTags: ['AlgorithmsData'],
    }),
    postAlgorithmData: build.mutation<
      void,
      { id: number; data: PostAlgorithmData }
    >({
      query: ({ id, data }) => ({
        url: `clusterings/${id}/algorithms/`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['AlgorithmsData'],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetClusteringsQuery,
  usePostClusteringMutation,
  useGetAlgorithmsDataQuery,
  usePostAlgorithmDataMutation,
} = clusteringsApi;
