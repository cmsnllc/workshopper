# 2025年度 p5.js プログラミング教材 レッスン構成

## 全体構成（2時間想定）

- **導入（5分）**: 環境説明・最初の実行
- **基礎レッスン（70分）**: レッスン1〜10 × 平均7分
- **応用レッスン（30分）**: レッスン11〜13 × 平均10分
- **発展・自由制作（15分）**: レッスン14〜15

---

## レッスン詳細

### [基礎編] レッスン1〜10

#### レッスン1: 最初の円を描こう

**目的**: p5.js の基本関数を理解し、最初のプログラムを実行する

**学習内容**:
- `createCanvas()` - キャンバスの作成
- `background()` - 背景色の指定（RGB: 0-255）
- `fill()` - 塗りつぶし色の指定
- `ellipse()` - 円の描画（x, y, width, height）
- コメント `//` の使い方

**説明ポイント**:
```javascript
function setup() {
  createCanvas(400, 400); // 400x400 のキャンバスを作成
}

function draw() {
  background(255, 255, 255); // 白い背景
  fill(255, 0, 0); // 赤色で塗りつぶし
  ellipse(200, 200, 200, 200); // 中央に円を描画
}
```
- 座標系: 左上が(0,0)、右下が(400,400)
- RGB: 赤・緑・青の値で色を表現（加法混合）
  - `255, 255, 255` → 白
  - `0, 0, 0` → 黒
  - `255, 0, 0` → 赤

**initialCode**:
```javascript
function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(255, 255, 255);
  fill(255, 0, 0);
  // ここに円を描くコードを書いてみよう！

}
```

**チャレンジ**: 黄色の円を画面中央に描いてみよう
→ ヒント: 赤と緑を混ぜると黄色になるよ

**solution**:
```javascript
function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(255, 255, 255);
  fill(255, 255, 0); // 黄色
  ellipse(200, 200, 200, 200);
}
```

---

#### レッスン2: 色と形で遊ぼう

**目的**: 複数の図形を描き、色の組み合わせを理解する

**学習内容**:
- 複数の `fill()` と `ellipse()` を組み合わせる
- 色の変更タイミング
- 重なりの順序（上から順に描画される）

**説明ポイント**:
- `fill()` を呼ぶと、それ以降の図形がその色で描画される
- 複数の図形を描くには、`fill()` と `ellipse()` を繰り返す
- 後に描いた図形が前に描いた図形の上に重なる

**initialCode**:
```javascript
function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(255, 255, 255);

  // 1つ目の円（赤）
  fill(255, 0, 0);
  ellipse(150, 200, 100, 100);

  // 2つ目の円を描いてみよう！（好きな色で）


  // 3つ目の円を描いてみよう！（好きな色で）

}
```

**チャレンジ**: 3つの異なる色の円を描いて、信号機のような絵を作ろう

**solution**:
```javascript
function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(255, 255, 255);

  fill(255, 0, 0); // 赤
  ellipse(200, 100, 80, 80);

  fill(255, 255, 0); // 黄色
  ellipse(200, 200, 80, 80);

  fill(0, 255, 0); // 緑
  ellipse(200, 300, 80, 80);
}
```

---

#### レッスン3: 変数を使ってみよう

**目的**: 変数の概念を理解し、値を格納・参照する

**学習内容**:
- `let` で変数を宣言
- `=` で値を代入
- 変数を参照して使う
- `print()` でコンソールに出力

**説明ポイント**:
```javascript
let x = 200; // 変数 x に 200 を格納
let y = 200; // 変数 y に 200 を格納
ellipse(x, y, 100, 100); // x と y を使って円を描く
```
- 変数は値を入れる「箱」のようなもの
- 一度宣言すれば、何度でも参照できる
- `print(x)` とすると、左下のコンソールに値が表示される

**initialCode**:
```javascript
function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(255, 255, 255);

  // 円の中心座標を変数に入れてみよう
  let x = 200;
  let y = 200;

  fill(255, 0, 0);
  // x と y を使って円を描こう

}
```

**チャレンジ**: 変数 x と y の値を変えて、円を右下に移動させよう

