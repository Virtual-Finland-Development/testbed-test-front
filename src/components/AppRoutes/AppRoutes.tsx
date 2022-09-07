import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// context
import { useAppContext, DataType } from '../../context/AppContext';

// constants
import { RouteNames } from '../../constants';

// components
import Loading from '../Loading/Loading';
import PageNotFound from '../PageNotFound/PageNotFound';

const LazyOpenData = lazy(() => import('../OpenData/OpenData'));
const LazyTmt = lazy(() => import('../Tmt/Tmt'));

/**
 * RouteSentry implements 'protected routes'
 * Redirect to correct route if trying to access 'wrong' route based on selected dataType
 */
function RouteSentry({ dataType }: { dataType: DataType }) {
  const { dataType: dataTypeInState } = useAppContext();
  const LazyComponent =
    dataType === DataType.OPEN_DATA ? LazyOpenData : LazyTmt;
  const replaceRouteName =
    dataType === DataType.OPEN_DATA
      ? `/${RouteNames.TMT}`
      : `/${RouteNames.OPEN_DATA}`;

  if (dataType !== dataTypeInState) {
    return <Navigate to={replaceRouteName} replace />;
  }

  return (
    <Suspense fallback={<Loading />}>
      <LazyComponent />
    </Suspense>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path={RouteNames.OPEN_DATA}
        element={<RouteSentry dataType={DataType.OPEN_DATA} />}
      />
      <Route
        path={RouteNames.TMT}
        element={<RouteSentry dataType={DataType.TMT} />}
      />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}
