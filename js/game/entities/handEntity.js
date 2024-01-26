import * as THREE from "three";

import { Entity } from "./entity.js";
import { HAND_INDEX } from "../../constants/index.js";

export class HandEntity extends Entity {
  #rigSystem;
  #handIndex; // Left or Right hand
  #size = [0.02, 0.02, 2]; // Saber size

  constructor(rigSystem, handIndex) {
    super(new THREE.Group());

    const { renderer, controllerModelFactory, handModelFactory } =
      rigSystem.game;
    const controller = renderer.xr.getController(handIndex);
    const controllerGrip = renderer.xr.getControllerGrip(handIndex);
    controllerGrip.add(
      controllerModelFactory.createControllerModel(controllerGrip)
    );
    const hand = renderer.xr.getHand(handIndex);
    hand.add(handModelFactory.createHandModel(hand));

    this._object3D.add(hand);

    const [w, h, d] = this.#size;
    const saberMesh = new THREE.Mesh();
    saberMesh.geometry = new THREE.BoxGeometry(w, h, d);
    saberMesh.material = new THREE.MeshBasicMaterial({
      color: handIndex === HAND_INDEX.LEFT ? 0xff0000 : 0x0000ff,
    });
    saberMesh.position.z -= d / 2;
    controller.add(saberMesh);
    this._object3D.add(controller);

    // TODO
    // // Add collider component
    // this.addComponent(new ColliderComponent(this));

    this.#handIndex = handIndex;
  }

  // Getter of rig system
  get rigSystem() {
    return this.#rigSystem;
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