**solution**:
```javascript
function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(255, 255, 255);

  let x = 300;
  let y = 300;

  fill(255, 0, 0);
  ellipse(x, y, 100, 100);
}
```

---

#### レッスン4: 計算してみよう

**目的**: 四則演算を使って値を計算する

**学習内容**:
- 四則演算: `+`, `-`, `*`, `/`
- 剰余: `%`
- 括弧による優先順位の変更
- 計算結果を変数に代入

**説明ポイント**:
```javascript
let x = 2 + 3 * 4; // → 14（掛け算が先）
let y = (2 + 3) * 4; // → 20（括弧が最優先）
let z = 10 % 3; // → 1（10を3で割った余り）
```

**initialCode**:
```javascript
function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(255, 255, 255);

  // 太郎と花子のお小遣い帳
  let taro = 1000;
  let hanako = 1000;

  // 花子は太郎に500円借りる


  // 花子は小遣いを1.2倍にする


  // 花子は太郎に倍の1000円返す


  // 結果を表示
  print("太郎:", taro);
  print("花子:", hanako);
}
```

**チャレンジ**: 太郎と花子のお小遣い帳を完成させよう

**solution**:
```javascript
function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(255, 255, 255);

  let taro = 1000;
  let hanako = 1000;

  hanako = hanako - 500;
  taro = taro + 500;

  hanako = hanako * 1.2;

  hanako = hanako - 1000;
  taro = taro + 1000;

  print("太郎:", taro);
  print("花子:", hanako);
}
```

---

#### レッスン5: 比較してみよう

**目的**: 比較演算子と真偽値を理解する

**学習内容**:
- 比較演算子: `>`, `<`, `>=`, `<=`, `==`, `!=`
- `true` と `false`（真偽値）
- 剰余 `%` を使った偶数判定

**説明ポイント**:
```javascript
let x = 2;
x > 0;  // → true（x は 0 より大きい）
x < 0;  // → false（x は 0 より小さくない）
x == 2; // → true（x は 2 と等しい）
x != 2; // → false（x は 2 と等しくないわけではない）
```
- コンピュータは `true`（真）と `false`（偽）で判断する
- 偶数かどうかは `x % 2 == 0` で判定できる

**initialCode**:
```javascript
function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(255, 255, 255);

  let x = 10;

  // x が偶数かどうか判定してみよう
  // ヒント: x を 2 で割った余りが 0 なら偶数

  print(x, "は偶数？", /* ここに判定式を書こう */);
}
```

**チャレンジ**: 変数 x が偶数かどうか判定しよう

**solution**:
```javascript
function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(255, 255, 255);

  let x = 10;

  print(x, "は偶数？", x % 2 == 0);
}
```

---

#### レッスン6: もし○○なら

**目的**: 条件分岐の基本を理解する

**学習内容**:
- `if` 文の基本
- `else` で条件を満たさない場合の処理
- 波括弧 `{}` で囲まれた部分が実行される

**説明ポイント**:
```javascript
if (条件) {
  // 条件が true のとき実行される
} else {
  // 条件が false のとき実行される
}
```

**initialCode**:
```javascript
function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(255, 255, 255);

  let x = 2;

  if (x == 2) {
    // x が 2 のとき、小さい円を描こう
    fill(255, 0, 0);

  } else {
    // それ以外のとき、大きい円を描こう
    fill(0, 0, 255);

  }
}
```

**チャレンジ**: x が 2 なら小さい円、それ以外なら大きい円を描こう

**solution**:
```javascript
function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(255, 255, 255);

  let x = 2;

  if (x == 2) {
    fill(255, 0, 0);
    ellipse(200, 200, 100, 100);
  } else {
    fill(0, 0, 255);
    ellipse(200, 200, 200, 200);
  }
}
```

---

#### レッスン7: 条件を組み合わせよう

**目的**: 論理演算子を使って複雑な条件を表現する

**学習内容**:
- `&&`（かつ / AND）
- `||`（または / OR）
- 複数の条件を組み合わせる

**説明ポイント**:
```javascript
// x が 0 より大きく、かつ 10 より小さい
x > 0 && x < 10

// x が偶数か、または 5 の倍数
x % 2 == 0 || x % 5 == 0
```
- `&&` は両方とも `true` のときだけ `true`
- `||` はどちらか一方でも `true` なら `true`

