import { PrismLight } from "react-syntax-highlighter";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";

// レッスンのコードは JavaScript だけなので、全言語入りの Prism ではなく必要な言語だけ登録する
PrismLight.registerLanguage("javascript", javascript);

export { PrismLight as SyntaxHighlighter };
