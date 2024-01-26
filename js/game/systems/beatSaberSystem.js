import * as THREE from "three";

import { BSM_DIFFICULTY_DATA, BSM_INFO_DATA } from "../../constants/index.js";
import { FloorEntity, NotesEntity, ScoreEntity } from "../entities/index.js";
import { System } from "./system.js";

export class BeatSaberSystem extends System {
  #clock = new THREE.Clock();

  // Entities
  #floorEntity = null;
  #notesEntity = null;
  #scoreEntity = null;

  // Beat saber parameters
  #bpm; // beats per min
  #bps; // beats per second
  #tpb; // time per beat
  #floorSize = [2, 25]; // Runway width&length is meters
  #cellSize; // Note size in meters. Assuming the note emitter is 4x3 grid
  #noteMaxFlyDist; // Note is gonna be re-positioned or deleted at the max distance
  #noteMaxFlyTime = 3; // seconds which take to reach at the max distance
  #noteVelocity; // m/s
  #beatsForFly;
  #notes = {};
  #maxNoteCount = 20;
  #track = new Audio("/assets/audio/beat_saber_track.mp3");
  #isPlaying = false;
  #prevBeat = -1;

  constructor(game) {
    super(game);

    this.#bpm = BSM_INFO_DATA._beatsPerMinute;
    this.#bps = this.#bpm / 60;
    this.#tpb = 1 / this.#bps;
    this.#cellSize = this.#floorSize[0] / 4;
    this.#noteMaxFlyDist = this.#floorSize[1];
    this.#noteVelocity = this.#noteMaxFlyDist / this.#noteMaxFlyTime;
    this.#beatsForFly = this.#bps * (this.#floorSize[1] / this.#noteVelocity);
  }

  // Getter of rig entity
  get rigEntity() {
    return this._game.rigSystem.rigEntity;
  }

  // Getter of sabers
  get handEntities() {
    return this.rigEntity?.handEntities ?? null;
  }

  // Getter of sabers
  get saberEntities() {
    return [this.leftSaberEntity, this.rightSaberEntity];
  }

  // Getter of left saber
  get leftSaberEntity() {
    return this.rigEntity?.leftSaberEntity ?? null;
  }

  // Getter of right saber
  get rightSaberEntity() {
    return this.rigEntity?.rightSaberEntity ?? null;
  }

  // Getter of note size
  get cellSize() {
    return this.#cellSize;
  }

  // Getter of expected maximum count of notes in scene
  get maxNoteCount() {
    return this.#maxNoteCount;
  }

  // Getter of note velocity
  get noteVelocity() {
    return this.#noteVelocity;
  }

  // Getter of max fly distance
  get noteMaxFlyDist() {
    return this.#noteMaxFlyDist;
  }

  // Getter of floor size
  get floorSize() {
    return this.#floorSize;
  }

  // Getter of score
  get score() {
    return this.#scoreEntity?.score ?? 0;
  }

  // Setter of score
  set score(val) {
    if (!this.#scoreEntity) return;

    this.#scoreEntity.score = val;
  }

  // Getter of playing status
  get isPlaying() {
    return this.#isPlaying;
  }

  /**
   * Initialize
   */
  async init() {
    // Load audio track
    await this.#loadAudioTrack();
    // Bake beat saber data first
    this.#bakeBSMData();

    // Add floor entity
    const floorEntity = new FloorEntity(this.#floorSize);
    floorEntity.object3D.position.z = -this.#floorSize[1] / 2;
    this.addEntity(floorEntity);
    this.#floorEntity = floorEntity;

    // Add notes entity
    const notesEntity = new NotesEntity(this);
    notesEntity.object3D.position.z -= this.#floorSize[1];
    this.addEntity(notesEntity);
    this.#notesEntity = notesEntity;

    // Add score entity
    const scoreEntity = new ScoreEntity(this);
    this.addEntity(scoreEntity);
    this.#scoreEntity = scoreEntity;

    // Stop clock
    this.#clock.stop();
  }

  /**
   * Bake BSM data, destruct into note array per integer time(second)
   */
  #bakeBSMData() {
    for (const note of BSM_DIFFICULTY_DATA._notes) {
      const key = Math.floor(note._time);
      if (this.#notes[key]) {
        this.#notes[key].push(note);
      } else {
        this.#notes[key] = [note];
      }
    }
  }

  /**
   * Load audio track
   * @returns
   */
  async #loadAudioTrack() {
    return new Promise((resolve, reject) => {
      try {
        this.#track.addEventListener("canplaythrough", resolve);
      } catch (error) {
        console.error(error);
        this.#track.removeEventListener("canplaythrough", resolve);
        reject();
      }
    });
  }

  /**
   * Play
   */
  play() {
    if (this.#isPlaying || this.#notesEntity === null) return;

    this.#isPlaying = true;
    this.#clock.start();
    this.#track.play();
  }

  /**
   * Stop playing
   * @returns
   */
  stop() {
    if (!this.#isPlaying) return;

    this.#isPlaying = false;
    this.#clock.stop();
    this.#track.pause();
    this.#track.currentTime = 0;
    this.score = 0;
    this.#notesEntity?.stop();
  }

  /**
   * Play notes
   * @param beat
   * @returns
   */
  #playNotes(beat) {
    if (this.#notesEntity === null) return;

    const integerBeat = Math.floor(beat);
    const offset = beat - integerBeat;

    // Check if notes corresponding to key is added. If so, don't move forward.
    if (this.#prevBeat === integerBeat) return;

    this.#prevBeat = integerBeat;

    const key = Math.floor(beat + this.#beatsForFly);
    const activeNotes = this.#notes[key] ?? [];

    this.#notesEntity?.addNewNotes(activeNotes, offset);
  }

  /**
   * Update
   */
  update() {
    // Get delta&elapsed time
    const delta = this.#clock.getDelta();
    const elapsed = this.#clock.elapsedTime;

    // If it's in play mode, play notes too
    if (this.#isPlaying && this.#notesEntity !== null) {
      const beat = elapsed / this.#tpb;
      this.#playNotes(beat);
    }

    this._updateEntities(delta);
  }
}
