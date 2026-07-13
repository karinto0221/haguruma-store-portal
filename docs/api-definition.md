# API定義書

対象: `backend/`(NestJS 10)。以下は実装済みエンドポイントを、実際に動作検証した結果を元に記載している。

## 1. 共通仕様

### 1.1 ベースURL

- ローカル: `http://localhost:3000`(`.env`の`PORT`で変更可)
- グローバルプレフィックス(`/api`等)は設定されていない。各コントローラーの`@Controller()`パスがそのままURLになる。

### 1.2 認証方式

管理者向けエンドポイント(表2.1で「要」と記載)は、以下2つのカスタムHTTPヘッダーが必須。

| ヘッダー名 | 説明 |
|---|---|
| `x-admin-id` | 環境変数`ADMIN_USER_ID`と完全一致する必要がある |
| `x-admin-password` | 環境変数`ADMIN_PASSWORD`と完全一致する必要がある |

- 専用のログインAPI・トークン発行の仕組みは無い。管理者向けエンドポイントを叩くたびに、毎回このヘッダーを送る(Basic認証に近いステートレス方式)。
- いずれか不一致・未設定の場合、`401 Unauthorized`を返す(詳細は3.3)。
- お客様向けエンドポイント(商品一覧取得・注文作成)は認証不要。

### 1.3 CORS

`FRONTEND_ORIGIN`環境変数(既定値`http://localhost:5173`)からのオリジンのみ許可している(`app.enableCors({ origin: ... })`)。

### 1.4 リクエストのバリデーション

グローバルに`ValidationPipe({ whitelist: true, transform: true })`を適用している。

- `whitelist: true`: DTOに定義の無いフィールドは、エラーにはならず黙って除去される。
- `transform: true`: パスパラメータ・クエリパラメータ・ボディの型変換(例: `quantity`を数値へ)を自動で行う。
- バリデーション違反時は`400 Bad Request`(詳細は3.1)。

### 1.5 エラーレスポンスの共通形式

| ケース | HTTPステータス | レスポンス例 |
|---|---|---|
| DTOバリデーションエラー | 400 | `{"message":["customerName should not be empty", "..."],"error":"Bad Request","statusCode":400}` |
| 認証エラー | 401 | `{"message":"ユーザーIDまたはパスワードが正しくありません","error":"Unauthorized","statusCode":401}` |
| リソース未検出 | 404 | `{"message":"注文が見つかりません","error":"Not Found","statusCode":404}` |
| 想定外の例外(メール送信失敗など) | 500 | `{"statusCode":500,"message":"Internal server error"}` |

> **重要な既知の挙動**: `POST /orders`はメール通知送信(`MailService.sendNewOrderNotification`)がtry/catchで保護されておらず、SMTP接続に失敗すると例外がそのまま伝播し、クライアントには**500エラーが返る**。しかし、この時点で**注文データ・添付ファイルは既にDB/ディスクへ保存済み**であるため、クライアントからは失敗に見えても実際には注文が成立している(実機検証済み: `SMTP_HOST`を到達不能な宛先にして注文を送信したところ、APIは500を返したが、Postgresの`orders`テーブルには正しく1件登録されていた)。同様に`POST /orders/:id/send-payment-link`もメール送信をtry/catchしておらず、こちらはメール送信より前にステータス更新を行っていないため、送信失敗時はステータスが`payment_link_sent`に更新されない(=注文側は失敗のまま)。

---

## 2. エンドポイント一覧

| # | メソッド | パス | 概要 | 認証 |
|---|---|---|---|---|
| 1 | GET | `/products` | 商品一覧取得 | 不要 |
| 2 | POST | `/orders` | 注文作成 | 不要 |
| 3 | GET | `/orders` | 注文一覧取得・検索 | 要 |
| 4 | PATCH | `/orders/:id/status` | 注文ステータス変更 | 要 |
| 5 | POST | `/orders/:id/send-payment-link` | 支払いリンク送信 | 要 |

---

## 3. エンドポイント詳細

### 3.1 GET /products — 商品一覧取得

- 認証: 不要
- リクエストパラメータ: 無し

**レスポンス 200**

```json
[
  {
    "id": "business-card",
    "name": "名刺",
    "description": "デザイン入稿によるオリジナル名刺印刷",
    "priceFrom": 3000
  }
]
```

