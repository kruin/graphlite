const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'viewer.js'), 'utf8');
const start = source.indexOf('  const PLAY_VIDEO_FRAME_RATE = 30;');
const end = source.indexOf('\n  async function recordPlayWebm()', start);
if (start < 0 || end < 0) throw new Error('Play-videocodeblok niet gevonden');

let intervalDelay = 0;
let intervalCleared = false;

class MockMediaRecorder {
  static isTypeSupported(type) {
    return type === 'video/mp4;codecs=avc1.424028' || type === 'video/webm;codecs=vp9';
  }

  constructor(_stream, options = {}) {
    if (options.mimeType && !MockMediaRecorder.isTypeSupported(options.mimeType)) {
      throw new Error(`niet ondersteund: ${options.mimeType}`);
    }
    this.mimeType = options.mimeType || 'video/webm';
    this.videoBitsPerSecond = options.videoBitsPerSecond;
  }
}

global.MediaRecorder = MockMediaRecorder;
global.window = {
  MediaRecorder: MockMediaRecorder,
  setInterval(callback, delay) {
    intervalDelay = delay;
    callback();
    return 77;
  },
  clearInterval(id) {
    if (id === 77) intervalCleared = true;
  }
};

const block = source.slice(start, end);
eval(`${block}
globalThis.__playVideoRuntime = {
  createPlayMediaRecorder,
  canvasRecordingFrameSource,
  startCanvasRecordingFramePump
};`);

const fail = message => {
  console.error(`LINKEDIN-VIDEO RUNTIME: FOUT - ${message}`);
  process.exit(1);
};

const selected = globalThis.__playVideoRuntime.createPlayMediaRecorder({});
if (selected.extension !== 'mp4') fail(`verwacht MP4, kreeg ${selected.extension}`);
if (!selected.mimeType.includes('avc1.424028')) fail(`verkeerde eerste codec: ${selected.mimeType}`);
if (selected.recorder.videoBitsPerSecond !== 4000000) fail('bitrate-doel is niet 4 Mbps');

let requestedFrames = 0;
const manualRates = [];
const manualTrack = {
  readyState: 'live',
  requestFrame() {
    requestedFrames += 1;
  },
  stop() {}
};
const manualCanvas = {
  captureStream(rate) {
    manualRates.push(rate);
    return {
      getVideoTracks: () => [manualTrack],
      getTracks: () => [manualTrack]
    };
  }
};
const manualSource = globalThis.__playVideoRuntime.canvasRecordingFrameSource(manualCanvas);
if (manualSource.mode !== 'request-frame') fail(`verkeerde handmatige modus: ${manualSource.mode}`);
if (manualRates.join(',') !== '0') fail(`captureStream verwacht 0, kreeg ${manualRates.join(',')}`);
const stopPump = globalThis.__playVideoRuntime.startCanvasRecordingFramePump(manualSource.requestFrame);
stopPump();
if (requestedFrames < 2) fail(`framepomp vroeg slechts ${requestedFrames} frames op`);
if (intervalDelay !== 33) fail(`frame-interval is ${intervalDelay} ms, verwacht 33 ms`);
if (!intervalCleared) fail('framepomp werd niet gestopt');

let firstTrackStopped = false;
let pixelWrites = 0;
const fallbackRates = [];
const fallbackCanvas = {
  width: 1200,
  height: 628,
  captureStream(rate) {
    fallbackRates.push(rate);
    const track = rate === 0
      ? { readyState: 'live', stop() { firstTrackStopped = true; } }
      : { readyState: 'live', stop() {} };
    return {
      getVideoTracks: () => [track],
      getTracks: () => [track]
    };
  },
  getContext() {
    return {
      save() {},
      restore() {},
      fillRect(x, y, width, height) {
        if (x === 1199 && y === 627 && width === 1 && height === 1) pixelWrites += 1;
      },
      set fillStyle(_value) {}
    };
  }
};
const fallbackSource = globalThis.__playVideoRuntime.canvasRecordingFrameSource(fallbackCanvas);
fallbackSource.requestFrame();
if (fallbackSource.mode !== 'canvas-touch') fail(`verkeerde fallbackmodus: ${fallbackSource.mode}`);
if (fallbackRates.join(',') !== '0,30') fail(`fallbackrates zijn ${fallbackRates.join(',')}`);
if (!firstTrackStopped) fail('ongebruikte handmatige stream werd niet gestopt');
if (pixelWrites !== 1) fail('fallback heeft het onzichtbare wisselpixel niet geschreven');

console.log('LINKEDIN-VIDEO RUNTIME: OK (MP4 eerst; requestFrame 30 fps; canvasfallback)');
