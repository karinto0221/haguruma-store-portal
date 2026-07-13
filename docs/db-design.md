# DB設計書

対象: PostgreSQL 16(`docker-compose.yml`の`db`サービス)。ORM: TypeORM 0.3(`backend/src/orders/order.entity.ts`, `backend/src/products/product.entity.ts`, `backend/src/products/product-category.entity.ts`)。
スキーマは`synchronize: false`で運用し、`backend/src/database/migrations/`配下のマイグレーションファイルのみで変更する。

## 1. ER図

```
┌───────────────────────┐         ┌────────────────────┐         ┌─────────────────────────────┐
│ product_categories      │         │ products            │         │ orders                       │
├───────────────────────┤ 1     N ├────────────────────┤ 1     N ├─────────────────────────────┤
│ PK id (serial)           │◄────────│ FK product_category_id│         │ FK product_id (varchar)       │
│    name                   │         │ PK id (varchar)      │◄────────│ PK id (uuid)                  │
│    created_at             │         │    name               │         │    customer_name              │
│    updated_at             │         │    description        │         │    customer_email             │
└───────────────────────┘         │    price_from         │         │    quantity                   │
                                     │    created_at         │         │    notes                      │
                                     │    updated_at         │         │    file_names (text[])        │
                                     └────────────────────┘         │    file_paths (text[])        │
                                                                       │    status (enum)              │
                                                                       │    payment_link               │
                                                                       │    created_at                 │
                                                                       │    updated_at                 │
                                                                       └─────────────────────────────┘
```

- `orders.product_id` → `products.id` の外部キー。`ON DELETE RESTRICT`(商品削除時、参照している注文が1件でもあれば商品削除は失敗する)。
- `products.product_category_id` → `product_categories.id` の外部キー。`ON DELETE RESTRICT`(カテゴリ削除時、参照している商品が1件でもあればカテゴリ削除は失敗する)。
- 商品名(`productName`)は`orders`側に非正規化して持たず、API応答時に`products`をJOINして都度取得する(`OrdersRepository.findAll`/`findById`で`leftJoinAndSelect`)。カテゴリ名も同様に`products`側へ非正規化していない。

## 2. テーブル定義

### 2.1 product_categories(商品カテゴリマスタ)

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---|---|---|---|---|
| id | serial(integer) | NOT NULL | 自動採番 | 主キー |
| name | varchar(255) | NOT NULL | - | カテゴリ名 |
| created_at | timestamptz | NOT NULL | now() | 作成日時 |
| updated_at | timestamptz | NOT NULL | now() | 更新日時(TypeORMの`@UpdateDateColumn`により自動更新) |

- 主キー制約: `PK_product_categories_id` (id)
- 初期データ(9件、`id`は投入順の連番): 封筒・袋 / パッケージ・箱・フォルダー / 名刺 / カード・ペーパー / 冊子・ブックレット・ZINE / ポケットフォルダー / ペーパータグ・下げ札 / シール・ステッカー・商品ラベル / ラッピングペーパー・薄葉紙
- カテゴリの追加・編集・削除を行うAPI/画面は未実装。現状はマイグレーション追加、またはDBへの直接操作で管理する。

### 2.2 products(商品マスタ)

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---|---|---|---|---|
| id | varchar(50) | NOT NULL | - | 主キー。スラッグ形式の文字列ID(例: `business-card`)。URLや`orders.product_id`から参照される |
| name | varchar(255) | NOT NULL | - | 商品名 |
| description | text | NOT NULL | - | 商品説明 |
| price_from | integer | NOT NULL | - | 参考価格(円)。実際は数量・仕様で変動する目安価格 |
| product_category_id | integer | NOT NULL | - | `product_categories.id`への外部キー |
| created_at | timestamptz | NOT NULL | now() | 作成日時 |
| updated_at | timestamptz | NOT NULL | now() | 更新日時(TypeORMの`@UpdateDateColumn`により自動更新) |

- 主キー制約: `PK_0806c755e0aca124e67c0cf6d7d` (id)
- 外部キー制約: `FK_products_product_category_id` (product_category_id → product_categories.id, ON DELETE RESTRICT, ON UPDATE NO ACTION)
- 商品の追加・編集・削除を行うAPI/画面は未実装。現状はマイグレーション追加、またはDBへの直接操作で管理する。
- 現在の`GET /products`のAPIレスポンスにはカテゴリ情報を含めていない(DB上はカテゴリ必須だが、APIレスポンスへの反映は未実装。`backend/src/products/products.service.ts`の`toProduct()`参照)。

### 2.3 orders(注文)

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---|---|---|---|---|
| id | uuid | NOT NULL | - | 主キー。アプリ側(`uuidv4()`)で発行しINSERTする。DB側の自動生成は使用していない |
| product_id | varchar(50) | NOT NULL | - | `products.id`への外部キー |
| customer_name | varchar(255) | NOT NULL | - | 注文者氏名 |
| customer_email | varchar(255) | NOT NULL | - | 注文者メールアドレス |
| quantity | integer | NOT NULL | - | 数量(1以上、DTOバリデーションのみでDB制約は無し) |
| notes | text | NULL可 | - | 備考・要望 |
| file_names | text[] | NOT NULL | `{}` | アップロードされたファイルの元ファイル名一覧 |
| file_paths | text[] | NOT NULL | `{}` | 保存先の相対パス一覧(`UPLOAD_DIR`からの相対パス、`{orderId}/{timestamp}-{sanitized name}`) |
| status | order_status(enum) | NOT NULL | `'new'` | 注文ステータス(詳細は2.4) |
| payment_link | text | NULL可 | - | 送信済みの支払いリンクURL |
| created_at | timestamptz | NOT NULL | now() | 作成日時(注文受付日時) |
| updated_at | timestamptz | NOT NULL | now() | 更新日時(TypeORMの`@UpdateDateColumn`により自動更新) |

