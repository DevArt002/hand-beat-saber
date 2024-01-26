export class Component {
  _type; // Component type
  _entity; // Entity

  constructor(entity) {
    this._entity = entity;
  }

  // Getter of entity
  get entity() {
    return this._entity;
  }

  // Getter of type
  get type() {
    return this._type;
  }

  /**
   * Update
   */
  update(delta) {}

  /**
   * Dispose
   */
  dispose() {}
}
