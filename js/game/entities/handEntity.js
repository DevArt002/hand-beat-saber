import * as THREE from "three";

import { Entity } from "./entity.js";
import { SaberEntity } from "./saberEntity.js";

export class HandEntity extends Entity {
  #rigEntity;
  #handIndex; // Left or Right hand
  #saberEntity; // Saber

  constructor(rigEntity, handIndex) {
    super(new THREE.Group());

    const { renderer, controllerModelFactory, handModelFactory } =
      rigEntity.rigSystem.game;
    const controller = renderer.xr.getController(handIndex);
    const controllerGrip = renderer.xr.getControllerGrip(handIndex);
    controllerGrip.add(
      controllerModelFactory.createControllerModel(controllerGrip)
    );
    const hand = renderer.xr.getHand(handIndex);
    hand.add(handModelFactory.createHandModel(hand));

    this._object3D.add(hand);

    const saberEntity = new SaberEntity(this, handIndex);
    controller.add(saberEntity.object3D);
    this._object3D.add(controller);

    this.#handIndex = handIndex;
    this.#saberEntity = saberEntity;
  }

  // Getter of rig entity
  get rigEntity() {
    return this.#rigEntity;
  }

  // Getter of handIndex
  get handIndex() {
    return this.#handIndex;
  }

  // Getter of saber
  get saberEntity() {
    return this.#saberEntity;
  }

  /**
   * Update
   */
  update(delta) {
    this.#saberEntity.update(delta);
    this._updateComponents(delta);
  }

  /**
   * Dispose
   */
  dispose() {
    this.#saberEntity.dispose();
    this._disposeComponents();
    disposeObject(this._object3D);
  }
}
