import { disposeObject } from "../../utils/index.js";

/**
 * Base entity
 */
export class Entity {
  _object3D; // Three object
  _components = new Set(); // Components attached to this entity

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

  // Getter of components
  get components() {
    return this._components;
  }

  /**
   * Add component to this entity
   * @param component
   */
  addComponent(component) {
    this._components.add(component);
  }

  /**
   * Get component of EComponentType on this entity if it exists
   * @param type
   * @returns found component of type or null
   */
  getComponentByType(type) {
    for (const component of this._components.values()) {
      if (component.type === type) {
        return component;
      }
    }
    return null;
  }

  /**
   * Remove single component by type
   * @param type
   */
  removeComponentByType(type) {
    for (const component of this._components) {
      if (type === component.type) {
        component.dispose();
        this._components.delete(component);
      }
    }
  }

  /**
   * Remove multiple components by type
   * @param types
   */
  removeComponentsByType(types) {
    for (const component of this._components) {
      if (types.includes(component.type)) {
        component.dispose();
        this._components.delete(component);
      }
    }
  }

  /**
   * Initialize
   */
  init() {}

  /**
   * Listener when xr presenting state is changed
   * @param {*} isXRPresenting
   */
  onXRPresent(isXRPresenting) {}

  /**
   * Update components
   */
  _updateComponents(delta) {
    for (const component of this._components) {
      component.update(delta);
    }
  }

  /**
   * Dispose components
   */
  _disposeComponents() {
    for (const component of this._components) {
      component.dispose();
    }
  }

  /**
   * Update
   */
  update(delta) {
    this._updateComponents(delta);
  }

  /**
   * Dispose
   */
  dispose() {
    this._disposeComponents();
    disposeObject(this);
  }
}
