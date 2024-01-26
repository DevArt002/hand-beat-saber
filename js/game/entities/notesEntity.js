import * as THREE from "three";

import { Entity } from "./entity.js";
import { NoteEntity } from "./noteEntity.js";

// TODO Extend this entity to handle 2+ geometries
export class NotesEntity extends Entity {
  #beatSaberSystem; // Beatsaber system
  #noteEntities = []; // Geometries and materials are rendered in instanced mesh, but NoteEntity is needed for collider and animation
  #noteSize;

  constructor(beatSaberSystem) {
    const { cellSize, maxNoteCount } = beatSaberSystem;
    const noteSize = Math.sqrt((cellSize * cellSize) / 2);
    const geometry = new THREE.BoxGeometry(noteSize, noteSize, noteSize);
    super(new THREE.InstancedMesh(geometry, undefined, maxNoteCount));

    this.#beatSaberSystem = beatSaberSystem;

    this._object3D.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    // Initialize note entities
    const noteEntities = [];
    for (let i = 0; i < maxNoteCount; i++) {
      const noteEntity = new NoteEntity(this, i);
      this._object3D.add(noteEntity.object3D);
      noteEntities.push(noteEntity);
    }
    this.#noteEntities = noteEntities;

    this.#noteSize = noteSize;
  }

  // Getter of beatsaber system
  get beatSaberSystem() {
    return this.#beatSaberSystem;
  }

  // Getter of note size
  get noteSize() {
    return this.#noteSize;
  }

  // Getter of lazy notes
  get lazyNotes() {
    return this.#noteEntities.filter(({ isPlaying }) => !isPlaying);
  }

  /**
   * Add new notes
   */
  addNewNotes(notes, offset) {
    for (let i = 0; i < notes.length; i++) {
      const { _type, _lineIndex, _lineLayer, _cutDirection } = notes[i];
      this.lazyNotes[i].play(
        _type,
        _lineIndex,
        _lineLayer,
        _cutDirection,
        offset
      );
    }
  }

  /**
   * Stop playing
   * @returns
   */
  stop() {
    for (const noteEntity of this.#noteEntities) {
      noteEntity.stop();
    }
  }

  /**
   * Update note entities
   */
  _updateNoteEntities(delta) {
    for (const noteEntity of this.#noteEntities) {
      noteEntity.update(delta);
    }
  }

  /**
   * Dispose note entities
   */
  _disposeNoteEntities() {
    for (const noteEntity of this.#noteEntities) {
      noteEntity.dispose();
    }
  }

  /**
   * Animate instances
   */
  update(delta) {
    this._updateNoteEntities(delta);
    this._updateComponents(delta);
  }

  /**
   * Dispose
   */
  dispose() {
    this._object3D.dispose();
    this._disposeNoteEntities();
    this._disposeComponents();
  }
}
