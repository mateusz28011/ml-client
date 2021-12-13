import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import qs from 'qs';

const useQuerySearch = () => {
  const location = useLocation();
  const [querySearch, setQuerySearch] = useState(
    qs.parse(location.search, { ignoreQueryPrefix: true })
  );

  useEffect(() => {
    setQuerySearch(qs.parse(location.search, { ignoreQueryPrefix: true }));
  }, [location.search]);

  return querySearch;
};

export default useQuerySearch;
