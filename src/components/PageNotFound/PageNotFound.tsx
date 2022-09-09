import { Link } from 'react-router-dom';

export default function PageNotFound() {
  return (
    <div className="mx-auto my-auto p-4 text-center">
      <h2>Sivua ei löytynyt</h2>
      <p>Etsimääsi sivua ei löytnyt.</p>
      <p>
        <Link to="/">Palaa sivustolle</Link>
      </p>
    </div>
  );
}
