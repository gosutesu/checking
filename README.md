# checking

パッケージの最新バージョンをチェックし、更新が必要な場合にSlackに通知するCLIツールです。

## 機能

- 指定したディレクトリ内のpackage.jsonを検出
- 依存パッケージの最新バージョンをチェック
- 現在のバージョンと最新バージョンが異なる場合にSlackに通知
- TypeScriptで実装された型安全なツール
- monorepo構成でも動作可能

## 使い方

```bash
npm run build && npm run start -- --target-dir <監視対象のディレクトリパス> --webhook-url <Slack Incoming Webhook URL>
```

### オプション

- `--target-dir`: 監視対象のディレクトリパスを指定します（必須）
- `--webhook-url`: Slack Incoming WebhookのURLを指定します（必須）

### 例

```bash
npm run build && npm run start -- --target-dir ./my-project --webhook-url https://hooks.slack.com/services/XXXXX/XXXXX/XXXXX
```

## 動作の流れ

1. 指定されたディレクトリからワークスペースのルートを特定
2. package.jsonから依存関係の一覧を取得
3. 各パッケージの最新バージョンを確認
4. 現在のバージョンと最新バージョンを比較
5. 更新が必要なパッケージがある場合、Slackに通知

## 必要要件

- Node.js 18.0.0以上
- npm 7.0.0以上

## ライセンス

ISC

## 作者

gosutesu
