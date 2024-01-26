import * as THREE from "three";

import { COMPONENT_TYPE } from "../../constants/index.js";
import { Component } from "./component.js";

// TODO Extend to have sphere collider as well
export class ColliderComponent extends Component {
  _type = COMPONENT_TYPE.COLLIDER;
  #bbox;
  #collidableEntities = new Set();

  // Callbacks
  #onCollide = null;

  constructor(entity) {
    super(entity);

    // Generate bounding box
    const bbox = new THREE.Box3();
    bbox.setFromObject(entity.object3D);
    this.#bbox = bbox;
  }

  // Getter of bbox
  get bbox() {
    return this.#bbox;
  }

  // Getter of collidableEntities
  get collidableEntities() {
    return this.#collidableEntities;
  }

  // Setter of collidableEntities
  set collidableEntities(val) {
    this.#collidableEntities = val;
  }

  // Getter of onCollide
  get onCollide() {
    return this.#onCollide;
  }

  // Setter of onCollide
  set onCollide(val) {
    this.#onCollide = val;
  }

  // Getter of collidable colliders
  get collidableColliders() {
    const colliders = [];
    for (const collidableEntity of this.#collidableEntities) {
      const collider = collidableEntity.getComponentByType(
        COMPONENT_TYPE.Collider
      );

      if (collider === null) continue;

      colliders.push(collider);
    }

    return new Set(colliders);
  }

  /**
   * Check collisions
   */
  #checkCollisions() {
    for (const collidableCollider of this.collidableColliders) {
      if (this.#bbox.intersectsBox(collidableCollider.bbox)) {
        this.#onCollide?.(collidableCollider.entity);
      }
    }
  }

  /**
   * Update bbox
   */
  #updateBBox() {
    const { geometry, matrixWorld } = this._entity.object3D;

    geometry.computeBoundingBox();
    if (geometry.boundingBox) {
      this.#bbox.copy(geometry.boundingBox).applyMatrix4(matrixWorld);
    }
  }

  /**
   * Update
   */
  update() {
    this.#updateBBox();
    this.#checkCollisions();
  }

  /**
   * Dispose
   */
  dispose() {}
}
