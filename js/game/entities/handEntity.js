import * as THREE from "three";

import { Entity } from "./entity.js";
import { HAND_INDEX } from "../../constants/index.js";

export class HandEntity extends Entity {
  #rigEntity;
  #handIndex; // Left or Right hand
  #size = [0.02, 0.02, 2]; // Saber size
  #saber; // Saber

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

    const [w, h, d] = this.#size;
    const saber = new THREE.Mesh();
    saber.geometry = new THREE.BoxGeometry(w, h, d);
    saber.material = new THREE.MeshBasicMaterial({
      color: handIndex === HAND_INDEX.LEFT ? 0xff0000 : 0x0000ff,
    });
    saber.position.z -= d / 2;
    controller.add(saber);
    this._object3D.add(controller);

    // TODO
    // // Add collider component
    // this.addComponent(new ColliderComponent(this));

    this.#handIndex = handIndex;
    this.#saber = saber;
  }

  // Getter of rig entity
  get rigEntity() {
    return this.#rigEntity;
  }

  // Getter of handIndex
  get handIndex() {
    return this.#handIndex;
  }

  // Getter of size
  get size() {
    return this.#size;
  }

  // Getter of saber
  get saber() {
    return this.#saber;
  }
}
