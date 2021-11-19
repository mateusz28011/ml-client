import React from 'react';
import { useParams } from 'react-router';

const Dataset = () => {
  const { id } = useParams<{ id?: string }>();

  return <div>{id}</div>;
};

export default Dataset;