**initialCode**:
```javascript
function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(255, 255, 255);

  let x = 10;

  // x が偶数かつ5の倍数かどうか判定しよう

  print(x, "は偶数かつ5の倍数？", /* ここに判定式を書こう */);
}
```

**チャレンジ**: 変数 x が偶数かつ5の倍数かどうか判定しよう

**solution**:
```javascript
function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(255, 255, 255);

  let x = 10;

  print(x, "は偶数かつ5の倍数？", x % 2 == 0 && x % 5 == 0);
}
```

---

#### レッスン8: 繰り返してみよう

**目的**: ループの基本を理解し、同じ処理を繰り返す

**学習内容**:
- `while` 文の基本
- `for` 文の基本
- カウンター変数の使い方
- 繰り返し処理の活用

**説明ポイント**:
```javascript
// while の例
let i = 0;
while (i < 5) {
  ellipse(i * 100, 200, 50, 50);
  i = i + 1;
}

// for の例（同じ結果）
for (let i = 0; i < 5; i = i + 1) {
  ellipse(i * 100, 200, 50, 50);
}
```
- `while` は条件が `true` の間繰り返す
- `for` は初期化、条件、更新をまとめて書ける
- **注意**: 条件を間違えると無限ループになる！

**initialCode**:
```javascript
function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(255, 255, 255);
  fill(255, 0, 0);

  // for を使って5つの円を横に並べよう

}
```

**チャレンジ**: for を使って5つの円を横一列に並べよう

**solution**:
```javascript
function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(255, 255, 255);
  fill(255, 0, 0);

  for (let i = 0; i < 5; i = i + 1) {
    ellipse(50 + i * 80, 200, 50, 50);
  }
}
```

---

#### レッスン9: ドット模様を描こう

**目的**: ネストしたループで2次元のパターンを描く

**学習内容**:
- ループの中にループを入れる（ネスト）
- 2次元の座標を生成する
- パターン描画の基本

**説明ポイント**:
```javascript
for (let i = 0; i < 5; i = i + 1) {
  for (let j = 0; j < 5; j = j + 1) {
    ellipse(i * 50, j * 50, 20, 20);
  }
}
```
- 外側のループが1回進むごとに、内側のループが全部実行される
- `i` が横、`j` が縦の位置を表す

**initialCode**:
```javascript
function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(255, 255, 255);
  fill(255, 0, 0);

  // ネストしたループでドット模様を描こう
  // ヒント: 外側のループで横(x)、内側のループで縦(y)

}
```

**チャレンジ**: 5x5 のドット模様を描こう

**solution**:
```javascript
function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(255, 255, 255);
  fill(255, 0, 0);

  for (let i = 0; i < 5; i = i + 1) {
    for (let j = 0; j < 5; j = j + 1) {
      ellipse(50 + i * 70, 50 + j * 70, 30, 30);
    }
  }
}
```

---

#### レッスン10: 図形を動かそう

**目的**: `setup` と `draw` の違いを理解し、アニメーションを作る

**学習内容**:
- `setup` は1回だけ実行される
- `draw` は繰り返し実行される（約60回/秒）
- 変数を使って位置を更新する
- 画面端での折り返し

**説明ポイント**:
```javascript
let x = 0;

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(255, 255, 255);
  fill(255, 0, 0);
  ellipse(x, 200, 50, 50);

  x = x + 1; // 毎回 x が 1 ずつ増える

  if (x > 400) {
    x = 0; // 端まで行ったら戻る
  }
}
```
- 変数は `draw` の外で宣言する（毎回リセットされないように）
- `draw` が呼ばれるたびに位置を更新する

**initialCode**:
```javascript
let x = 0;
let y = 0;

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(255, 255, 255);
  fill(255, 0, 0);

  // x と y を使って円を描こう


  // x と y を毎回 1 ずつ増やそう


  // 端まで行ったら 0 に戻そう

}
```

**チャレンジ**: 円が左上から右下に動き、端まで行ったら戻るようにしよう

