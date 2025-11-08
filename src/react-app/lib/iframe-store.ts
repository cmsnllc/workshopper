type IframeState = {
  ready: boolean;
  lastHeartbeat: number;
  error: string | null;
};

type IframeMessage =
  | { type: "run"; code: string }
  | { type: "stop" }
  | { type: "start" };

declare global {
  interface Window {
    __iframeStoreListenerRegistered?: boolean;
  }
}

let state: IframeState = {
  ready: false,
  lastHeartbeat: Date.now(),
  error: null,
};

const listeners = new Set<() => void>();

let iframeRef: HTMLIFrameElement | null = null;

let heartbeatTimer: NodeJS.Timeout | null = null;
let onFreezeCallback: (() => void) | null = null;
let containerRef: HTMLElement | null = null;
let isCreatingIframe = false;

function createIframe() {
  if (!containerRef || isCreatingIframe) {
    return;
  }

  isCreatingIframe = true;

  while (containerRef.firstChild) {
    containerRef.removeChild(containerRef.firstChild);
  }
  iframeRef = null;

  const iframe = document.createElement("iframe");
  iframe.id = "preview";
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.border = "none";
  iframe.setAttribute("sandbox", "allow-scripts");

  iframe.addEventListener("load", () => {
    const heartbeatTimeout = setTimeout(() => {
      if (!state.ready) {
        isCreatingIframe = false;
        createIframe();
      }
    }, 3000);

    const checkInterval = setInterval(() => {
      if (state.ready) {
        clearTimeout(heartbeatTimeout);
        clearInterval(checkInterval);
      }
    }, 100);
  });

  containerRef.appendChild(iframe);
  iframeRef = iframe;
  iframe.src = `/p5-runner.html?t=${Date.now()}`;
  isCreatingIframe = false;
}

function handleMessage(e: MessageEvent) {
  if (e.data.type === "heartbeat") {
    state = {
      ...state,
      ready: true,
      lastHeartbeat: Date.now(),
    };
    notifyListeners();
  } else if (e.data.type === "error") {
    state = {
      ...state,
      error: `エラー: ${e.data.message}`,
    };
    notifyListeners();
  } else if (e.data.type === "success") {
    state = {
      ...state,
      error: null,
    };
    notifyListeners();
  }
}

if (!window.__iframeStoreListenerRegistered) {
  window.__iframeStoreListenerRegistered = true;
  window.addEventListener("message", handleMessage);

  const observer = new MutationObserver(() => {
    const container = document.getElementById("preview-container");
    if (container && container !== containerRef) {
      containerRef = container;
      createIframe();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function startHeartbeatMonitoring() {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
  }

  heartbeatTimer = setInterval(() => {
    if (state.ready && Date.now() - state.lastHeartbeat > 2000) {
      clearInterval(heartbeatTimer!);
      heartbeatTimer = null;

      state = {
        ready: false,
        lastHeartbeat: Date.now(),
        error: null,
      };
      notifyListeners();

      if (onFreezeCallback) {
        onFreezeCallback();
      }
    }
  }, 500);
}

function stopHeartbeatMonitoring() {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }
}

export const iframeStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  getSnapshot(): IframeState {
    return state;
  },

  sendMessage(message: IframeMessage) {
    iframeRef?.contentWindow?.postMessage(message, "*");
  },

  startMonitoring(onFreeze: () => void) {
    onFreezeCallback = onFreeze;
    startHeartbeatMonitoring();
  },

  stopMonitoring() {
    onFreezeCallback = null;
    stopHeartbeatMonitoring();
  },

  reset() {
    state = {
      ready: false,
      lastHeartbeat: Date.now(),
      error: null,
    };
    notifyListeners();
  },

  remountIframe() {
    isCreatingIframe = false;
    this.reset();
    setTimeout(() => {
      createIframe();
    }, 100);
  },

  getDebugInfo() {
    return {
      hasContainer: containerRef !== null,
      hasIframe: iframeRef !== null,
      isCreating: isCreatingIframe,
      monitoring: heartbeatTimer !== null,
    };
  },
};
