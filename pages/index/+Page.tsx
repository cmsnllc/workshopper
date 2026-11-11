import { useEffect } from "react";
import { navigate } from "vike/client/router";
import { lastPath } from "../../src/react-app/lib/route";

// "/" は中身を持たない。前回開いていたページ (無ければ最初のレッスン) へ送る。
// 前回のページは localStorage にあるので、サーバーではなくブラウザで決める
export default function Page() {
  useEffect(() => {
    void navigate(lastPath(), { overwriteLastHistoryEntry: true });
  }, []);

  return <main className="bg-dots min-w-0 flex-1" />;
}
