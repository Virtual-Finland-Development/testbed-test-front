import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// constants
import { RouteNames } from '../../constants';

// components
import DataTypeSelect from '../DataTypeSelect/DataTypeSelect';
import PageNotFound from '../PageNotFound/PageNotFound';
import Loading from '../Loading/Loading';

const LazyOpenData = lazy(() => import('../OpenData/OpenData'));
const LazyTmt = lazy(() => import('../Tmt/Tmt'));

export default function AppRoutes() {
  return (
    <Routes>
      <Route index element={<DataTypeSelect />} />
      <Route
        path={RouteNames.OPEN_DATA}
        element={
          <Suspense fallback={<Loading />}>
            <LazyOpenData />
          </Suspense>
        }
      />
      <Route
        path={RouteNames.TMT}
        element={
          <Suspense fallback={<Loading />}>
            <LazyTmt />
          </Suspense>
        }
      />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}
