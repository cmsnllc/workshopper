// Exercise IDs - 全レッスンで一意である必要がある
export const EXERCISE_IDS = {
  // レッスン 01-01: はじめての円
  FIRST_CIRCLE: "01-01-first-circle",

  // レッスン 01-02: プログラムの解説
  BASICS_MAIN: "01-02-basics-main",
  TRY_COMMENT: "01-02-try-comment",
  TRY_ELLIPSE: "01-02-try-ellipse",
  TRY_MULTIPLE_CIRCLES: "01-02-try-multiple-circles",

  // レッスン 01-03: チャレンジ① 黄色の円
  CHALLENGE_YELLOW: "01-03-challenge-yellow",

  // レッスン 02-01: 複数の図形を描く
  MULTIPLE_SHAPES: "02-01-multiple-shapes",

  // レッスン 02-02: チャレンジ② 信号機を作ろう
  CHALLENGE_TRAFFIC: "02-02-challenge-traffic",

  // レッスン 03-01: 変数とは
  VARIABLES: "03-01-variables",

  // レッスン 03-02: チャレンジ③ 円を移動させよう
  CHALLENGE_MOVE: "03-02-challenge-move",

  // レッスン 04-01: 四則演算
  ARITHMETIC: "04-01-arithmetic",

  // レッスン 04-02: チャレンジ④ お小遣い帳
  CHALLENGE_ALLOWANCE: "04-02-challenge-allowance",

  // レッスン 05-01: 比較演算子と真偽値
  COMPARISON: "05-01-comparison",

  // レッスン 05-02: チャレンジ⑤ 偶数判定
  CHALLENGE_EVEN: "05-02-challenge-even",

  // レッスン 06-01: もし○○なら
  IF_STATEMENT: "06-01-if-statement",

  // レッスン 06-02: チャレンジ⑥ 条件で円の大きさを変えよう
  CHALLENGE_CONDITIONAL: "06-02-challenge-conditional",

  // レッスン 07-01: 条件を組み合わせよう
  LOGICAL_OPERATORS: "07-01-logical-operators",

  // レッスン 07-02: チャレンジ⑦ 偶数かつ5の倍数
  CHALLENGE_COMPLEX: "07-02-challenge-complex",

  // レッスン 08-01: while と for (説明のみ)
  LOOPS_INTRO: "08-01-loops-intro",

  // レッスン 08-02: ループで円を並べよう
  LOOPS_PRACTICE: "08-02-loops-practice",

  // レッスン 08-03: チャレンジ⑧ 5つの円を並べよう
  CHALLENGE_LOOPS: "08-03-challenge-loops",

  // レッスン 09-01: ネストしたループ
  NESTED_LOOPS: "09-01-nested-loops",

  // レッスン 09-02: チャレンジ⑨ 5x5 のドット模様
  CHALLENGE_DOTS: "09-02-challenge-dots",

  // レッスン 10-01: setup と draw の違い (説明のみ)
  ANIMATION_INTRO: "10-01-animation-intro",

  // レッスン 10-02: 円を動かしてみよう
  ANIMATION_PRACTICE: "10-02-animation-practice",

  // レッスン 10-03: チャレンジ⑩ 端で折り返そう
  CHALLENGE_BOUNCE: "10-03-challenge-bounce",

  // レッスン 11-01: 乱数とは
  RANDOM: "11-01-random",

  // レッスン 11-02: チャレンジ⑪ ランダムアート
  CHALLENGE_RANDOM: "11-02-challenge-random",

  // レッスン 12-01: マウスイベント
  MOUSE_EVENTS: "12-01-mouse-events",

  // レッスン 12-02: チャレンジ⑫ お絵描きアプリ
  CHALLENGE_PAINT: "12-02-challenge-paint",

  // レッスン 13-01: 関数を作ろう
  FUNCTIONS: "13-01-functions",

  // レッスン 13-02: チャレンジ⑬ 顔を描く関数
  CHALLENGE_FUNCTION: "13-02-challenge-function",

  // レッスン 14-01: 再帰関数とは (説明のみ)
  RECURSION_INTRO: "14-01-recursion-intro",

  // レッスン 14-02: 円のフラクタル
  RECURSION_PRACTICE: "14-02-recursion-practice",

  // レッスン 14-03: チャレンジ⑭ 十字パターン
  CHALLENGE_RECURSION: "14-03-challenge-recursion",

  // レッスン 15-01: 自由制作
  FREE_PROJECT: "15-01-free-project",
} as const;

export type ExerciseId = (typeof EXERCISE_IDS)[keyof typeof EXERCISE_IDS];
