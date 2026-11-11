import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { iframeStore } from "../lib/iframe-store";

interface PreviewProps {
  code: string;
  isRunning?: boolean;
  onStop?: () => void;
}

interface ConsoleMessage {
  level: "log" | "warn" | "error";
  args: string[];
  timestamp: number;
}

const DEBUG_POLL_INTERVAL_MS = 500;

const LOG_COLOR_CLASS: Record<ConsoleMessage["level"], string> = {
  error: "text-code-keyword",
  warn: "text-code-number",
  log: "text-ink",
};

export function Preview({ code, isRunning = true, onStop }: PreviewProps) {
  const iframeState = useSyncExternalStore(iframeStore.subscribe, iframeStore.getSnapshot);

  const iframeReady = iframeState.ready;
  const error = iframeState.error;

  const [debugInfo, setDebugInfo] = useState(iframeStore.getDebugInfo());
  const showDebug = new URLSearchParams(window.location.search).has("debug");
  const [consoleLogs, setConsoleLogs] = useState<ConsoleMessage[]>([]);

  const resetIframe = useCallback(() => {
    iframeStore.remountIframe();
  }, []);

  useEffect(() => {
    iframeStore.startMonitoring(() => {
      resetIframe();
      if (onStop) {
        onStop();
      }
    });

    return () => {
      iframeStore.stopMonitoring();
    };
  }, [onStop, resetIframe]);

  useEffect(() => {
    if (!showDebug) return;
    const interval = setInterval(() => {
      setDebugInfo(iframeStore.getDebugInfo());
    }, DEBUG_POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [showDebug]);

  // コード変更時にコンソールログをクリア
  const [prevCode, setPrevCode] = useState(code);
  if (code !== prevCode) {
    setPrevCode(code);
    setConsoleLogs([]);
  }

  // console メッセージを受信
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data.type === "console") {
        setConsoleLogs((prev) => [
          ...prev,
          {
            level: e.data.level,
            args: e.data.args,
            timestamp: Date.now(),
          },
        ]);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    if (!iframeReady) return;

    if (isRunning && code) {
      iframeStore.sendMessage({ type: "run", code });
    } else if (!isRunning) {
      iframeStore.sendMessage({ type: "stop" });
    }
  }, [isRunning, iframeReady, code]);

  return (
    <div className="bg-dots relative flex h-full w-full flex-col">
      {showDebug && (
        <div className="absolute top-2.5 left-2.5 z-50 flex max-w-[300px] flex-col gap-1 rounded-wobbly bg-ink/85 px-3 py-2 font-mono text-[11px] text-card">
          <div className="flex items-center gap-2">
            <span>isRunning: {isRunning ? "✓" : "✗"}</span>
            <button
              onClick={resetIframe}
              className="rounded border border-card/50 px-1.5 py-0.5 text-[10px]"
            >
              Reset iframe
            </button>
          </div>
          <div className="text-[10px] opacity-80">Store: {JSON.stringify(iframeState)}</div>
          <div className="text-[10px] opacity-80">Debug: {JSON.stringify(debugInfo)}</div>
        </div>
      )}
      <div className="relative min-h-0 w-full flex-1">
        {/* iframe-store がこの中身を丸ごと消して iframe を作り直すので、React が描く要素は入れない */}
        <div id="preview-container" className="absolute inset-0" />
        {error && (
          <div className="absolute inset-0 flex items-center justify-center p-5">
            <div
              role="alert"
              className="max-w-[80%] rounded-wobbly-lg border-2 border-ink bg-coral-wash p-5 text-center font-bold break-words shadow-offset"
            >
              {error}
            </div>
          </div>
        )}
      </div>

      {/* コンソール出力エリア */}
      {consoleLogs.length > 0 && (
        <div className="h-[150px] flex-none overflow-y-auto border-t-2 border-ink bg-card p-2 font-mono text-xs">
          <div className="mb-2 flex items-center justify-between border-b-2 border-dashed border-ink pb-1">
            <span className="font-sans text-label">Console</span>
            <button
              onClick={() => setConsoleLogs([])}
              className="rounded-wobbly border-2 border-ink px-2 font-sans text-[11px] font-bold"
            >
              Clear
            </button>
          </div>
          {consoleLogs.map((log, index) => (
            <div key={index} className={`flex gap-2 py-0.5 ${LOG_COLOR_CLASS[log.level]}`}>
              <span className="opacity-70">[{log.level.toUpperCase()}]</span>
              <span>{log.args.join(" ")}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
