/**
 * Base system
 */
export class System {
  _game; // Game
  _entities = {}; // Entities attached to this system

  constructor(game) {
    this._game = game;
  }

  // Getter of game
  get game() {
    return this._game;
  }

  // Getter of entities
  get entities() {
    return this._entities;
  }

  /**
   * Add single entity
   * @param entity
   */
  addEntity(entity, parent = null) {
    if (parent) {
      parent.add(entity.object3D);
    } else {
      this._game.scene.add(entity.object3D);
    }
    this._entities[entity.id] = entity;
  }

  /**
   * Add multiple entities
   * @param entities
   */
  addEntities(entities, parent = null) {
    entities.forEach((entity) => this.addEntity(entity, parent));
  }

  /**
   * Get single entity by entity id
   * @param entityId
   * @returns Entity
   */
  getEntity(entityId) {
    return this._entities[entityId] ?? null;
  }

  /**
   * Get multiple entities by entity id
   * @param entityIds
   * @returns Entities
   */
  getEntities(entityIds) {
    return entityIds.map((entityId) => this.getEntity(entityId));
  }

  /**
   * Remove single entity by entity id
   * @param entityId
   */
  removeEntity(entityId) {
    this._entities[entityId]?.object3D.removeFromParent();
    delete this._entities[entityId];
  }

  /**
   * Remove multiple entities by entity id
   * @param entityIds
   */
  removeEntities(entityIds) {
    entityIds.map((entityId) => this.removeEntity(entityId));
  }

  // Initialize system
  init() {}

  /**
   * Listener when xr presenting state is changed
   * @param {*} isXRPresenting
   */
  onXRPresent(isXRPresenting) {}

  /**
   * Update entities
   */
  _updateEntities(delta) {
    for (const key in this._entities) {
      this._entities[key].update(delta);
    }
  }

  /**
   * Dispose entities
   */
  _disposeEntities() {
    for (const key in this._entities) {
      this._entities[key].dispose();
    }
  }

  /**
   * Update
   */
  update(delta) {
    this._updateEntities(delta);
  }

  /**
   * Dispose
   */
  dispose() {
    this._disposeEntities();
  }
}
