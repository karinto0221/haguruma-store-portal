import { Controller, Post, UseGuards } from '@nestjs/common';
import { AdminAuthGuard } from '../common/admin-auth.guard';

@Controller('admin')
export class AdminController {
  // 管理画面のログイン確認専用。ヘッダーのID/パスワードがガードを通れば200を返すだけで、
  // 具体的なデータは何も返さない(フロント側は成功したらcredentialsを保持して以降のAPI呼び出しに使う)。
  @UseGuards(AdminAuthGuard)
  @Post('login')
  login() {
    return { ok: true };
  }
}
