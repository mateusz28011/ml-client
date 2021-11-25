import { Button } from '@chakra-ui/button';
import React from 'react';
import { useStartAlgorithmMutation } from '../../app/services/split/clusterings';

const StartAlgorithm = ({
  clusteringId,
  algorithmId,
}: {
  clusteringId: number;
  algorithmId: number;
}) => {
  const [startAlgorithm, { data, isLoading, isSuccess, isError }] =
    useStartAlgorithmMutation();
  console.log(data);
  return (
    <Button
      isDisabled={isLoading}
      onClick={() =>
        startAlgorithm({ clusteringId: clusteringId, id: algorithmId })
      }
    >
      START
    </Button>
  );
};

export default StartAlgorithm;
