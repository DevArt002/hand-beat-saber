import Stats from "three/addons/libs/stats.module";

import { StatsEntity } from "../entities/statsEntity.js";
import { System } from "./system.js";

export class StatsSystem extends System {
  #stats = new Stats(); // Stats
  #container = document.createElement("div"); // Stats container
  #rendererInfoContainer = document.createElement("div"); // Container of additional renderer info
  #statsEntity;

  constructor(game) {
    super(game);
  }

  // Getter of stats
  get stats() {
    return this.#stats;
  }

  /**
   * Initialize
   */
  init() {
    // Adjust styles of dom nodes
    this.#stats.dom.className = "stats";
    this.#rendererInfoContainer.className = "rendererInfo";
    this.#container.className = "statsContainer";
    // Append to dom tree
    this.#container.appendChild(this.#rendererInfoContainer);
    this.#container.appendChild(this.#stats.dom);
    this._game.container.appendChild(this.#container);
    // Instantiate 3D stats
    this.#statsEntity = new StatsEntity(this);
  }

  /**
   * Listener when xr presenting state is changed
   * @param {*} isXRPresenting
   */
  onXRPresent(isXRPresenting) {
    if (!this.#statsEntity) return;

    const foundEntity = this.getEntity(this.#statsEntity.id);

    // Add/Remove 3D stats conditionally
    if (isXRPresenting) {
      if (!foundEntity) {
        this.addEntity(this.#statsEntity);
      }
    } else {
      if (foundEntity) {
        this.removeEntity(this.#statsEntity.id);
      }
    }
  }

  /**
   * Update
   */
  update(delta) {
    // Update entities
    this._updateEntities(delta);

    // Update stats
    this.#stats.update();

    // Update renderer info
    const { memory, render, programs } = this._game.renderer.info;
    this.#rendererInfoContainer.innerHTML = `
      Frame number: ${render.frame} <br />
      Geometries: ${memory.geometries} <br />
      Textures: ${memory.textures} <br />
      Draw calls: ${render.calls} <br />
      Triangles: ${render.triangles} <br />
      Points: ${render.points} <br />
      Lines: ${render.lines} <br />
      Programs: ${programs?.length} <br />
    `;
  }

  /**
   * Dispose
   */
  dispose() {
    this.#container?.remove();
    this._disposeEntities();
  }
}
