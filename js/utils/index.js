import { NOTE_TYPE, XR_SESSION_SUPPORT_TYPE } from "../constants/index.js";

// Dispose texture
export function disposeTexture(texture) {
  texture?.dispose();
}

// Dispose material
export function disposeMaterial(material) {
  if (!material) return;

  let materialArr = [];

  if (Array.isArray(material)) {
    materialArr = material;
  } else {
    materialArr[0] = material;
  }

  // Iterate all materials and their props
  for (const el of materialArr) {
    for (const [key, val] of Object.entries(el)) {
      // Filter out map props only
      if ((!key.endsWith("Map") && !key.endsWith("map")) || !val) continue;

      disposeTexture(val);
    }

    el.dispose();
  }
}

// Dispose object
export function disposeObject(object) {
  if (!object) return;

  object.removeFromParent();

  object.traverse((child) => {
    if (child.isMesh) {
      const { geometry, material } = child;

      geometry.dispose();
      disposeMaterial(material);
    }
  });
}

/**
 * Get types of xr support
 * @returns
 */
export async function getXRSupportTypes() {
  const supportTypes = new Set();

  if (navigator.xr) {
    const [isVRSupported, isARSupported] = await Promise.all([
      navigator.xr.isSessionSupported("immersive-vr"),
      navigator.xr.isSessionSupported("immersive-ar"),
    ]);

    isVRSupported && supportTypes.add(XR_SESSION_SUPPORT_TYPE.SUPPORTED_VR);
    isARSupported && supportTypes.add(XR_SESSION_SUPPORT_TYPE.SUPPORTED_AR);
  } else {
    supportTypes.add(XR_SESSION_SUPPORT_TYPE.NOT_FOUND);
  }

  return supportTypes;
}

/**
 * Get color by note type
 */
export function getHexColorByNoteType(noteType) {
  if (noteType === NOTE_TYPE.RED) return 0xff0000;
  if (noteType === NOTE_TYPE.BLUE) return 0x0000ff;

  return 0x000000;
}
