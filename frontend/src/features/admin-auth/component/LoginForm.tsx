import { FormEvent, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoginFormProps } from '../type';

export default function LoginForm({ loading, error, onLogin }: LoginFormProps) {
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onLogin({ id: loginId, password: loginPassword });
  };

  return (
    <div className="admin-login-page">
      <Card className="admin-login-card">
        <CardHeader className="admin-login-header">
          <div className="admin-login-icon" aria-hidden="true">
            <ShieldCheck />
          </div>
          <span className="admin-login-kicker">ADMIN PORTAL</span>
          <CardTitle className="admin-login-title">管理者ログイン</CardTitle>
          <CardDescription>管理画面を利用するアカウントでログインしてください。</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="admin-login-form" onSubmit={handleSubmit}>
            <div className="admin-login-field">
              <Label htmlFor="loginId">ユーザーID</Label>
              <Input
                id="loginId"
                type="text"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                autoComplete="username"
                placeholder="ユーザーIDを入力"
                autoFocus
              />
            </div>
            <div className="admin-login-field">
              <Label htmlFor="loginPassword">パスワード</Label>
              <Input
                id="loginPassword"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="パスワードを入力"
              />
            </div>
            {error && <div className="error-box admin-login-error" role="alert">{error}</div>}
            <Button type="submit" disabled={loading || !loginId || !loginPassword} className="admin-login-submit">
              {loading ? 'ログイン中...' : 'ログイン'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
