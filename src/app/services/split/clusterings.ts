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

export interface AlgorithmDataList {
  id: number;
  taskStatus: string | null;
  algorithmDisplay: string;
  clustersCount: number;
}

interface Scores {
  calinskiHarabaszScore: string;
  daviesBouldinScore: string;
  silhouetteScore: string;
}

export interface AlgorithmData extends AlgorithmDataList {
  resultData: string | null;
  algorithm: number;
  scores: Scores | null;
  plot2dPoints: string | null;
  plot3dPoints: string | null;
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
      Pagination & { results: Array<AlgorithmDataList> },
      { id: number; page?: number }
    >({
      query: ({ id, page }) => ({
        url: `clusterings/${id}/algorithms/`,
        params: { page },
      }),
      providesTags: ['AlgorithmsData'],
    }),
    getAlgorithmData: build.query<
      AlgorithmData,
      { clusteringId: number; id: number }
    >({
      query: ({ clusteringId, id }) => ({
        url: `clusterings/${clusteringId}/algorithms/${id}/`,
      }),
      providesTags: ['AlgorithmData'],
    }),
    startAlgorithm: build.mutation<void, { clusteringId: number; id: number }>({
      query: ({ clusteringId, id }) => ({
        url: `clusterings/${clusteringId}/algorithms/${id}/start/`,
        method: 'POST',
      }),
      invalidatesTags: ['AlgorithmData', 'AlgorithmsData'],
    }),
    deleteAlgorithm: build.mutation<void, { clusteringId: number; id: number }>(
      {
        query: ({ clusteringId, id }) => ({
          url: `clusterings/${clusteringId}/algorithms/${id}/`,
          method: 'DELETE',
        }),
        invalidatesTags: ['AlgorithmData', 'AlgorithmsData'],
      }
    ),
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
  useGetAlgorithmDataQuery,
  useStartAlgorithmMutation,
  useDeleteAlgorithmMutation,
} = clusteringsApi;
