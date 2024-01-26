import * as THREE from "three";
import { XRControllerModelFactory } from "three/addons/webxr/XRControllerModelFactory.js";
import { XRHandModelFactory } from "three/addons/webxr/XRHandModelFactory.js";

import { BeatSaberSystem, RigSystem, StatsSystem } from "./systems/index.js";
import { GAME_EVENTS, RIG_HEIGHT } from "../constants/index.js";

export default class Game extends THREE.EventDispatcher {
  // Essential renderer parameters
  #container; // HTML Dom which contains canvas
  #renderer; // Webgl renderer
  #scene; // Scene
  #camera; // Perspective camera
  #width = 1; // Canvas width
  #height = 1; // Canvas height
  #pixelRatio = window.devicePixelRatio; // Display ratio
  #aspect = 1; // Camera aspect
  // Systems
  #statsSystem; // Stats
  #rigSystem; // Rig
  #beatSaberSystem; // Beat saber
  // Other
  #controllerModelFactory = new XRControllerModelFactory();
  #handModelFactory = new XRHandModelFactory();

  constructor(container) {
    super();

    this.#container = container;
    this.#width = container.offsetWidth || 1;
    this.#height = container.offsetHeight || 1;
    this.#aspect = this.#width / this.#height;

    /**
     * Initialize elements for basic renderer
     */
    // Initialize webgl renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !(this.#pixelRatio > 1),
      alpha: true, // make the background transparent
    });
    renderer.setPixelRatio(this.#pixelRatio);
    renderer.setSize(this.#width, this.#height);
    renderer.xr.enabled = true;
    renderer.xr.setReferenceSpaceType("local");
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    // Initialize scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x444444);
    scene.fog = new THREE.Fog(0x3f7b9d, 17, 24);

    // Initialize camera
    const camera = new THREE.PerspectiveCamera(45, this.#aspect, 0.1, 1000);
    camera.position.set(0, RIG_HEIGHT, 0);
    scene.add(camera);

    // Initialize lights
    const directLight = new THREE.DirectionalLight(0xffffff, 1);
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(directLight);
    scene.add(ambientLight);

    this.#renderer = renderer;
    this.#scene = scene;
    this.#camera = camera;
  }

  // Getter of container
  get container() {
    return this.#container;
  }

  // Getter of width
  get width() {
    return this.#width;
  }

  // Getter of height
  get height() {
    return this.#height;
  }

  // Getter of pixelRatio
  get pixelRatio() {
    return this.#pixelRatio;
  }

  // Getter of aspect
  get aspect() {
    return this.#aspect;
  }

  // Getter of webgl renderer
  get renderer() {
    return this.#renderer;
  }

  // Getter of Scene
  get scene() {
    return this.#scene;
  }

  // Getter of camera
  get camera() {
    return this.#camera;
  }

  // Getter of stats system
  get statsSystem() {
    return this.#statsSystem;
  }

  // Getter of rig system
  get rigSystem() {
    return this.#rigSystem;
  }

  // Getter of controller model factory
  get controllerModelFactory() {
    return this.#controllerModelFactory;
  }

  // Getter of hand model factory
  get handModelFactory() {
    return this.#handModelFactory;
  }

  /**
   * Initialize
   */
  async init() {
    this.onWindowResize = this.onWindowResize.bind(this);
    this.update = this.update.bind(this);

    await this.initStatsSystem();
    await this.initRigSystem();
    await this.initBeatSaberSystem();
    this.#initEventListeners();

    this.dispatchEvent({ type: GAME_EVENTS.INITIALIZED });
  }

  /**
   * Initialize stats system
   */
  async initStatsSystem() {
    this.#statsSystem = new StatsSystem(this);
    await this.#statsSystem.init();
  }

  /**
   * Initialize rig system
   */
  async initRigSystem() {
    this.#rigSystem = new RigSystem(this);
    await this.#rigSystem.init();
  }

  /**
   * Initialize beatsaber system
   */
  async initBeatSaberSystem() {
    this.#beatSaberSystem = new BeatSaberSystem(this);
    await this.#beatSaberSystem.init();
  }

  /**
   * Play game
   */
  play() {
    this.#renderer.setAnimationLoop(this.update);
    this.#beatSaberSystem.play();
  }

  /**
   * Stop game rendering
   */
  stop() {
    this.#renderer.setAnimationLoop(null);
    this.#beatSaberSystem.stop();
  }

  /**
   * Initialize event listeners
   */
  #initEventListeners() {
    window.addEventListener("resize", this.onWindowResize, false);
  }

  /**
   * Dispose event listeners
   */
  #disposeEventListeners() {
    window.removeEventListener("resize", this.onWindowResize, false);
  }

  /**
   * Window resize listener
   */
  onWindowResize() {
    this.#width = this.#container.offsetWidth;
    this.#height = this.#container.offsetHeight;
    this.#aspect = this.#width / this.#height;

    this.#camera.aspect = this.#aspect;
    this.#camera.updateProjectionMatrix();
    this.#renderer.setSize(this.#width, this.#height);
  }

  /**
   * Update
   */
  update() {
    // Entered/Exited XR mode
    const isXRPresenting = this.#renderer.xr.isPresenting;
    this.#statsSystem?.onXRPresent(isXRPresenting);
    this.#rigSystem?.onXRPresent(isXRPresenting);
    this.#beatSaberSystem?.onXRPresent(isXRPresenting);

    // Render scene
    this.render();

    // Update systems
    this.#statsSystem?.update();
    this.#rigSystem?.update();
    this.#beatSaberSystem?.update();
  }

  /**
   * Render
   */
  render() {
    this.#renderer.render(this.#scene, this.#camera);
  }

  /**
   * Dispose
   */
  dispose() {
    // Dispose event listeners
    this.#disposeEventListeners(); // Remove event listeners
    this.#renderer.domElement.remove(); // Remove the canvas

    // Dispose systems
    this.#statsSystem.dispose();
    this.#rigSystem.dispose();
    this.#beatSaberSystem.dispose();
  }
}
