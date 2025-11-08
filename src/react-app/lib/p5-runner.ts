import p5 from "p5";

export interface P5Controller {
  instance: p5 | null;
  stop: () => void;
  start: () => void;
  remove: () => void;
}

export function runP5Code(
  code: string,
  container: HTMLElement
): P5Controller {
  // 既存のcanvasとエラーを削除
  const existingCanvas = container.querySelector("canvas");
  if (existingCanvas) {
    existingCanvas.remove();
  }

  const existingError = container.querySelector(".error-message");
  if (existingError) {
    existingError.remove();
  }

  let p5Instance: p5 | null = null;

  try {
    // ユーザーコードをラップして実行
    // p5の全関数をユーザーコードから使えるようにする
    const wrappedCode = `
      return function(p) {
        // p5の全プロパティ・メソッドを取得
        const bindings = {};
        for (const key in p) {
          if (typeof p[key] === 'function') {
            bindings[key] = p[key].bind(p);
          } else {
            Object.defineProperty(bindings, key, {
              get: () => p[key],
              set: (value) => { p[key] = value; }
            });
          }
        }

        // bindingsを引数としてユーザーコードを実行
        const func = new Function(...Object.keys(bindings), \`
          ${code.replace(/\\/g, '\\\\').replace(/`/g, '\\`')}
          return { setup: typeof setup !== 'undefined' ? setup : undefined, draw: typeof draw !== 'undefined' ? draw : undefined };
        \`);

        const result = func(...Object.values(bindings));

        if (result.setup) p.setup = result.setup;
        if (result.draw) p.draw = result.draw;
      }
    `;
    const sketchFunction = new Function(wrappedCode)();
    p5Instance = new p5(sketchFunction, container);
  } catch (error) {
    // エラー表示
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.style.color = "red";
    errorDiv.style.padding = "10px";
    errorDiv.style.backgroundColor = "#fee";
    errorDiv.style.border = "1px solid red";
    errorDiv.style.borderRadius = "4px";
    errorDiv.textContent = `エラー: ${error instanceof Error ? error.message : String(error)}`;
    container.appendChild(errorDiv);
  }

  // コントローラーを返す
  return {
    instance: p5Instance,
    stop: () => {
      if (p5Instance) {
        p5Instance.noLoop();
      }
    },
    start: () => {
      if (p5Instance) {
        p5Instance.loop();
      }
    },
    remove: () => {
      if (p5Instance) {
        p5Instance.remove();
      }
    },
  };
}
