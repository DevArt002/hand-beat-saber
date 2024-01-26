export * from "./bsData.js";

export const GAME_EVENTS = {
  INITIALIZED: "initialized",
};

export const XR_SESSION_SUPPORT_TYPE = {
  SUPPORTED_AR: "supported_ar",
  SUPPORTED_VR: "supported_vr",
  NOT_FOUND: "not found",
};

export const HAND_INDEX = {
  LEFT: 0,
  RIGHT: 1,
};

export const NOTE_TYPE = {
  RED: 0,
  BLUE: 1,
  Unused: 2,
  Bomb: 3,
};
export const NOTE_CUT_DIR = {
  UP: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3,
  UP_LEFT: 4,
  UP_RIGHT: 5,
  DOWN_LEFT: 6,
  DOWN_RIGHT: 7,
  Any: 8, // dot
};

export const ROTATION_BY_CUT_DIR = {
  [NOTE_CUT_DIR.UP]: 0,
  [NOTE_CUT_DIR.DOWN]: Math.PI,
  [NOTE_CUT_DIR.LEFT]: Math.PI / 2,
  [NOTE_CUT_DIR.RIGHT]: -Math.PI / 2,
  [NOTE_CUT_DIR.UP_LEFT]: (-Math.PI * 3) / 4,
  [NOTE_CUT_DIR.UP_RIGHT]: (Math.PI * 3) / 4,
  [NOTE_CUT_DIR.DOWN_LEFT]: -Math.PI / 4,
  [NOTE_CUT_DIR.DOWN_RIGHT]: Math.PI / 4,
  [NOTE_CUT_DIR.Any]: 0,
};

export const COMPONENT_TYPE = {
  COLLIDER: "collider",
};

export const RIG_HEIGHT = 1.6; // in meter

export const HAND_HEIGHT = 1.2; // in meter
