import * as THREE from "three";

import { Entity } from "./entity.js";
import {
  HAND_INDEX,
  NOTE_TYPE,
  ROTATION_BY_CUT_DIR,
} from "../../constants/index.js";
import { getHexColorByNoteType } from "../../utils/index.js";

export class NoteEntity extends Entity {
  #notesEntity; // Notes entity
  #index; // Index of instanced mesh
  #colliderComponent; // Collier component
  #noteType = NOTE_TYPE.RED;
  #lineIndex = 0;
  #lineLayer = 0;
  #cutDirection = 0;
  #color = new THREE.Color();
  #isPlaying = false;

  constructor(notesEntity, index) {
    super(new THREE.Mesh());

    const { noteSize, beatSaberSystem } = notesEntity;
    const { saberEntities } = beatSaberSystem;

    // Add note geometry, but hide during rendering
    this._object3D.geometry = new THREE.BoxGeometry(
      noteSize,
      noteSize,
      noteSize
    );
    this._object3D.visible = false;

    // TODO
    // // Add collider component
    // const colliderComponent = new ColliderComponent(this);
    // this.addComponent(colliderComponent);
    // // Saber entities are collidable with notes
    // colliderComponent.collidableEntities = new Set((saberEntities ?? []) as Entity<THREE.Mesh>[]);
    // // Callback when collide
    // colliderComponent.onCollide = this.onCollide;
    // this._colliderComponent = colliderComponent;

    this.#notesEntity = notesEntity;
    this.#index = index;
  }

  // Getter of note type
  get noteType() {
    return this.#noteType;
  }

  // Setter of note noteType
  set noteType(val) {
    this.#noteType = val;
  }

  // Getter of line index
  get lineIndex() {
    return this.#lineIndex;
  }

  // Setter of line index
  set lineIndex(val) {
    this.#lineIndex = val;
  }

  // Getter of line layer
  get lineLayer() {
    return this.#lineLayer;
  }

  // Setter of line layer
  set lineLayer(val) {
    this.#lineLayer = val;
  }

  // Getter of cut direction
  get cutDirection() {
    return this.#cutDirection;
  }

  // Setter of cut direction
  set cutDirection(val) {
    this.#cutDirection = val;
  }

  // Getter of color
  get color() {
    return this.#color;
  }

  // Setter of cut direction
  set color(val) {
    this.#color = val;
  }

  // Getter of playing status
  get isPlaying() {
    return this.#isPlaying;
  }

  /**
   * Play note
   * @param noteType
   * @param lineIndex
   * @param lineLayer
   * @param cutDirection
   * @param offsetBeat
   */
  play(noteType, lineIndex, lineLayer, cutDirection, offsetBeat) {
    // Prepare note first, which means that paint and adjust transform before playing
    this.#prepareNote(noteType, lineIndex, lineLayer, cutDirection, offsetBeat);

    this.#isPlaying = true;
  }

  /**
   * Stop playing
   */
  stop() {
    this.#isPlaying = false;
    this.object3D.position.set(0, 0, 0);
    this.object3D.rotation.set(0, 0, 0);
    this.#updateInstanceMatrix();
  }

  /**
   * Play note, which means that put note at the start line for runway
   * @param noteType
   * @param lineIndex
   * @param lineLayer
   * @param cutDirection
   * @param offsetBeat
   */
  #prepareNote(noteType, lineIndex, lineLayer, cutDirection, offsetBeat) {
    const { cellSize } = this.#notesEntity.beatSaberSystem;

    // Set color by note noteType
    const hex = getHexColorByNoteType(noteType);
    this.#updateInstanceColor(hex);
    // Position by line index, layer, and offset
    this._object3D.position.set(
      (lineIndex - 1.5) * cellSize,
      lineLayer * cellSize + 0.5,
      -offsetBeat
    );
    // Rotation by cut direction
    this._object3D.rotation.set(0, 0, ROTATION_BY_CUT_DIR[cutDirection]);
    this.#updateInstanceMatrix();

    this.#noteType = noteType;
    this.#lineIndex = lineIndex;
    this.#lineLayer = lineLayer;
    this.#cutDirection = cutDirection;
    this.#isPlaying = true;
  }

  /**
   * Let note move forward
   * @param {*} delta
   * @returns
   */
  #moveForwrard(delta) {
    const { noteVelocity, noteMaxFlyDist } = this.#notesEntity.beatSaberSystem;

    // If note flied enough, stop animating
    if (this._object3D.position.z > noteMaxFlyDist) {
      this.stop();
      return;
    }

    // Otherwise, move forward
    this._object3D.position.z += noteVelocity * delta;
    this.#updateInstanceMatrix();
  }

  /**
   * Update instance's color
   */
  #updateInstanceColor(hex) {
    this.#notesEntity.object3D.setColorAt(this.#index, this.#color.setHex(hex));
    if (this.#notesEntity.object3D.instanceColor) {
      this.#notesEntity.object3D.instanceColor.needsUpdate = true;
    }
  }

  /**
   * Update instance's matrix with this object
   */
  #updateInstanceMatrix() {
    this._object3D.updateMatrix();
    this.#notesEntity.object3D.setMatrixAt(this.#index, this._object3D.matrix);
    this.#notesEntity.object3D.instanceMatrix.needsUpdate = true;
  }

  /**
   * Listener when xr presenting state is changed
   * @param entity
   */
  onCollide = (entity) => {
    const { handIndex } = entity;

    // Stop playing this note
    this.stop();

    // Calculate score
    if (
      (handIndex === HAND_INDEX.LEFT && this.#noteType !== NOTE_TYPE.BLUE) ||
      (handIndex === HAND_INDEX.RIGHT && this.#noteType !== NOTE_TYPE.RED)
    ) {
      this.#notesEntity.beatSaberSystem.score =
        this.#notesEntity.beatSaberSystem.score + 100;
    } else {
      this.#notesEntity.beatSaberSystem.score =
        this.#notesEntity.beatSaberSystem.score - 50;
    }
  };
  /**
   * Update
   */
  update(delta) {
    if (!this.#isPlaying || !delta) return;

    this.#moveForwrard(delta);
    this._updateComponents(delta);
  }
}
