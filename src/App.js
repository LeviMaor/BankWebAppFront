import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import User from './components/User';
import UserInfo from './components/UserInfo';
import UserTransactions from './components/UserTransactions';
import NewTransaction from './components/NewTransaction';
import Signup from './components/Signup';
import RequireAuth from './components/RequireAuth';
import Layout from './components/Layout';
import Unauthorized from './components/Unauthorized';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './components/AdminDashboard';
import TransactionsById from './components/TransactionsById';
import CreateAdmin from './components/CreateAdmin';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import VerifyCode from './components/VerifyCode';
import Missing from './components/Missing';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-code" element={<VerifyCode />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="unauthorized" element={<Unauthorized />} />

          <Route element={<RequireAuth allowedRoles={['user']} />}>
            <Route path="user" element={<User />}>
              <Route path="info" element={<UserInfo />} />
              <Route path="transactions" element={<UserTransactions />} />
              <Route path="newtransaction" element={<NewTransaction />} />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={['admin']} />}>
            <Route path="admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users/:id/transactions" element={<TransactionsById />} />
              <Route path="/admin/create-admin" element={<CreateAdmin />} />
            </Route>
          </Route>

          <Route path="*" element={<Missing />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
