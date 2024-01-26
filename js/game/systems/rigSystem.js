import { HAND_HEIGHT, RIG_HEIGHT } from "../../constants/index.js";
import { RigEntity } from "../entities/index.js";
import { System } from "./system.js";

export class RigSystem extends System {
  #rigEntity = null;

  constructor(game) {
    super(game);
  }

  // Getter of rig entity
  get rigEntity() {
    return this.#rigEntity;
  }

  /**
   * Initialize
   */
  init() {
    // Rig entities
    this.#rigEntity = new RigEntity(this);
  }

  /**
   * Listener when xr presenting state is changed
   * @param {*} isXRPresenting
   */
  onXRPresent(isXRPresenting) {
    if (this.#rigEntity === null) return;

    const { camera, scene } = this._game;

    const foundEntity = this.getEntity(this.#rigEntity.id);

    if (isXRPresenting) {
      if (!foundEntity) {
        // Add camera to xr rig
        camera.position.y = RIG_HEIGHT - HAND_HEIGHT;
        this.#rigEntity.object3D.add(camera);
        // Add xr rig
        this.addEntity(this.#rigEntity);
      }
    } else {
      if (foundEntity) {
        // Add camera to scene root
        camera.position.y = RIG_HEIGHT;
        scene.add(camera);
        this.removeEntity(this.#rigEntity.id);
      }
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
