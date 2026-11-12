// 穴埋め演習の blankCode を扱う。箱は 2 種類ある
// - 答えのある箱: "fill({{255}}, {{255}}, {{0}});"   → 全部合うと正解
// - 自由な箱:     "ellipse({{?200}}, {{?200}});"     → 正解は無い。? のあとが最初に入っている値 ("{{?}}" なら空)

export type Segment =
  | { kind: "text"; text: string }
  | {
      kind: "blank";
      index: number;
      /** 答えのある箱なら答え。自由な箱なら最初に入っている値 */
      answer: string;
      /** 自由な箱。正解・不正解の判定をしない */
      free: boolean;
    };

const OPEN = "{{";
const CLOSE = "}}";
const FREE_MARK = "?";

type RawSegment = { kind: "text"; text: string } | { kind: "blank"; answer: string };

const splitChunk = (chunk: string): RawSegment[] => {
  const end = chunk.indexOf(CLOSE);
  // 閉じる }} が無ければ穴ではない。元の文字のまま戻す
  if (end < 0) return [{ kind: "text", text: OPEN + chunk }];
  return [
    { kind: "blank", answer: chunk.slice(0, end) },
    { kind: "text", text: chunk.slice(end + CLOSE.length) },
  ];
};

export const parseBlankCode = (blankCode: string): Segment[] => {
  const [head, ...chunks] = blankCode.split(OPEN);
  const raw: RawSegment[] = [{ kind: "text", text: head }, ...chunks.flatMap(splitChunk)];

  return raw.reduce<Segment[]>((segments, segment) => {
    if (segment.kind === "text") {
      return segment.text === "" ? segments : [...segments, segment];
    }
    const index = segments.filter((s) => s.kind === "blank").length;
    const free = segment.answer.startsWith(FREE_MARK);
    const answer = free ? segment.answer.slice(FREE_MARK.length) : segment.answer;
    return [...segments, { kind: "blank", index, answer, free }];
  }, []);
};

const blanksOf = (segments: Segment[]) => segments.filter((s) => s.kind === "blank");

/** まだ何も入れていないときの箱の値。答えのある箱は空、自由な箱は最初の値 */
export const emptyValues = (segments: Segment[]): string[] =>
  blanksOf(segments).map((blank) => (blank.free ? blank.answer : ""));

const valueAt = (values: string[], index: number): string => (values[index] ?? "").trim();

export const isFilled = (segments: Segment[], values: string[]): boolean =>
  blanksOf(segments).every((blank) => valueAt(values, blank.index) !== "");

/** 穴に値を入れた、実行できるコードを返す */
export const fillBlanks = (segments: Segment[], values: string[]): string =>
  segments.map((s) => (s.kind === "text" ? s.text : valueAt(values, s.index))).join("");

const isNumeric = (text: string): boolean => text !== "" && Number.isFinite(Number(text));

const withoutSpaces = (text: string): string => text.split(" ").join("");

// 数値どうしは値で比べる ("255" と "255.0" は同じ)。それ以外は空白を無視した文字列で比べる
const matches = (value: string, answer: string): boolean =>
  isNumeric(value) && isNumeric(answer)
    ? Number(value) === Number(answer)
    : withoutSpaces(value) === withoutSpaces(answer.trim());

/** 答えのある箱が全部合っているか。自由な箱しか無い演習に正解は無い */
export const isCorrect = (segments: Segment[], values: string[]): boolean => {
  const answerBlanks = blanksOf(segments).filter((blank) => !blank.free);
  return (
    answerBlanks.length > 0 &&
    answerBlanks.every((blank) => matches(valueAt(values, blank.index), blank.answer))
  );
};
