import { Routes, Route } from 'react-router-dom';

// components
import Login from '../Login/Login';
import AuthHandler from '../AuthHandler/AuthHandler';
import PageNotFound from '../PageNotFound/PageNotFound';

export default function LoginRoutes() {
  return (
    <Routes>
      <Route index element={<Login />} />
      <Route path="auth" element={<AuthHandler />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}
