import { emptySplitApi, Pagination } from './';

export interface Dataset {
  id: number;
  file: string;
  name?: string;
  created: Date;
}

export const datasetsApi = emptySplitApi.injectEndpoints({
  endpoints: (build) => ({
    getDatasets: build.query<
      Pagination & { results: Array<Dataset> },
      number | void
    >({
      query: (page) => ({
        url: 'datasets/',
        params: { page },
      }),
      providesTags: ['Datasets'],
    }),
    getDataset: build.query<Required<Dataset>, number>({
      query: (id) => ({
        url: `datasets/${id}/`,
      }),
      providesTags: ['Dataset'],
    }),

    // uploadDataset: build.mutation<
    //   Dataset,
    //   Omit<Dataset, 'id' | 'file'> & { file: File }
    // >({
    //   query: (data) => ({
    //     url: 'datasets/',
    //     method: 'POST',
    //     body: data,
    //   }),
    //   invalidatesTags: ['Dataset'],
    // }),
  }),

  overrideExisting: false,
});

export const { useGetDatasetsQuery, useGetDatasetQuery } = datasetsApi;
