// 穴埋め演習の blankCode ("fill({{255}}, {{255}}, {{0}});") を扱う

export type Segment =
  | { kind: "text"; text: string }
  | { kind: "blank"; index: number; answer: string };

const OPEN = "{{";
const CLOSE = "}}";

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
    return [...segments, { kind: "blank", index, answer: segment.answer }];
  }, []);
};

const blanksOf = (segments: Segment[]) => segments.filter((s) => s.kind === "blank");

export const emptyValues = (segments: Segment[]): string[] => blanksOf(segments).map(() => "");

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

export const isCorrect = (segments: Segment[], values: string[]): boolean =>
  blanksOf(segments).every((blank) => matches(valueAt(values, blank.index), blank.answer));
