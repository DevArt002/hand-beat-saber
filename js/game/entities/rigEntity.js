import * as THREE from "three";

import { Entity } from "./entity.js";
import { HAND_HEIGHT, HAND_INDEX } from "../../constants/index.js";
import { HandEntity } from "./handEntity.js";
import { disposeObject } from "../../utils/index.js";

export class RigEntity extends Entity {
  #rigSystem;
  #handEntities;

  constructor(rigSystem) {
    super(new THREE.Object3D());

    this.#rigSystem = rigSystem;

    // Hand entities
    const leftHand = new HandEntity(this, HAND_INDEX.LEFT);
    const rightHand = new HandEntity(this, HAND_INDEX.RIGHT);
    this._object3D.add(leftHand.object3D);
    this._object3D.add(rightHand.object3D);
    this._object3D.position.y = HAND_HEIGHT;

    this.#handEntities = [leftHand, rightHand];
  }

  // Getter of rig system
  get rigSystem() {
    return this.#rigSystem;
  }

  // Getter of hand entities
  get handEntities() {
    return this.#handEntities;
  }

  // Getter of left hand
  get leftHand() {
    return this.handEntities[0];
  }

  // Getter of right hand
  get rightHand() {
    return this.handEntities[1];
  }

  // Getter of left saber
  get leftSaberEntity() {
    return this.handEntities[0].saberEntity;
  }

  // Getter of right saber
  get rightSaberEntity() {
    return this.handEntities[1].saberEntity;
  }

  /**
   * Update
   */
  update(delta) {
    this.leftHand.update(delta);
    this.rightHand.update(delta);
    this._updateComponents(delta);
  }

  /**
   * Dispose
   */
  dispose() {
    this.leftHand.dispose();
    this.rightHand.dispose();
    this._disposeComponents();
    disposeObject(this._object3D);
  }
}
