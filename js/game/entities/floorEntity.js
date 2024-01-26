import * as THREE from "three";

import { Entity } from "./entity.js";

export class FloorEntity extends Entity {
  #size; // Floor size
  constructor(size) {
    super(new THREE.Mesh());

    this._object3D.geometry = new THREE.PlaneGeometry(size[0], size[1]);
    this._object3D.material = new THREE.MeshStandardMaterial({
      color: 0x70cbff,
      roughness: 0,
      metalness: 0.5,
    });
    this._object3D.rotateX(-Math.PI / 2);

    this.#size = size;
  }

  // Getter of size
  get size() {
    return this.#size;
  }
}
