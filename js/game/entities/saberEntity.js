import * as THREE from "three";

import { ColliderComponent } from "../components/index.js";
import { Entity } from "./entity.js";
import { HAND_INDEX } from "../../constants/index.js";

export class SaberEntity extends Entity {
  #handEntity;
  #handIndex; // Left or Right hand
  #size = [0.02, 0.02, 2]; // Saber size

  constructor(handEntity, handIndex) {
    super(new THREE.Mesh());
    const [w, h, d] = this.#size;
    this._object3D.geometry = new THREE.BoxGeometry(w, h, d);
    this._object3D.material = new THREE.MeshBasicMaterial({
      color: handIndex === HAND_INDEX.LEFT ? 0xff0000 : 0x0000ff,
    });
    this._object3D.position.z -= d / 2;

    // Add collider component
    this.addComponent(new ColliderComponent(this));

    this.#handEntity = handEntity;
    this.#handIndex = handIndex;
  }

  // Getter of hand entity
  get handEntity() {
    return this.#handEntity;
  }

  // Getter of handIndex
  get handIndex() {
    return this.#handIndex;
  }

  // Getter of size
  get size() {
    return this.#size;
  }
}