- 主キー制約: `PK_710e2d4957aa5878dfe94e4ac2f` (id)
- 外部キー制約: `FK_ac832121b6c331b084ecc4121fd` (product_id → products.id, ON DELETE RESTRICT, ON UPDATE NO ACTION)
- `file_names`と`file_paths`は同じ並び順・同じ要素数で対応している(配列インデックスで対応関係を取る設計。DB制約による整合性保証はしておらず、アプリ側のロジックでのみ保たれている)。

### 2.4 order_status(列挙型)

`orders.status`カラムで使用するPostgresのENUM型。

| 値 | 画面上のラベル | 意味 |
|---|---|---|
| `new` | 新規注文 | 注文受付直後の初期状態 |
| `reviewing` | 内容確認中 | 管理者が内容確認中であることを手動でマークした状態 |
| `payment_link_sent` | メール送信済み | 支払いリンク送信済み(`POST /orders/:id/send-payment-link`実行後に自動遷移。管理画面から手動でもセット可能) |
| `cancelled` | キャンセル | 管理者が手動でキャンセル扱いにした状態 |

- ステータス間の遷移に業務ルール上の制約は無く、管理画面からどの値へも自由に変更可能(アプリケーション層・DB層とも遷移制約なし)。

## 3. インデックス一覧

| インデックス名 | テーブル | 対象カラム | 種別 |
|---|---|---|---|
| PK_product_categories_id | product_categories | id | PRIMARY KEY |
| PK_0806c755e0aca124e67c0cf6d7d | products | id | PRIMARY KEY |
| PK_710e2d4957aa5878dfe94e4ac2f | orders | id | PRIMARY KEY |
| IDX_775c9f06fc27ae3ff8fb26f2c4 | orders | status | INDEX(完全一致検索・ステータス絞り込み用) |
| IDX_c884e321f927d5b86aac7c8f9e | orders | created_at | INDEX(期間絞り込み・ソート用) |

- `products.product_category_id`、`orders.product_id`はFK制約のみでインデックスは付与していない(現状カテゴリ・商品ごとの絞り込みクエリが無いため)。

- キーワード検索(顧客名・メール・商品名・注文IDの部分一致)は`ILIKE '%keyword%'`の前方ワイルドカード無し検索のため、上記インデックスは効かず全件スキャンになる(現状は許容。将来的に検索対象データが増える場合は`pg_trgm`拡張+GINインデックス等の追加を検討)。

## 4. マイグレーション履歴

| ファイル | 内容 |
|---|---|
| `1783676979855-InitSchema.ts` | `products`テーブル、`order_status`型、`orders`テーブル、上記インデックス・外部キーを作成 |
| `1783676979856-SeedProducts.ts` | `backend/src/products/product.data.ts`に定義された初期商品5件(名刺・封筒・ポストカード・ラッピングペーパー・パッケージボックス)を`products`にINSERT |
| `1783908720243-AddProductCategories.ts` | `product_categories`テーブルを新設し初期カテゴリ9件をINSERT。`products`に`product_category_id`列を追加し、既存5商品にカテゴリを割り当てた上でNOT NULL制約・外部キーを付与 |

運用コマンド(`backend/package.json`):

```
npm run migration:generate -- src/database/migrations/<名前>   # エンティティとDBの差分からマイグレーションを自動生成
npm run migration:run                                          # 未実行のマイグレーションを適用
npm run migration:revert                                       # 直近のマイグレーションを1件ロールバック
```

接続先はTypeORMの共通設定ファイル`backend/src/database/data-source.ts`で管理し、CLIとアプリ本体(`app.module.ts`の`TypeOrmModule.forRoot`)の両方から同じ設定を参照する。

## 5. 接続設定(環境変数)

| 変数名 | 説明 | ローカル既定値 |
|---|---|---|
| DB_HOST | 接続先ホスト | `localhost`(docker-compose経由でbackendコンテナから接続する場合は`db`) |
| DB_PORT | 接続先ポート | `5433`(ホスト公開ポート。コンテナ間通信では`5432`) |
| DB_USER | ユーザー名 | `paper_order` |
| DB_PASSWORD | パスワード | `paper_order_password` |
| DB_NAME | データベース名 | `paper_order` |

## 6. 現状の制約・今後の検討事項

- `product_categories`・`products`・`orders`以外にテーブルは存在しない。管理者アカウント情報はDBではなく環境変数(`ADMIN_USER_ID`/`ADMIN_PASSWORD`)で管理しており、複数管理者アカウントには対応していない。
- `products.product_category_id`はDB上NOT NULLだが、`GET /products`のAPIレスポンスにはカテゴリ情報が含まれていない(未実装)。画面上でカテゴリ別に絞り込む機能も無い。
- アップロードファイルの実体(バイナリ)はDBに保存されておらず、`UPLOAD_DIR`配下のローカルディスクに保存される。`orders.file_paths`はその参照パスのみを保持する。
- `quantity`が1以上であることのDB制約(CHECK制約)は無く、アプリケーション層(DTOバリデーション)のみで担保している。
- 論理削除の仕組みは無い(注文・商品ともに物理削除のみ想定。ただし商品削除APIは未実装)。
