import { HTMLMesh } from "three/addons/interactive/HTMLMesh.js";
import { InteractiveGroup } from "three/addons/interactive/InteractiveGroup.js";

import { Entity } from "./entity.js";
import { disposeObject } from "../../utils/index.js";

export class StatsEntity extends Entity {
  #statsSystem;
  #statsMesh;

  constructor(statsSystem) {
    const { stats } = statsSystem;
    const { renderer, camera } = statsSystem.game;

    super(new InteractiveGroup(renderer, camera));

    if (stats !== null) {
      const statsMesh = new HTMLMesh(stats.dom);
      statsMesh.position.x = 0;
      statsMesh.position.y = 1.8;
      statsMesh.position.z = -1;
      statsMesh.rotation.x = Math.PI / 4;
      statsMesh.scale.setScalar(2.5);
      this._object3D.add(statsMesh);
      this.#statsMesh = statsMesh;
    }

    this.#statsSystem = statsSystem;
  }

  // Getter of stats system
  get statsSystem() {
    return this.#statsSystem;
  }

  /**
   * Update
   */
  update(delta) {
    this.#statsMesh?.material.map?.update();
    this._updateComponents(delta);
  }

  /**
   * Dispose
   */
  dispose() {
    this.#statsMesh?.dispose();
    disposeObject(this._object3D);
    this._disposeComponents();
  }
}
