# AGENTS.md

This file provides guidance to coding agents when working with code in this repository.

## Project Overview

p5.js ベースのプログラミング教材アプリケーション。小学生後半〜中学生向けに、グラフィック操作を通じてプログラミング基礎を学ぶワークショップ形式。

- Cloudflare Workers にデプロイする。[Vike](https://vike.dev/) + Hono で、ページは Worker がサーバーサイドレンダリングする
- ユーザー認証なし、進捗は LocalStorage で管理

## Development Commands

Node は 24 (`mise.toml`)、パッケージマネージャは pnpm。ツールチェーンは [Vite+](https://viteplus.dev/) (`vp`) で、設定は `vp create` の標準テンプレに合わせている。dev / build は Vite、lint は Oxlint、フォーマットは Oxfmt。ESLint は使っていない。

```bash
# 開発サーバー起動
pnpm run dev

# 型チェックしてからビルド
pnpm run build

# プロダクションプレビュー
pnpm run preview

# Lint チェック
pnpm run lint

# フォーマット + Lint + 型チェック (直せるものは自動修正)
pnpm exec vp check --fix

# フォーマット + Lint + 型チェック + ビルド + デプロイのドライラン
pnpm run check

# theme/tokens.json から Tailwind のテーマ (theme/dist/theme.css) を生成
# dev / build / check の前に自動で走る。vp check を直接叩く前は手で回す
pnpm run theme

# Cloudflare Workers の型定義生成 (worker-configuration.d.ts を再生成)
pnpm run cf-typegen

# 手でデプロイする場合 (先に build が要る)。普段は打たない。下の「デプロイ」を参照
pnpm run build && pnpm run deploy
```

### デプロイ

デプロイは Cloudflare の GitHub integration が行う。repo に GitHub Actions などの CI 設定は無く、手で `pnpm run deploy` を打つ必要もない。

## Architecture

### Vike + Hono

cmsn.llc と同じ `vike` + `vike-react` + `@vikejs/hono` の構成。違いは、こちらはブラウザ側でも React を動かす (クライアントルーティングあり) こと。

- **ページ** (`pages/`): Vike のページ。`tsconfig.app.json` に入る
  - `/` (`pages/index/`): 中身は持たず、ブラウザで前回開いていたページへ送る
  - `/lessons/...` (`pages/lesson/`): 解説ページと演習ページ。`+route.ts` が URL を見て振り分ける
  - `pages/_error/`: 404 とエラー
- **部品とロジック** (`src/react-app/`): コンポーネント、レッスン、`lib/`
- **Worker** (`+server.ts`): Hono に `vike(app)` を載せただけ。`tsconfig.worker.json` に入る
- `index.html` は無い。HTML は Vike が作る

**サーバーで描くもの、描かないもの:**

- 解説ページ (ヘッダー、レッスン一覧、MDX の本文) は Worker が HTML にして返し、ブラウザで hydrate する
- 演習の画面 (`ExerciseView`) は localStorage と iframe を使うので、サーバーでは描かない。`pages/lesson/+Page.tsx` が hydrate のあとに `lazy()` で読み込む
- サーバーでも読まれるファイルから、ブラウザ専用のものを import しない。`lib/iframe-store.ts` は読み込んだ時点で `window` を触るし、CodeMirror も Worker では動かない。`lib/code-theme.ts` (サーバーでも読む) と `lib/editor-theme.ts` (CodeMirror 用) を分けているのはこのため
- `localStorage` を読むのは effect の中か、`ExerciseView` 以下だけ

**静的ファイル:**

- `wrangler.json` の `assets` は `html_handling: none` / `not_found_handling: none`。`public/` とビルド済みの JS/CSS は Workers の assets が先に返し、当たらなかったパスだけ Worker (Vike) に来る
- `html_handling` を既定に戻すと `/p5-runner.html` が `/p5-runner` へ 307 で飛ばされ、iframe を作るたびに 1 往復増える

### Structure

```
+server.ts                 # Worker のエントリーポイント (Hono + Vike)
pages/
├─ +config.ts              # vike-react の設定、既定のタイトル
├─ +Layout.tsx             # 全ページ共通の枠 (ヘッダー)。index.css もここで読む
├─ index/+Page.tsx         # "/" → 前回のページへ送る
├─ lesson/
│  ├─ +route.ts            # /lessons/<レッスンID>[/<演習ID>]
│  ├─ +title.ts
│  └─ +Page.tsx            # レッスン一覧 + 解説本文 or 演習の画面
└─ _error/+Page.tsx
public/
├─ p5-runner.html          # ユーザーコードを実行する iframe の中身
└─ images/                 # レッスンで使う画像
src/react-app/
├─ index.css               # Tailwind の入口、base、手描き用ユーティリティ、レッスン本文のスタイル
├─ components/
│  ├─ Header.tsx           # ロゴ
│  ├─ LessonList.tsx       # レッスン一覧 (ID 先頭 2 桁でグループ化)
│  ├─ LessonContent.tsx    # MDX レッスン本文の表示
│  ├─ ExerciseButton.tsx   # 解説から演習へ進むリンク
│  ├─ FirstCircleSteps.tsx # 「最初の円」のプログラムを 1 行ずつ進めて見せる (レッスン 01-02 用)
│  ├─ ExerciseView.tsx     # 演習の画面。ツールバー、エディタか穴埋め、プレビュー (ブラウザ専用)
│  ├─ Answer.tsx           # レッスン本文で、答えを隠しておく枠
│  ├─ BlankEditor.tsx      # 穴埋め演習のコード表示と入力欄
│  ├─ Celebration.tsx      # 穴埋めに正解したときの「正解！」と紙ふぶき
│  └─ Preview.tsx          # プレビュー枠、エラー表示、console 出力
├─ constants/
│  └─ exercises.ts         # EXERCISE_IDS (全レッスンで一意)
├─ lessons/
│  ├─ types.ts             # レッスンの型定義
│  ├─ labels.ts            # カテゴリの表示名
│  ├─ *.mdx                # レッスン本体
│  └─ index.ts             # 全レッスンの登録 (表示順)
└─ lib/
   ├─ blanks.ts            # 穴埋め演習の blankCode のパース・穴うめ・正解判定
   ├─ code-theme.ts        # コードの配色 (サーバーでも読む)
   ├─ editor-theme.ts      # CodeMirror のテーマ (ブラウザ専用)
   ├─ syntax-highlighter.ts # 解説ページ用の Prism (JavaScript だけ登録)
   ├─ iframe-store.ts      # iframe の生成・heartbeat 監視・フリーズ復旧 (ブラウザ専用)
   ├─ route.ts             # URL とページ (レッスン・演習) の対応
   └─ storage.ts           # LocalStorage 操作
theme/
├─ tokens.json             # デザイントークンの正 (色・書体・文字サイズ・角丸・影)
├─ guide.md                # 見た目のルール
├─ scripts/gen.ts          # tokens.json → dist/theme.css (Tailwind の @theme)
└─ dist/                   # 生成物。git には入れない
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
- `iframe-store.ts` は `#preview-container` の中身を丸ごと消して iframe を作り直す。React が描く要素 (エラー表示など) をこの中に入れると、復旧時に React が `removeChild` で落ちて画面が真っ白になる。`#preview-container` は空のまま兄弟要素として重ねる

**Styling:**

- Tailwind CSS v4 を `@tailwindcss/postcss` 経由で使う (`postcss.config.mjs`)。inline の `style` は書かず、クラスで組む
- `index.css` の先頭は `@import "tailwindcss/index.css"`。`@import "tailwindcss"` と書くと、Worker 側のビルドがパッケージ名を解決できずに落ちる
- 色・書体・文字サイズ・角丸・影は `theme/tokens.json` が正。`pnpm run theme` が `theme/dist/theme.css` に `@theme` として吐き、`bg-paper` `text-ink` `rounded-wobbly` `shadow-offset` `text-title` のようなクラスになる。値を変えるときは CSS ではなく `tokens.json` を直す
- 見た目のルールは `theme/guide.md`。デザインシステム Artifact (https://claude.ai/artifact/VNpXhhKHWoiQmWXMcPRgKf) は `tokens.json` と `guide.md` の写しで、repo 側が正
- 手描き用のユーティリティ (`bg-dots` `marker` `tape` `pressable`) は `index.css` の `@utility`
- Tailwind の preflight が見出しやリストの既定スタイルを消すので、MDX のレッスン本文は `index.css` の `.lesson-content` で整えている
- Web フォントは読み込まない。会場の回線に依存しないよう、端末の書体を指定するだけにしている (当日の端末は Chromebook)
- `public/p5-runner.html` は別ドキュメントなので Tailwind もテーマも効かない。キャンバスの枠と影の色は直書きで、`tokens.json` の `ink` を変えたらここも合わせる

**Code Editor:**

- CodeMirror 6 (`@uiw/react-codemirror`)、JavaScript シンタックスハイライト
- 配色は `lib/code-theme.ts` の `CODE_COLORS`。エディタ用の `editorTheme` (`lib/editor-theme.ts`) と解説ページ用の `codeBlockStyle` が同じ `code-*` トークンを使う

**Progress Management (`lib/storage.ts`):**

- `workshopper-progress`: 演習 ID ごとの `{ code, lastModified }`
- `workshopper-current-state`: 開いているレッスン・ステップ・演習
- `workshopper-blanks`: 穴埋め演習 ID ごとの `{ values, solved, lastModified }`。一度 `solved` になったら、入力を消しても `true` のまま

**URL (`lib/route.ts`, `pages/lesson/+route.ts`):**

- 解説ページは `/lessons/<レッスンID>`、演習は `/lessons/<レッスンID>/<演習ID>`。実在しない ID は 404
- ページ間の移動は普通の `<a href>`。Vike のクライアントルーターが拾って、再読み込みなしで切り替える。ボタンに `onClick` で遷移を書かない
- `/` は前回開いていたページ (`workshopper-current-state`)、無ければ最初のレッスンへ、履歴を増やさずに送る。前回のページは localStorage にあるので、決めるのはブラウザ側
- 演習が変わるたびに `ExerciseView` を `key` で作り直す。コードや箱の値は、そのとき localStorage から読み直す
- レッスン ID と演習 ID が URL になるので、変えると配った URL やブックマークが切れる

**Lesson Content:**

- MDX (`@mdx-js/rollup` + `remark-gfm`)。`react-markdown` は使っていない
- 各 `.mdx` が `frontmatter` (`LessonMeta`) を export し、`lessons/index.ts` に登録する
- レッスン ID は `<章 2 桁>-<章内の番号 2 桁>-<名前>` で、章の番号は 01 からの連番。ファイル名も同じ番号で始める。レッスン一覧の丸の数字と章タイトル (`LessonList.tsx` の `CHAPTER_TITLES`) は先頭 2 桁で決まる
- `docs/2025-lesson-structure.md` の「レッスン N」は構成案の番号で、実装の章番号とは一致しない (構成案の 2・7・8・9 にあたる MDX が無く、実装は詰めて振っている)
- 演習 ID は `constants/exercises.ts` に追加する。LocalStorage のキーになるので変えると保存済みコードが読めなくなる
- MDX の型は `vite-env.d.ts` で宣言している
- 本文から使える部品は `LessonContent.tsx` の `mdxComponents` に登録したものだけ。`<Exercise id={...} />` (演習へのボタン)、`<FirstCircleSteps />` (実行順のステップ表示)、`<Answer>…</Answer>` (最初は閉じていて、押すと開く答えの枠) がある
- `FirstCircleSteps` は本物の p5 を動かさず、行ごとのキャンバスの状態を SVG で描いている。対象のコードは部品の中に直書きなので、別のプログラムで同じことをするなら部品を足す

**穴埋め演習:**

- frontmatter の演習に `initialCode` の代わりに `blankCode` を書くと穴埋めになる。`{{答え}}` と書いた場所が入力欄になり、それ以外のコードは書き換えられない
  ```js
  blankCode: `fill({{255}}, {{255}}, {{0}});`;
  ```
- 「実行」で箱の値をうめたコードが走る。空の箱が残っていると走らせずに促す
- 全部の箱が答えと一致したら正解の演出が出る。数値どうしは値で比べ (`255` と `255.0` は同じ)、それ以外は空白を無視した文字列で比べる。不正解のときは何も言わない
- 正解の無い「自由な箱」も置ける。`{{?200}}` と書くと、最初に 200 が入った箱になる (`{{?}}` なら空)。判定はせず、入れた値でコードが走るだけ。「値を変えてみよう」のような課題に使う
  ```js
  blankCode: `ellipse({{?200}}, {{?200}}, {{?200}}, {{?200}});`;
  ```
- 自由な箱しか無い演習には正解の演出が出ない。答えのある箱と混ぜたときは、答えのある箱だけで判定する
- 行を足したり消したりする課題は穴埋めにできない。`initialCode` のままにする
- コード中に `{{` をそのまま書きたい場面には対応していない

### docs/spec.md との差

`docs/spec.md` は着手時の仕様で、次の点は実装が正:

- デプロイ先は Cloudflare Pages ではなく Workers
- p5.js はインスタンスモード + `new Function()` ではなく、iframe + グローバルモード
- レッスンは `.ts` + `react-markdown` ではなく MDX
- ディレクトリは `src/` 直下ではなく `src/react-app/`
- 素の Vite の SPA ではなく、Vike でページを分けて Worker がサーバーサイドレンダリングする

## Important Notes

- **TypeScript 設定**: 4 つの tsconfig があるが、通常触るのは `tsconfig.app.json` と `tsconfig.worker.json`
- **Lint 設定**: `vite.config.ts` の `lint` ブロックに書く。`.oxlintrc.json` や `eslint.config.js` は置かない。ルールは Vite+ 標準のままで、`as any` 禁止は lint では検出されない
- **型チェック**: `lint.options.typeCheck` が有効で、`vp check` / `vp lint` が 3 つの tsconfig (app / node / worker) をまとめて検査する
- **フォーマッタ**: Oxfmt。`**/*.mdx` と `docs/**` は `fmt.ignorePatterns` で対象外にしている。Oxfmt は MDX frontmatter の `initialCode` (テンプレートリテラル) のインデントを消し、docs のコードブロック内のサンプルコードも書き換えるので、外さないこと
- **`vp` と script の名前衝突**: `vp check` / `vp lint` は Vite+ の組み込みコマンドで、`package.json` の script とは別物。script を回すときは `pnpm run check` / `pnpm run lint`
- **開発サーバーの最初の数リクエスト**: 起動直後は Vite が依存を最適化し直すあいだ、ページが 500 を返すことがある。ログに `optimized dependencies changed. reloading` が出きってから開き直せば直る
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
     while (true) {}
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