| フィールド | 型 | 説明 |
|---|---|---|
| id | string | 商品ID(スラッグ) |
| name | string | 商品名 |
| description | string | 商品説明 |
| priceFrom | number | 参考価格(円) |

商品は`created_at`昇順で返る(登録順)。並び替え・絞り込みクエリパラメータは無い。

---

### 3.2 POST /orders — 注文作成

- 認証: 不要
- Content-Type: `multipart/form-data`

**リクエストフィールド**

| フィールド名 | 型 | 必須 | バリデーション | 説明 |
|---|---|---|---|---|
| productId | string | ○ | 空文字不可 | 商品ID。DBに存在しない場合は404 |
| customerName | string | ○ | 空文字不可 | 注文者氏名 |
| customerEmail | string | ○ | メール形式 | 注文者メールアドレス |
| quantity | number | ○ | 整数、1以上 | 数量(フォームでは文字列で送られ、サーバー側で数値変換) |
| notes | string | 任意 | - | 備考 |
| files | file(複数) | 任意 | 最大5ファイル、1ファイルあたり最大20MB | デザインファイル。フィールド名は`files`固定 |

**レスポンス 201**

```json
{ "orderId": "403282b4-3cc5-40bb-825e-bddad7117d07" }
```

作成された注文の全項目は返らず、`orderId`のみ返る。

**エラー**

| ケース | ステータス | レスポンス例 |
|---|---|---|
| 必須項目欠落・型不正 | 400 | `{"message":["customerName should not be empty","quantity must not be less than 1"],"error":"Bad Request","statusCode":400}` |
| ファイル数が5件超過 | 400 | `{"message":"Unexpected field","error":"Bad Request","statusCode":400}` |
| productIdに一致する商品が無い | 404 | `{"message":"指定された商品が見つかりません","error":"Not Found","statusCode":404}` |
| メール通知送信に失敗 | 500 | `{"statusCode":500,"message":"Internal server error"}`(1.5の注記のとおり、注文自体は保存済み) |

**処理内容(参考)**

1. `productId`が実在するか確認
2. 添付ファイルをディスク(`UPLOAD_DIR/{orderId}/`)に保存
3. 注文をDB(`orders`テーブル)に`status: 'new'`で保存
4. `ADMIN_NOTIFY_EMAIL`宛に新規注文通知メールを送信(SMTP未設定時はログ出力のみでスキップ、エラーにはならない)

---

### 3.3 GET /orders — 注文一覧取得・検索

- 認証: 要(`x-admin-id` / `x-admin-password`)

**クエリパラメータ(すべて任意、AND条件)**

| パラメータ | 型 | 説明 |
|---|---|---|
| status | string | `new` / `reviewing` / `payment_link_sent` / `cancelled` のいずれか。それ以外の値は400エラー |
| keyword | string | 顧客名・顧客メール・商品名・注文IDのいずれかに大文字小文字を区別しない部分一致(`ILIKE '%keyword%'`) |
| dateFrom | string | `YYYY-MM-DD`形式。この日の`00:00:00.000Z`以降の注文が対象 |
| dateTo | string | `YYYY-MM-DD`形式。この日の`23:59:59.999Z`以前の注文が対象 |

日付の境界判定はUTC基準(サーバーのタイムゾーン設定に依存し、JSTとのずれを補正する処理は無い)。

**レスポンス 200**

```json
[
  {
    "id": "403282b4-3cc5-40bb-825e-bddad7117d07",
    "productId": "business-card",
    "productName": "名刺",
    "customerName": "テスト太郎",
    "customerEmail": "test@example.com",
    "quantity": 2,
    "notes": "DB移行確認用の注文",
    "fileNames": [],
    "filePaths": [],
    "status": "new",
    "createdAt": "2026-07-10T09:53:28.137Z"
  }
]
```

| フィールド | 型 | 説明 |
|---|---|---|
| id | string(uuid) | 注文ID |
| productId | string | 商品ID |
| productName | string | 商品名(`products`テーブルとJOINして取得。該当商品が存在しない状態は通常発生しない) |
| customerName | string | 注文者氏名 |
| customerEmail | string | 注文者メールアドレス |
| quantity | number | 数量 |
| notes | string \| undefined | 備考。未入力時はキー自体が存在しない |
| fileNames | string[] | 添付ファイルの元ファイル名一覧 |
| filePaths | string[] | サーバー内保存パス一覧(ダウンロード用の公開URLではない。この値を使って直接ファイルを取得するAPIは無い) |
| status | string | 注文ステータス(`new`/`reviewing`/`payment_link_sent`/`cancelled`) |
| paymentLink | string \| undefined | 送信済み支払いリンク。未送信時はキー自体が存在しない |
| createdAt | string(ISO8601) | 作成日時 |

