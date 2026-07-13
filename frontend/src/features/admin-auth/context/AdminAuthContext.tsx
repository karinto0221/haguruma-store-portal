import { createContext, ReactNode, useState } from 'react';
import { AdminCredentials } from '@/api';

interface AdminAuthContextValue {
  credentials: AdminCredentials | null;
  login: (credentials: AdminCredentials) => void;
  logout: () => void;
}

export const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

// 管理画面配下の複数ページ(注文管理・マスタ管理など)でログイン状態を共有するためのProvider。
// ID・パスワードの検証自体はここでは行わず、状態の保持のみを担当する。
export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [credentials, setCredentials] = useState<AdminCredentials | null>(null);

  const login = (creds: AdminCredentials) => setCredentials(creds);
  const logout = () => setCredentials(null);

  return (
    <AdminAuthContext.Provider value={{ credentials, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}
