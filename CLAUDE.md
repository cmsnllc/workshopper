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
