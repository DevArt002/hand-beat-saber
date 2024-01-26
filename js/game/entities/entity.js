import { disposeObject } from "../../utils/index.js";

/**
 * Base entity
 */
export class Entity {
  _object3D; // Three object

  constructor(object3D) {
    this._object3D = object3D;
  }

  // Getter of entity id, which is same as object3D id
  get id() {
    return this._object3D.id;
  }

  // Getter of object3D
  get object3D() {
    return this._object3D;
  }

  /**
   * Initialize
   */
  init() {}

  /**
   * Update
   */
  update() {}

  /**
   * Dispose
   */
  dispose() {
    disposeObject(this);
  }
}
