import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
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
    <div className="page">
      <div className="header">
        <span className="kicker">ADMIN</span>
        <h1>管理者ログイン</h1>
      </div>
      <p className="subtitle">ユーザーIDとパスワードを入力してください。</p>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <Label htmlFor="loginId">ユーザーID</Label>
          <Input
            id="loginId"
            type="text"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            autoComplete="username"
          />
        </div>
        <div className="field">
          <Label htmlFor="loginPassword">パスワード</Label>
          <Input
            id="loginPassword"
            type="password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        {error && <div className="error-box">{error}</div>}
        <Button type="submit" disabled={loading || !loginId || !loginPassword} className="w-full">
          {loading ? 'ログイン中...' : 'ログイン'}
        </Button>
      </form>
    </div>
  );
}
