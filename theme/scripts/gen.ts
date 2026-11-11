import { mkdir, readFile, writeFile } from "node:fs/promises";

type ThemedValue = string | Record<string, string>;

interface NamedToken {
  name: string;
  value: string;
}

interface TextStyle {
  name: string;
  fontSize: string;
  lineHeight?: number | string;
  letterSpacing?: string;
  fontWeight?: number | string;
}

interface Tokens {
  color: { themes: { id: string }[]; tokens: { name: string; value: ThemedValue }[] };
  type: {
    families: Record<string, string>;
    groups: { styles: TextStyle[] }[];
  };
  radius: { tokens: NamedToken[] };
  shadow: { tokens: NamedToken[] };
}

const ROOT_FONT_SIZE_PX = 16;

const tokens: Tokens = JSON.parse(
  await readFile(new URL("../tokens.json", import.meta.url), "utf8"),
);
const firstTheme = tokens.color.themes[0].id;

const rem = (v: number | string): number | string =>
  typeof v === "string" && v.endsWith("px") ? `${parseFloat(v) / ROOT_FONT_SIZE_PX}rem` : v;

const colorValue = (v: ThemedValue): string => (typeof v === "string" ? v : v[firstTheme]);

// "radius-wobbly" → "wobbly"。Tailwind 側の名前空間 (--radius-*, --shadow-*) と重ねない
const bare = (name: string, family: string): string =>
  name.startsWith(`${family}-`) ? name.slice(family.length + 1) : name;

const section = (title: string, body: string[]): string[] => ["", `  /* ${title} */`, ...body];

const textStyleLines = (s: TextStyle): string[] => [
  `  --text-${s.name}: ${rem(s.fontSize)};`,
  ...(s.lineHeight != null ? [`  --text-${s.name}--line-height: ${rem(s.lineHeight)};`] : []),
  ...(s.letterSpacing != null ? [`  --text-${s.name}--letter-spacing: ${s.letterSpacing};`] : []),
  ...(s.fontWeight != null ? [`  --text-${s.name}--font-weight: ${s.fontWeight};`] : []),
];

const namedLines = (family: string, list: NamedToken[]): string[] =>
  list.map((t) => `  --${family}-${bare(t.name, family)}: ${t.value};`);

const lines: string[] = [
  ...section(
    "color",
    tokens.color.tokens.map((t) => `  --color-${t.name}: ${colorValue(t.value)};`),
  ),
  ...section(
    "font",
    Object.entries(tokens.type.families).map(([name, value]) => `  --font-${name}: ${value};`),
  ),
  ...section(
    "text",
    tokens.type.groups.flatMap((group) => group.styles.flatMap(textStyleLines)),
  ),
  ...section("radius", namedLines("radius", tokens.radius.tokens)),
  ...section("shadow", namedLines("shadow", tokens.shadow.tokens)),
];

const css = `/* theme/tokens.json から生成。直接編集しない。
   spacing / border は Tailwind 既定の語彙をそのまま使うので出力しない。対応は guide.md。 */
@theme static {${lines.join("\n")}
}
`;

await mkdir(new URL("../dist/", import.meta.url), { recursive: true });
await writeFile(new URL("../dist/theme.css", import.meta.url), css);
console.log("generated theme/dist/theme.css");
