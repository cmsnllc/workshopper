# AGENTS.md

This file provides guidance to coding agents when working with code in this repository.

## Project Overview

p5.js ベースのプログラミング教材アプリケーション。小学生後半〜中学生向けに、グラフィック操作を通じてプログラミング基礎を学ぶワークショップ形式。

- Cloudflare Workers にデプロイする (静的アセット + Hono の Worker)
- ユーザー認証なし、進捗は LocalStorage で管理

## Development Commands

Node は 24 (`mise.toml`)、パッケージマネージャは pnpm。ツールチェーンは [Vite+](https://viteplus.dev/) (`vp`)。dev / build は Vite、lint は Oxlint、型チェックは tsgolint が担う。ESLint と `tsc` は使っていない。

```bash
# 開発サーバー起動
pnpm run dev

# 型チェックしてからビルド
pnpm run build

# プロダクションプレビュー
pnpm run preview

# Lint チェック
pnpm run lint

# 型チェックだけ
pnpm run typecheck

# Lint + 型チェック + ビルド + デプロイのドライラン
pnpm run check

# Cloudflare Workers の型定義生成 (worker-configuration.d.ts を再生成)
pnpm run cf-typegen

# デプロイ (先に build が要る)
pnpm run build && pnpm run deploy
```

## Architecture

### Dual-Context Setup

React フロントエンドと Cloudflare Worker バックエンドの 2 つの TypeScript コンテキストで構成:

- **React App** (`src/react-app/`): Vite でビルドされる SPA
  - `tsconfig.app.json` で設定
  - `src/react-app/main.tsx` がエントリーポイント
- **Worker** (`src/worker/`): Hono ベースの API サーバー
  - `tsconfig.worker.json` で設定
  - `src/worker/index.ts` が Cloudflare Workers のエントリーポイント
  - 今はテンプレート由来の `/api/` だけで、アプリからは呼んでいない

`wrangler.json` の `assets` が `dist/client` を SPA として配信する。

### Structure

```
public/
├─ p5-runner.html          # ユーザーコードを実行する iframe の中身
└─ images/                 # レッスンで使う画像
src/
├─ react-app/
│  ├─ App.tsx              # レイアウト、CodeMirror エディタ、レッスン/演習の状態管理
│  ├─ components/
│  │  ├─ Preview.tsx       # プレビュー枠、エラー表示、console 出力
│  │  ├─ LessonList.tsx    # レッスン一覧 (ID 先頭 2 桁でグループ化)
│  │  ├─ LessonContent.tsx # MDX レッスン本文の表示
│  │  └─ ExerciseButton.tsx
│  ├─ constants/
│  │  └─ exercises.ts      # EXERCISE_IDS (全レッスンで一意)
│  ├─ lessons/
│  │  ├─ types.ts          # レッスンの型定義
│  │  ├─ *.mdx             # レッスン本体
│  │  └─ index.ts          # 全レッスンの登録 (表示順)
│  └─ lib/
│     ├─ iframe-store.ts   # iframe の生成・heartbeat 監視・フリーズ復旧
│     └─ storage.ts        # LocalStorage 操作
└─ worker/
   └─ index.ts
docs/
├─ spec.md                 # 初期の技術仕様 (下記のとおり実装とは差がある)
├─ 2025-lesson-structure.md, 2025-lessons.md  # レッスン構成・内容の設計
└─ 2024.md, 2024.docx      # 2024 年版の教材
```

### Key Technical Decisions

**p5.js の実行:**

- ユーザーコードは `sandbox="allow-scripts"` の iframe (`public/p5-runner.html`) の中で動く
- p5.js は iframe 内で CDN から読む (`package.json` の依存ではない)。バージョンは `p5-runner.html` の `<script>` で決まる
- グローバルモード。コードを間接 `eval` してから `new p5()` する
- 親との通信は `postMessage`
  - 親 → iframe: `run` / `stop` / `start`
  - iframe → 親: `heartbeat` (100ms ごと) / `success` / `error` / `console`
- `println` は iframe 側で `console.log` に流すポリフィル

**フリーズ検出:**

- `iframe-store.ts` が heartbeat を監視し、2 秒途絶えたら iframe を作り直す
- `while(true) {}` のような無限ループでもページ全体は固まらない
- URL に `?debug` を付けると iframe の状態がプレビューに出る

**Code Editor:**

- CodeMirror 6 (`@uiw/react-codemirror`)、JavaScript シンタックスハイライト

**Progress Management (`lib/storage.ts`):**

- `workshopper-progress`: 演習 ID ごとの `{ code, lastModified }`
- `workshopper-current-state`: 開いているレッスン・ステップ・演習

**Lesson Content:**

- MDX (`@mdx-js/rollup` + `remark-gfm`)。`react-markdown` は使っていない
- 各 `.mdx` が `frontmatter` (`LessonMeta`) を export し、`lessons/index.ts` に登録する
- 演習 ID は `constants/exercises.ts` に追加する。LocalStorage のキーになるので変えると保存済みコードが読めなくなる
- MDX の型は `vite-env.d.ts` で宣言している

### docs/spec.md との差

`docs/spec.md` は着手時の仕様で、次の点は実装が正:

- デプロイ先は Cloudflare Pages ではなく Workers
- p5.js はインスタンスモード + `new Function()` ではなく、iframe + グローバルモード
- レッスンは `.ts` + `react-markdown` ではなく MDX
- ディレクトリは `src/` 直下ではなく `src/react-app/`

## Important Notes

- **TypeScript 設定**: 4 つの tsconfig があるが、通常触るのは `tsconfig.app.json` と `tsconfig.worker.json`
- **Lint 設定**: `vite.config.ts` の `lint` ブロックに書く。`.oxlintrc.json` や `eslint.config.js` は置かない
- **型チェック**: `lint.options.typeCheck` が有効で、`vp check` / `vp lint` が 3 つの tsconfig (app / node / worker) をまとめて検査する
- **フォーマッタ**: Oxfmt は未導入。素の `vp check` はフォーマット差分で落ちるので、script は `--no-fmt` を付けている
- **`vp` と script の名前衝突**: `vp check` / `vp lint` は Vite+ の組み込みコマンドで、`package.json` の script とは別物。script を回すときは `pnpm run check` / `pnpm run lint`
- **`vite` の実体**: `pnpm-workspace.yaml` の catalog / overrides で `vite` を `@voidzero-dev/vite-plus-core` に差し替えている。Vite+ のバージョンを上げるときはここを変える
- **エラーハンドリング**: p5.js のコード実行エラーは UI でユーザーにフィードバック必須
- **TypeScript 型安全性**: `as any` の使用は禁止。型拡張が必要な場合は `declare global` を使用して適切な型定義を追加すること
  - 関数のパラメータには必ず明示的な型定義を行う
  - `any` 型の推論を避けるため、interface や type を活用する
  - 型エラーが発生した場合は、型定義ファイル（`.d.ts`）で適切な型を宣言する

## Testing

自動テストは無い。確認は `pnpm run lint` / `pnpm run check` とブラウザでの手動操作。

### フリーズ検出・復旧機能のテスト

ブラウザの CodeMirror エディタで手動編集してテストする場合：

1. ページをリロードしてクリーンな状態にする
2. エディタ内をクリックしてフォーカス
3. Cmd+A で全選択
4. 以下のコードをタイプ（コピー&ペーストではなくタイプする）:
   ```javascript
   function setup() {
     createCanvas(400, 400);
     while(true) {}
   }

   function draw() {
     background(220);
     circle(200, 200, 100);
   }
   ```
5. 実行ボタンをクリック → 数秒後にフリーズ検出エラーが表示されることを確認
6. エディタ内をクリック → Cmd+A で全選択
7. 正常なコードをタイプ（`while(true) {}` の行を削除したもの）
8. 実行ボタンをクリック → サークルが正常に表示されることを確認

**注意**: Playwright や自動テストツールでエディタの内容を変更する場合は、必ず Cmd+A で全選択してから fill() メソッドでコード全体を置き換えること。部分的な編集は CodeMirror の仮想 DOM との不整合を引き起こす可能性がある。
