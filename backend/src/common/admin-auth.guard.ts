import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

// 簡易的な管理者認証。ヘッダー `x-admin-id` / `x-admin-password` が
// ADMIN_USER_ID / ADMIN_PASSWORD と一致していれば管理者操作
// (注文一覧の閲覧・検索・ステータス変更・支払いリンク送信)を許可する。
// 本番でユーザー管理が必要になったら、ここをCognito等のJWT検証に差し替える想定。
@Injectable()
export class AdminAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const id = req.headers['x-admin-id'];
    const password = req.headers['x-admin-password'];
    const expectedId = process.env.ADMIN_USER_ID;
    const expectedPassword = process.env.ADMIN_PASSWORD;

    if (!expectedId || !expectedPassword || id !== expectedId || password !== expectedPassword) {
      throw new UnauthorizedException('ユーザーIDまたはパスワードが正しくありません');
    }
    return true;
  }
}
