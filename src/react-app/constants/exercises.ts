// Exercise IDs - 全レッスンで一意である必要がある
export const EXERCISE_IDS = {
  // レッスン 01-01: はじめての円
  FIRST_CIRCLE: "01-01-first-circle",

  // レッスン 01-02: プログラムの解説
  BASICS_MAIN: "01-02-basics-main",
  TRY_COMMENT: "01-02-try-comment",
  TRY_ELLIPSE: "01-02-try-ellipse",
  TRY_MULTIPLE_CIRCLES: "01-02-try-multiple-circles",
  CHALLENGE_YELLOW: "01-02-challenge-yellow",

  // レッスン 03-01: 変数とは
  VARIABLES: "03-01-variables",

  // レッスン 04-01: 四則演算
  ARITHMETIC: "04-01-arithmetic",
  CHALLENGE_ALLOWANCE: "04-01-challenge-allowance",

  // レッスン 05-01: 比較演算子と真偽値
  COMPARISON: "05-01-comparison",

  // レッスン 05-02: 論理演算子
  LOGICAL_OPERATORS: "05-02-logical-operators",
  CHALLENGE_EVEN: "05-02-challenge-even",
  CHALLENGE_COMPLEX: "05-02-challenge-complex",

  // レッスン 06-01: もし○○なら
  IF_STATEMENT: "06-01-if-statement",

  // レッスン 06-02: while と for
  LOOPS_INTRO: "06-02-loops-intro",

  // レッスン 06-03: ループで円を並べよう
  LOOPS_PRACTICE: "06-03-loops-practice",
  CHALLENGE_LOOPS: "06-03-challenge-loops",

  // レッスン 10-01: setup と draw の違い
  ANIMATION_INTRO: "10-01-animation-intro",

  // レッスン 10-02: アニメーションの仕組み
  ANIMATION_PRACTICE: "10-02-animation-practice",

  // レッスン 11-01: 乱数とは
  RANDOM: "11-01-random",
  RANDOM_PRACTICE: "11-01-random-practice",

  // レッスン 12-01: マウスイベント
  MOUSE_EVENTS: "12-01-mouse-events",
  CHALLENGE_PAINT: "12-01-challenge-paint",

  // レッスン 13-01: 関数を作ろう
  FUNCTIONS: "13-01-functions",

  // レッスン 14-01: 再帰関数とは
  RECURSION_INTRO: "14-01-recursion-intro",

  // レッスン 14-02: 円のフラクタル
  RECURSION_PRACTICE: "14-02-recursion-practice",

  // レッスン 15-01: 自由制作
  FREE_PROJECT: "15-01-free-project",
} as const;

export type ExerciseId = (typeof EXERCISE_IDS)[keyof typeof EXERCISE_IDS];
