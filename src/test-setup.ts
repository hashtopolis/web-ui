// Global setup for the Vitest unit tests. The builder runs it after the polyfills and the
// TestBed initialisation. Stubs for browser APIs that jsdom does not implement go here.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { runInThisContext } from 'node:vm';

// The jsdom run does not load the global `scripts` from angular.json, but the keyspace calculation
// relies on the globals they declare (`parser`, `options`, `defaultOptions`). Run them as classic
// scripts, in the angular.json order, so their top-level bindings become globals. The tests share
// one context per worker, so run them only once: a second run would redeclare their `let` bindings.
const optparseScripts = ['src/assets/optparse/optparse.1.1.1.js', 'src/assets/optparse/optparse.hashtopolis.1.1.1.js'];
if (!('parser' in globalThis)) {
  for (const script of optparseScripts) {
    const filename = resolve(script);
    runInThisContext(readFileSync(filename, 'utf8'), { filename });
  }
}

// Jasmine removed every `spyOn` spy after each spec. Vitest keeps `vi.spyOn` spies until they are
// restored, and the specs share one context per worker, so a spy on a prototype or on a shared
// mock object would leak into the following tests. Restore them once the test is over, after all
// afterEach hooks (including TestBed's teardown) have run, as Jasmine did.
beforeEach(() => {
  onTestFinished(() => {
    vi.restoreAllMocks();
  });
});

// jsdom's typed arrays come from its own realm, but its TextEncoder is Node's, so encoded bytes fail
// `instanceof Uint8Array` / `instanceof ArrayBuffer` checks (for example when HttpTestingController
// flushes an 'arraybuffer' response). Copy the result into this realm's Uint8Array, as in a browser.
const nodeEncode = TextEncoder.prototype.encode;
if (!(nodeEncode.call(new TextEncoder(), '') instanceof Uint8Array)) {
  TextEncoder.prototype.encode = function encode(this: TextEncoder, input?: string) {
    return new Uint8Array(nodeEncode.call(this, input));
  };
}

// jsdom has no canvas: getContext() returns null and the ECharts canvas renderer then throws while it
// draws. The specs assert on chart options, not on pixels, so a 2D context that draws nothing is enough.
function createCanvasContextStub(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const noop = (): void => undefined;
  const gradient = { addColorStop: noop };
  const methods = [
    'arc',
    'arcTo',
    'beginPath',
    'bezierCurveTo',
    'clearRect',
    'clip',
    'closePath',
    'drawImage',
    'ellipse',
    'fill',
    'fillRect',
    'fillText',
    'lineTo',
    'moveTo',
    'putImageData',
    'quadraticCurveTo',
    'rect',
    'resetTransform',
    'restore',
    'rotate',
    'save',
    'scale',
    'setLineDash',
    'setTransform',
    'stroke',
    'strokeRect',
    'strokeText',
    'transform',
    'translate'
  ];
  const imageData = (width: number, height: number) => ({
    width,
    height,
    data: new Uint8ClampedArray(width * height * 4)
  });
  return {
    ...Object.fromEntries(methods.map((name) => [name, noop])),
    canvas,
    createLinearGradient: () => gradient,
    createRadialGradient: () => gradient,
    createPattern: () => ({}),
    createImageData: imageData,
    getImageData: (_x: number, _y: number, width: number, height: number) => imageData(width, height),
    getLineDash: () => [],
    isPointInPath: () => false,
    measureText: (text: string) => ({ width: text.length * 6 })
  } as unknown as CanvasRenderingContext2D;
}
const canvasContexts = new WeakMap<HTMLCanvasElement, CanvasRenderingContext2D>();
HTMLCanvasElement.prototype.getContext = function getContext(this: HTMLCanvasElement, contextId: string) {
  if (contextId !== '2d') {
    return null;
  }
  let context = canvasContexts.get(this);
  if (!context) {
    context = createCanvasContextStub(this);
    canvasContexts.set(this, context);
  }
  return context;
} as typeof HTMLCanvasElement.prototype.getContext;

// jsdom has no DataTransfer, which the specs use to build a FileList for file uploads. Provide the part
// they use: items.add() and a live files list that is a FileList with the added files as its entries.
if (!('DataTransfer' in globalThis)) {
  class DataTransferStub {
    readonly files: FileList;
    readonly items: { readonly length: number; add(file: File): null };

    constructor() {
      const entries: File[] = [];
      const files: FileList = Object.create(FileList.prototype, {
        length: { get: () => entries.length },
        item: { value: (index: number) => entries[index] ?? null }
      });
      this.files = files;
      this.items = {
        get length() {
          return entries.length;
        },
        add(file: File) {
          Object.defineProperty(files, entries.length, { value: file, enumerable: true });
          entries.push(file);
          return null;
        }
      };
    }
  }
  globalThis.DataTransfer = DataTransferStub as unknown as typeof DataTransfer;
}
