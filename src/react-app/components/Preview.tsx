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

export function Preview({ code, isRunning = true, onStop }: PreviewProps) {
  const iframeState = useSyncExternalStore(
    iframeStore.subscribe,
    iframeStore.getSnapshot
  );

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
    }, 500);
    return () => clearInterval(interval);
  }, [showDebug]);

  // コード変更時にコンソールログをクリア
  useEffect(() => {
    setConsoleLogs([]);
  }, [code]);

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

  const getLogColor = (level: ConsoleMessage["level"]) => {
    switch (level) {
      case "error":
        return "#dc2626";
      case "warn":
        return "#d97706";
      case "log":
      default:
        return "#4b5563";
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        backgroundColor: "#f5f5f5",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {showDebug && (
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            zIndex: 1000,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            color: "white",
            padding: "8px 12px",
            borderRadius: "4px",
            fontSize: "11px",
            fontFamily: "monospace",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            maxWidth: "300px",
          }}
        >
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <span>isRunning: {isRunning ? "✓" : "✗"}</span>
            <button
              onClick={resetIframe}
              style={{
                padding: "2px 6px",
                fontSize: "10px",
                cursor: "pointer",
                backgroundColor: "#444",
                color: "white",
                border: "1px solid #666",
                borderRadius: "3px",
              }}
            >
              Reset iframe
            </button>
          </div>
          <div style={{ fontSize: "10px", color: "#aaa" }}>
            Store: {JSON.stringify(iframeState)}
          </div>
          <div style={{ fontSize: "10px", color: "#aaa" }}>
            Debug: {JSON.stringify(debugInfo)}
          </div>
        </div>
      )}
      <div
        id="preview-container"
        style={{ width: "100%", flex: 1, position: "relative" }}
      >
        {error && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "20px",
            }}
          >
            <div
              style={{
                color: "red",
                padding: "20px",
                backgroundColor: "#fee",
                border: "2px solid red",
                borderRadius: "8px",
                maxWidth: "80%",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          </div>
        )}
      </div>

      {/* コンソール出力エリア */}
      {consoleLogs.length > 0 && (
        <div
          style={{
            height: "150px",
            borderTop: "1px solid #ccc",
            backgroundColor: "#ffffff",
            color: "#333333",
            fontFamily: "monospace",
            fontSize: "12px",
            overflowY: "auto",
            padding: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
              paddingBottom: "4px",
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            <span style={{ fontWeight: "bold", color: "#007acc" }}>
              Console
            </span>
            <button
              onClick={() => setConsoleLogs([])}
              style={{
                padding: "2px 8px",
                fontSize: "11px",
                backgroundColor: "#f0f0f0",
                color: "#333333",
                border: "1px solid #cccccc",
                borderRadius: "3px",
                cursor: "pointer",
              }}
            >
              Clear
            </button>
          </div>
          {consoleLogs.map((log, index) => (
            <div
              key={index}
              style={{
                padding: "2px 0",
                color: getLogColor(log.level),
                display: "flex",
                gap: "8px",
              }}
            >
              <span style={{ opacity: 0.7 }}>
                [{log.level.toUpperCase()}]
              </span>
              <span>{log.args.join(" ")}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
