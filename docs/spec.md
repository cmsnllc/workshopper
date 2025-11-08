# p5.js プログラミング教材 - 技術仕様書

## プロジェクト概要

小学生後半〜中学生向けのプログラミング教材。p5.js を使ってグラフィック操作を通じてプログラミングの基礎を学ぶ。

### 要件

- ブラウザで動作するワークショップ形式
- デプロイ先: Cloudflare Pages
- ユーザー認証: 不要
- 進捗保存: LocalStorage で完結

---

## テックスタック

```
Vite + React + TypeScript
├─ p5.js（描画エンジン）
├─ CodeMirror（コードエディタ）
└─ React Markdown（カリキュラムコンテンツ）
```

---

## プロジェクト構成

```
p5-workshop/
├─ src/
│  ├─ components/
│  │  ├─ Editor.tsx           # CodeMirrorのラッパー
│  │  ├─ Preview.tsx           # p5.jsキャンバス
│  │  ├─ Lesson.tsx            # レッスン本体
│  │  └─ LessonList.tsx        # レッスン一覧
│  ├─ lessons/
│  │  ├─ types.ts              # レッスンの型定義
│  │  ├─ 01-first-circle.ts    # レッスン定義
│  │  ├─ 02-moving-circle.ts
│  │  └─ index.ts              # 全レッスンのエクスポート
│  ├─ lib/
│  │  ├─ p5-runner.ts          # p5.jsの実行環境
│  │  └─ storage.ts            # LocalStorage操作
│  ├─ App.tsx
│  └─ main.tsx
├─ package.json
├─ vite.config.ts
└─ wrangler.toml               # Cloudflare設定
```

---

## レッスンのデータ構造

```typescript
// lessons/types.ts
export interface Lesson {
  id: string;
  title: string;
  description: string; // Markdown形式
  initialCode: string;
  solution?: string;
  hints?: string[];
  challenge?: string; // 追加課題
}
```

### レッスン定義の例

```typescript
// lessons/01-first-circle.ts
export const lesson01: Lesson = {
  id: "01-first-circle",
  title: "最初の円を描こう",
  description: `
# 円を描いてみよう！

p5.jsで図形を描く第一歩。
\`circle(x, y, size)\`を使って、画面に円を描いてみよう。

- x: 横の位置（左から何ピクセル）
- y: 縦の位置（上から何ピクセル）
- size: 円の大きさ
  `.trim(),
  initialCode: `function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  // ここに円を描くコードを書いてみよう！
  
}`,
  solution: `function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  circle(200, 200, 100);
}`,
  hints: ["circle()関数を使うよ", "画面の中央は (200, 200) だよ"],
};
```

---

## メインのレイアウト

```typescript
// App.tsx
function App() {
  const [currentLessonId, setCurrentLessonId] = useState("01-first-circle");
  const [code, setCode] = useState("");

  return (
    <div className="app">
      <aside className="sidebar">
        <LessonList currentId={currentLessonId} onSelect={setCurrentLessonId} />
      </aside>

      <main className="workspace">
        <div className="lesson-content">
          <Lesson lessonId={currentLessonId} />
        </div>

        <div className="editor-preview">
          <Editor code={code} onChange={setCode} />
          <Preview code={code} />
        </div>
      </main>
    </div>
  );
}
```

### レイアウト構成

- **Sidebar**: レッスン一覧・進捗表示
- **Lesson Content**: レッスンの説明・ヒント
- **Editor**: コードエディタ（CodeMirror）
- **Preview**: p5.js キャンバス（リアルタイムプレビュー）

---

## p5.js 統合

インスタンスモードを使用して安全に実行：

```typescript
// lib/p5-runner.ts
import p5 from "p5";

export function runP5Code(code: string, container: HTMLElement) {
  // 既存のインスタンスがあれば削除
  const existingCanvas = container.querySelector("canvas");
  if (existingCanvas) {
    existingCanvas.remove();
  }

  try {
    // ユーザーコードをラップして実行
    const wrappedCode = `
      return function(p) {
        ${code}
      }
    `;
    const sketchFunction = new Function(wrappedCode)();
    new p5(sketchFunction, container);
  } catch (error) {
    console.error("Code execution error:", error);
    // エラー表示のUI
  }
}
```

### ポイント

- グローバルモードではなくインスタンスモードを使用
- コード変更時に既存の canvas を削除して再生成
- エラーハンドリングでユーザーにフィードバック

---

## LocalStorage 管理

```typescript
// lib/storage.ts
interface Progress {
  lessonId: string;
  code: string;
  completed: boolean;
}

export const storage = {
  saveProgress(lessonId: string, code: string) {
    const key = `lesson-${lessonId}`;
    const data: Progress = {
      lessonId,
      code,
      completed: false,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(data));
  },

  loadProgress(lessonId: string): Progress | null {
    const key = `lesson-${lessonId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },

  markComplete(lessonId: string) {
    const progress = this.loadProgress(lessonId);
    if (progress) {
      progress.completed = true;
      localStorage.setItem(`lesson-${lessonId}`, JSON.stringify(progress));
    }
  },
};
```

### 保存内容

- レッスンごとのコード
- 完了状態

---

## 必要なパッケージ

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "p5": "^1.9.0",
    "@codemirror/lang-javascript": "^6.2.1",
    "@uiw/react-codemirror": "^4.21.21",
    "react-markdown": "^9.0.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.1",
    "@types/react-dom": "^18.3.0",
    "@types/p5": "^1.7.6",
    "vite": "^5.0.0",
    "typescript": "^5.3.3"
  }
}
```
