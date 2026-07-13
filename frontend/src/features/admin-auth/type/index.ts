import { AdminCredentials } from '@/api';

export interface LoginFormProps {
  loading: boolean;
  error: string;
  onLogin: (credentials: AdminCredentials) => void | Promise<void>;
}
