import React from 'react';
import { useGetAlgorithmsDataCompareQuery } from '../../app/services/split/clusterings';
import qs from 'qs';

const CompareAlgorithms = ({
  querySearchIds,
  clusteringId,
}: {
  querySearchIds: string;
  clusteringId: number;
}) => {
  const { data, isError, isLoading, isFetching } =
    useGetAlgorithmsDataCompareQuery({
      id: clusteringId,
      ids: querySearchIds,
    });
  console.log(data);

  return <div>aaaaaa</div>;
};

export default CompareAlgorithms;