一覧は`createdAt`降順(新しい注文が先頭)。ページネーションは無く、条件に合致する全件を返す。

**エラー**

| ケース | ステータス |
|---|---|
| `x-admin-id`/`x-admin-password`が無い、または不一致 | 401 |
| `status`に不正な値を指定 | 400 |

---

### 3.4 PATCH /orders/:id/status — 注文ステータス変更

- 認証: 要(`x-admin-id` / `x-admin-password`)

**パスパラメータ**

| 名前 | 型 | 説明 |
|---|---|---|
| id | string(uuid) | 注文ID |

**リクエストボディ**

```json
{ "status": "reviewing" }
```

| フィールド | 型 | 必須 | バリデーション |
|---|---|---|---|
| status | string | ○ | `new` / `reviewing` / `payment_link_sent` / `cancelled` のいずれか |

ステータス遷移に業務ルール上の制約は無い(例: `payment_link_sent`から`new`に戻す、といった操作もAPIレベルでは許可される)。`payment_link`フィールドの更新・クリアは行わない(過去に送信したリンクは残ったままになる)。

**レスポンス 200**

3.3と同じ`OrderRecord`形式(更新後の内容)。

**エラー**

| ケース | ステータス | レスポンス例 |
|---|---|---|
| 認証失敗 | 401 | 3.3と同じ |
| `status`が不正な値 | 400 | `{"message":["status must be one of the following values: new, reviewing, payment_link_sent, cancelled"],"error":"Bad Request","statusCode":400}` |
| `id`に一致する注文が無い | 404 | `{"message":"注文が見つかりません","error":"Not Found","statusCode":404}` |

---

### 3.5 POST /orders/:id/send-payment-link — 支払いリンク送信

- 認証: 要(`x-admin-id` / `x-admin-password`)

**パスパラメータ**

| 名前 | 型 | 説明 |
|---|---|---|
| id | string(uuid) | 注文ID |

**リクエストボディ**

```json
{ "paymentLink": "https://example.com/pay/123" }
```

| フィールド | 型 | 必須 | バリデーション |
|---|---|---|---|
| paymentLink | string | ○ | URL形式(プロトコル必須。`@IsUrl({ require_protocol: true })`) |

**処理内容**

1. 注文の存在確認(無ければ404)
2. 顧客に支払い案内メールを送信(SMTP未設定時はログ出力のみでスキップし、正常応答する)
3. メール送信に成功した場合のみ、ステータスを`payment_link_sent`に更新し、`paymentLink`を保存

**レスポンス 200**

3.3と同じ`OrderRecord`形式(`status: "payment_link_sent"`, `paymentLink`が設定された状態)。

**エラー**

| ケース | ステータス | レスポンス例 |
|---|---|---|
| 認証失敗 | 401 | 3.3と同じ |
| `paymentLink`がURL形式でない | 400 | `{"message":["paymentLink must be a URL address"],"error":"Bad Request","statusCode":400}` |
| `id`に一致する注文が無い | 404 | `{"message":"注文が見つかりません","error":"Not Found","statusCode":404}` |
| メール送信に失敗(SMTP到達不可・認証エラー等) | 500 | `{"statusCode":500,"message":"Internal server error"}`(この場合ステータスは更新されない) |

---

## 4. 未実装のエンドポイント(参考)

現在の画面・機能から参照されそうだが、実装されていないもの:

- 商品の作成・更新・削除API(`POST/PUT/DELETE /products`は無い)
- 注文の個別取得API(`GET /orders/:id`は無い。管理画面は一覧APIの結果をフロント側で保持して使い回している)
- 添付ファイルのダウンロード・プレビューAPI(`filePaths`を使って実ファイルを取得する手段が無い)
- 管理者ログイン専用API・ログアウトAPI・トークンのリフレッシュ(管理画面は`GET /orders`の成否をログイン確認に流用している)
- 注文の削除API
