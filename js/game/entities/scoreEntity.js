import { HTMLMesh } from "three/addons/interactive/HTMLMesh.js";
import { InteractiveGroup } from "three/addons/interactive/InteractiveGroup.js";

import { Entity } from "./entity.js";

export class ScoreEntity extends Entity {
  #beatSaberSystem;
  #dom = document.createElement("div");
  #scoreMesh = null;
  #score = 0;

  constructor(beatSaberSystem) {
    const { renderer, camera, container } = beatSaberSystem.game;

    super(new InteractiveGroup(renderer, camera));

    this.#dom.style.background = "white";
    this.#dom.style.width = "2000px";
    this.#dom.style.height = "500px";
    this.#dom.style.fontSize = "200px";
    this.#dom.style.padding = "4px";
    this.#dom.style.display = "flex";
    this.#dom.style.justifyContent = "center";
    this.#dom.style.alignItems = "center";
    this.#dom.style.borderRadius = "4px";
    this.#dom.innerText = `${this.#score}`;
    container.appendChild(this.#dom);
    const scoreMesh = new HTMLMesh(this.#dom);
    scoreMesh.position.y = 0.2;
    scoreMesh.position.z -= 18;
    this._object3D.add(scoreMesh);

    this.#scoreMesh = scoreMesh;
  }

  // Getter of beatsaber system
  get beatSaberSystem() {
    return this.#beatSaberSystem;
  }

  // Getter of score
  get score() {
    return this.#score;
  }

  // Setter of score
  set score(val) {
    this.#score = val;
    this.#dom.innerText = `${val}`;
  }

  /**
   * Update
   */
  update(delta) {
    this.#scoreMesh?.material.map?.update();
    this._updateComponents(delta);
  }

  /**
   * Dispose
   */
  dispose() {
    this.#dom.remove();
    this.#scoreMesh?.dispose();
    disposeObject(this._object3D);
    this._disposeComponents();
  }
}
