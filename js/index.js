import Game from "./game/index.js";
import { GAME_EVENTS, XR_SESSION_SUPPORT_TYPE } from "./constants/index.js";
import { getXRSupportTypes } from "./utils/index.js";

const root = document.getElementById("root");
const enterXRBtn = document.getElementById("enter-xr-btn");
const playBtn = document.getElementById("play-btn");

let currentXRSession = null;
let isVRSupport = false;
let isARSupport = false;

// Check XR support types
const checkXRSupport = async () => {
  const xrSupportTypes = await getXRSupportTypes();

  if (xrSupportTypes.has(XR_SESSION_SUPPORT_TYPE.SUPPORTED_VR)) {
    isVRSupport = true;
  }
  if (xrSupportTypes.has(XR_SESSION_SUPPORT_TYPE.SUPPORTED_AR)) {
    isARSupport = true;
  }
};
await checkXRSupport();

// Initialize game
const game = new Game(root);
game.init();

// Listener when game is initialized
const onGameInitialized = () => {
  enterXRBtn.className = "enabled";
  playBtn.className = "enabled";
};

// Listener when xr session is ended
const onXRSessionEnded = () => {
  currentXRSession?.removeEventListener("end", onXRSessionEnded);
  currentXRSession = game.renderer.xr.getSession() ?? null;
};

// Listener when xr session is started
const onXRSessionStarted = async (session) => {
  session.addEventListener("end", onXRSessionEnded);

  await game.renderer.xr.setSession(session);
  currentXRSession = game.renderer.xr.getSession() ?? null;
};

// Listener when enter XR mode
const onRequestXRSession = async () => {
  if (!navigator.xr) return;

  // Already XR session is in-progress, then abort here
  if (currentXRSession !== null) {
    currentXRSession.end();
    return;
  }

  let mode = null;
  if (isVRSupport) {
    mode = "immersive-vr";
  }
  if (isARSupport) {
    mode = "immersive-ar";
  }

  // Not available for XR mode, then abort here too
  if (mode === null) {
    return console.error("Device doesn't support XR");
  }

  const options = {
    optionalFeatures: [
      "local-floor",
      "bounded-floor",
      "hand-tracking",
      "layers",
    ],
  };

  await navigator.xr.requestSession(mode, options).then(onXRSessionStarted);
};

// Listener when play button is clicked
const onRequestPlay = () => {
  if (game.isPlaying) {
    game.stop();
    playBtn.innerText = "Play";
  } else {
    game.play();
    playBtn.innerText = "Stop";
  }
};

/**
 * Event listeners
 */
game.addEventListener(GAME_EVENTS.INITIALIZED, onGameInitialized);
enterXRBtn.addEventListener("pointerup", onRequestXRSession);
playBtn.addEventListener("pointerup", onRequestPlay);
