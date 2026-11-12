// Exercise IDs - 全レッスンで一意である必要がある
export const EXERCISE_IDS = {
  // レッスン 01-01: はじめての円
  FIRST_CIRCLE: "01-01-first-circle",

  // レッスン 01-02: プログラムの解説
  BASICS_MAIN: "01-02-basics-main",
  TRY_COMMENT: "01-02-try-comment",

  // レッスン 01-03: それぞれの命令の解説
  CHALLENGE_YELLOW: "01-03-challenge-yellow",

  // レッスン 01-04: ellipse で円を描く
  TRY_ELLIPSE: "01-04-try-ellipse",

  // レッスン 01-05: 複数の円を描く
  TRY_MULTIPLE_CIRCLES: "01-05-try-multiple-circles",

  // レッスン 02-01: 変数とは
  VARIABLES: "02-01-variables",

  // レッスン 03-01: 四則演算
  ARITHMETIC: "03-01-arithmetic",

  // レッスン 03-02: お小遣い帳
  CHALLENGE_ALLOWANCE: "03-02-challenge-allowance",

  // レッスン 04-01: 比較演算子と真偽値
  COMPARISON_PREDICT: "04-01-comparison-predict",

  // レッスン 04-02: 比較の結果を表示する
  COMPARISON: "04-02-comparison",

  // レッスン 04-03: 論理演算子「かつ」
  LOGICAL_AND_PREDICT: "04-03-and-predict",

  // レッスン 04-04: 論理演算子「または」
  LOGICAL_OR_PREDICT: "04-04-or-predict",

  // レッスン 04-05: 論理演算子を組み合わせる
  LOGICAL_OPERATORS: "04-05-logical-operators",

  // レッスン 04-06: 偶数を判定する
  CHALLENGE_EVEN: "04-06-challenge-even",

  // レッスン 04-07: 偶数かつ5の倍数を判定する
  CHALLENGE_COMPLEX: "04-07-challenge-complex",

  // レッスン 05-01: もし○○なら
  IF_STATEMENT: "05-01-if-statement",

  // レッスン 05-02: while と for
  LOOPS_INTRO: "05-02-loops-intro",

  // レッスン 05-03: ループで円を並べよう
  LOOPS_PRACTICE: "05-03-loops-practice",
  CHALLENGE_LOOPS: "05-03-challenge-loops",

  // レッスン 06-01: setup と draw の違い
  ANIMATION_INTRO: "06-01-animation-intro",

  // レッスン 07-01: 乱数とは
  RANDOM: "07-01-random",

  // レッスン 07-02: 色も変える
  RANDOM_PRACTICE: "07-02-random-practice",

  // レッスン 08-01: マウスイベント
  MOUSE_EVENTS: "08-01-mouse-events",
  CHALLENGE_PAINT: "08-01-challenge-paint",

  // レッスン 09-01: 関数を作ろう
  FUNCTIONS: "09-01-functions",

  // レッスン 10-01: 再帰関数とは
  RECURSION_INTRO: "10-01-recursion-intro",

  // レッスン 10-02: 円のフラクタル
  RECURSION_PRACTICE: "10-02-recursion-practice",

  // レッスン 11-01: 自由制作
  FREE_PROJECT: "11-01-free-project",
} as const;

export type ExerciseId = (typeof EXERCISE_IDS)[keyof typeof EXERCISE_IDS];
