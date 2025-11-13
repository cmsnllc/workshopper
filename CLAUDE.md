# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

p5.js ベースのプログラミング教材アプリケーション。小学生後半〜中学生向けに、グラフィック操作を通じてプログラミング基礎を学ぶワークショップ形式。

**開発指針:**

- `docs/spec.md` が技術仕様の正式なソース
- Cloudflare へのデプロイを前提とした設計
- ユーザー認証なし、進捗は LocalStorage で管理

## Development Commands

```bash
# 開発サーバー起動
pnpm run dev

# ビルド
pnpm run build

# プロダクションプレビュー
pnpm run preview

# Lint チェック
pnpm run lint

# TypeScript 型チェックとビルドとデプロイのドライラン
pnpm run check

# Cloudflare Workers の型定義生成
pnpm run cf-typegen
```

## Architecture

### Dual-Context Setup

プロジェクトは React フロントエンドと Cloudflare Worker バックエンドの 2 つの TypeScript コンテキストで構成:

- **React App** (`src/react-app/`): Vite でビルドされる SPA
  - `tsconfig.app.json` で設定
  - `src/react-app/main.tsx` がエントリーポイント
- **Worker** (`src/worker/`): Hono ベースの API サーバー
  - `tsconfig.worker.json` で設定
  - `src/worker/index.ts` が Cloudflare Workers のエントリーポイント

### Planned Structure (from spec.md)

```
src/
├─ components/
│  ├─ Editor.tsx           # CodeMirror ラッパー
│  ├─ Preview.tsx          # p5.js キャンバス
│  ├─ Lesson.tsx           # レッスン本体
│  └─ LessonList.tsx       # レッスン一覧
├─ lessons/
│  ├─ types.ts             # レッスンの型定義
│  ├─ 01-first-circle.ts   # レッスン定義
│  └─ index.ts             # 全レッスンのエクスポート
├─ lib/
│  ├─ p5-runner.ts         # p5.js 実行環境（インスタンスモード）
│  └─ storage.ts           # LocalStorage 操作
```

### Key Technical Decisions

**p5.js Integration:**

- インスタンスモードを使用（グローバルモードは避ける）
- ユーザーコードは `new Function()` でラップして実行
- コード変更時に既存キャンバスを削除して再生成

**Code Editor:**

- CodeMirror 6 を使用（`@uiw/react-codemirror`）
- JavaScript シンタックスハイライト

**Progress Management:**

- LocalStorage でレッスンごとの進捗とコードを保存
- データ構造: `{ lessonId, code, completed }`

**Lesson Content:**

- Markdown 形式で記述（`react-markdown` でレンダリング）
- 各レッスンは独立した TypeScript ファイルで定義

## Important Notes

- **TypeScript 設定**: 4 つの tsconfig があるが、通常触るのは `tsconfig.app.json` と `tsconfig.worker.json`
- **エラーハンドリング**: p5.js のコード実行エラーは UI でユーザーにフィードバック必須
- **TypeScript 型安全性**: `as any` の使用は禁止。型拡張が必要な場合は `declare global` を使用して適切な型定義を追加すること
  - 関数のパラメータには必ず明示的な型定義を行う
  - `any` 型の推論を避けるため、interface や type を活用する
  - 型エラーが発生した場合は、型定義ファイル（`.d.ts`）で適切な型を宣言する
  - 例: MDX コンポーネントの型は `vite-env.d.ts` で定義されている

## Testing

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
5. 実行ボタンをクリック → 3秒後にフリーズ検出エラーが表示されることを確認
6. エディタ内をクリック → Cmd+A で全選択
7. 正常なコードをタイプ（`while(true) {}` の行を削除したもの）
8. 実行ボタンをクリック → サークルが正常に表示されることを確認

**注意**: Playwright や自動テストツールでエディタの内容を変更する場合は、必ず Cmd+A で全選択してから fill() メソッドでコード全体を置き換えること。部分的な編集は CodeMirror の仮想 DOM との不整合を引き起こす可能性がある。
