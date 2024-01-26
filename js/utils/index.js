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
