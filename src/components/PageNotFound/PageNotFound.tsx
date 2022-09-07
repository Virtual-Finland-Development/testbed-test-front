import { Link } from 'react-router-dom';

// context
import { useAppContext, DataType } from '../../context/AppContext';

// constants
import { RouteNames } from '../../constants';

export default function PageNotFound() {
  const { dataType } = useAppContext();
  const returnRoute =
    dataType === DataType.OPEN_DATA ? RouteNames.OPEN_DATA : RouteNames.TMT;

  return (
    <div className="mx-auto my-auto p-4 text-center">
      <h2>Sivua ei löytynyt</h2>
      <p>Etsimääsi sivua ei löytnyt.</p>
      <p>
        <Link to={returnRoute}>Palaa sivustolle</Link>
      </p>
    </div>
  );
}