**solution**:
```javascript
let x = 0;
let y = 0;

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(255, 255, 255);
  fill(255, 0, 0);

  ellipse(x, y, 50, 50);

  x = x + 1;
  y = y + 1;

  if (x > 400) {
    x = 0;
    y = 0;
  }
}
```

---

### [応用編] レッスン11〜13

#### レッスン11: ランダムに動かそう

**目的**: 乱数を使ってランダムな動きを作る

**学習内容**:
- `random()` 関数
- `frameRate()` で更新速度を変更
- ランダムな位置・色の生成

**説明ポイント**:
```javascript
random(400); // 0 から 400 までのランダムな値
random(255); // 0 から 255 までのランダムな値
```
- `random()` は毎回異なる値を返す
- `frameRate(10)` で更新速度を遅くできる（デフォルトは60）

**initialCode**:
```javascript
function setup() {
  createCanvas(400, 400);
  frameRate(10); // 1秒間に10回更新
}

function draw() {
  background(255, 255, 255);

  // ランダムな位置に円を描こう


  // 色もランダムにしてみよう

}
```

**チャレンジ**: ランダムな位置とランダムな色で円を描こう

**solution**:
```javascript
function setup() {
  createCanvas(400, 400);
  frameRate(10);
}

function draw() {
  background(255, 255, 255);

  fill(random(255), random(255), random(255));
  ellipse(random(400), random(400), 50, 50);
}
```

---

#### レッスン12: クリックした場所に描こう

**目的**: マウスイベントを使ってインタラクティブなプログラムを作る

**学習内容**:
- `mouseClicked()` 関数
- `mouseX`, `mouseY` 変数
- `background()` を消すとお絵描きアプリのようになる

**説明ポイント**:
```javascript
function mouseClicked() {
  // マウスがクリックされたときに実行される
  ellipse(mouseX, mouseY, 50, 50);
}
```
- `mouseX`, `mouseY` は現在のマウス位置を表す特殊な変数
- `background()` を消すと、前の描画が残る

**initialCode**:
```javascript
function setup() {
  createCanvas(400, 400);
  background(255, 255, 255);
}

function mouseClicked() {
  fill(255, 0, 0);
  // クリックした位置に円を描こう

}
```

**チャレンジ**: クリックした場所に円を描くお絵描きアプリを作ろう

**solution**:
```javascript
function setup() {
  createCanvas(400, 400);
  background(255, 255, 255);
}

function mouseClicked() {
  fill(255, 0, 0);
  ellipse(mouseX, mouseY, 50, 50);
}
```

**発展**: `background()` を `mouseClicked()` の中に入れると、どうなるか試してみよう

---

#### レッスン13: 関数を作ろう

**目的**: 自分で関数を定義し、コードを再利用する

**学習内容**:
- 関数の定義方法
- 引数（パラメータ）の使い方
- 返り値（`return`）
- 関数を使ったコードの整理

**説明ポイント**:
```javascript
function drawStar(x, y, size) {
  // 星を描く処理
  // x, y, size を使って描画
}

// 使い方
drawStar(100, 100, 50);
drawStar(300, 200, 30);
```
- 関数を作ると、同じ処理を何度も書かなくて済む
- 引数を変えることで、違う位置や大きさで描ける

**initialCode**:
```javascript
function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(255, 255, 255);

  // drawFace 関数を使って顔を描こう
  drawFace(100, 100, 80);
  drawFace(250, 250, 120);
}

// 顔を描く関数を作ろう
function drawFace(x, y, size) {
  // 顔（円）
  fill(255, 200, 100);
  ellipse(x, y, size, size);

  // 目を描いてみよう（左右2つ）


  // 口を描いてみよう

}
```

**チャレンジ**: 顔を描く関数を完成させ、2つの異なる大きさの顔を描こう

**solution**:
```javascript
function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(255, 255, 255);

  drawFace(100, 100, 80);
  drawFace(250, 250, 120);
}

function drawFace(x, y, size) {
  fill(255, 200, 100);
  ellipse(x, y, size, size);

  fill(0);
  ellipse(x - size * 0.2, y - size * 0.1, size * 0.15, size * 0.15);
  ellipse(x + size * 0.2, y - size * 0.1, size * 0.15, size * 0.15);

  ellipse(x, y + size * 0.2, size * 0.3, size * 0.1);
}
```

