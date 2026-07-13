import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { loginAdmin, AdminCredentials } from '@/api';
import { AdminAuthProvider, useAdminAuth, LoginForm } from '@/features/admin-auth';
import AdminLayout from './AdminLayout';

// /admin配下のルートに適用するゲート。ログイン状態はAdminAuthProviderで
// このコンポーネント配下(=管理画面配下の全ページ)に共有される。
function AdminGateInner() {
  const { credentials, login, logout } = useAdminAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (creds: AdminCredentials) => {
    setLoading(true);
    setError('');
    try {
      await loginAdmin(creds);
      login(creds);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (!credentials) {
    return <LoginForm loading={loading} error={error} onLogin={handleLogin} />;
  }

  return (
    <AdminLayout onLogout={logout}>
      <Outlet />
    </AdminLayout>
  );
}

export default function AdminGate() {
  return (
    <AdminAuthProvider>
      <AdminGateInner />
    </AdminAuthProvider>
  );
}