---

### [発展編] レッスン14〜15

#### レッスン14: フラクタル図形に挑戦

**目的**: 再帰関数を使って複雑な図形を描く

**学習内容**:
- 再帰関数とは
- 関数が自分自身を呼び出す
- フラクタル図形の仕組み
- ベースケース（終了条件）の重要性

**説明ポイント**:
```javascript
function circles(x, y, r, n) {
  ellipse(x, y, r * 2, r * 2);

  if (n < 1) {
    return; // 終了条件
  }

  let dr = r / 2;
  circles(x + dr, y, dr, n - 1); // 右側に小さい円
  circles(x - dr, y, dr, n - 1); // 左側に小さい円
}
```
- 再帰関数は自分自身を呼び出す不思議な関数
- 必ず終了条件（`if (n < 1) return;`）が必要
- フラクタル図形は拡大しても似た形が出てくる

**initialCode**:
```javascript
function setup() {
  createCanvas(400, 400);
  background(255, 255, 255);
  circles(200, 200, 100, 3);
}

function circles(x, y, r, n) {
  ellipse(x, y, r * 2, r * 2);

  if (n < 1) {
    return;
  }

  let dr = r / 2;

  // 右側に小さい円を描く
  circles(x + dr, y, dr, n - 1);

  // 左側に小さい円を描く
  circles(x - dr, y, dr, n - 1);

  // 上下にも円を描いてみよう！

}
```

**チャレンジ**: 上下にも円を描いて、十字のパターンを作ろう

**solution**:
```javascript
function setup() {
  createCanvas(400, 400);
  background(255, 255, 255);
  circles(200, 200, 80, 3);
}

function circles(x, y, r, n) {
  ellipse(x, y, r * 2, r * 2);

  if (n < 1) {
    return;
  }

  let dr = r / 2;
  circles(x + dr, y, dr, n - 1);
  circles(x - dr, y, dr, n - 1);
  circles(x, y + dr, dr, n - 1);
  circles(x, y - dr, dr, n - 1);
}
```

---

#### レッスン15: 自由制作

**目的**: これまでの知識を使って自分だけの作品を作る

**学習内容**:
- これまでのレッスンの復習
- 自由な発想で創作
- 参考例からアイデアを得る

**説明ポイント**:

ここまでできたら、あとは自由にプログラムを書いてみよう！

**参考例**:

1. **シェルビンスキのギャスケット** - 三角形のフラクタル
2. **動く波のパターン** - sin/cos を使った波
3. **お絵描きツール** - マウスの軌跡を描く
4. **弾むボール** - 物理シミュレーション
5. **迷路生成** - ランダムな迷路を作る

**必要になりそうな関数**:
- `triangle(x1, y1, x2, y2, x3, y3)` - 三角形を描く
- `rect(x, y, width, height)` - 四角形を描く
- `line(x1, y1, x2, y2)` - 線を描く
- `sin(angle)`, `cos(angle)` - 三角関数
- `stroke()`, `strokeWeight()` - 線の色と太さ

**initialCode**:
```javascript
function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(255, 255, 255);

  // ここに自由にコードを書いてみよう！

}
```

**チャレンジ**: 自分だけのオリジナル作品を作ろう！

---

## 実装時の注意事項

### チェック機能について
各レッスンで「次へ進む」ボタンを有効にする条件：
- レッスン1-3: 基本的な関数が含まれているかチェック（文字列検索）
- レッスン4-7: 特定の演算子や条件式が含まれているか
- レッスン8-10: ループ構文が含まれているか
- レッスン11-15: 実行して動作すればOK（エラーなし）

厳密な正解チェックは不要。自由度を残しつつ、最低限の学習内容が含まれていることを確認する程度。

### ヒント機能
各レッスンに `hints` 配列を用意：
- 段階的にヒントを表示（「ヒントを見る」ボタン）
- 最終的に `solution` も表示可能（「答えを見る」ボタン）

### 文体
- 昨年の教材を踏襲（です・ます調を避け、くだけた口調）
- 絵文字は最小限（👊チャレンジ、🤔試してみよう は使用）
- コメントは日本語で親しみやすく
