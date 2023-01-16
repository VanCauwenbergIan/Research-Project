import '../index.css'
import { initTest } from './Tests/testScript'
import * as THREE from 'three'
import Camera from './Cameras/perspectiveCamera'
import {
  addHelpers,
  onMouseDown,
  onDrag,
  onMouseMove,
  onScreenChange,
  onMouseUp,
  checkCollision,
  initMenuItems,
  convertMouseToVector3,
} from './Utils/utils'
import GTLFLoader from './Loaders/gltfLoader'
import AmbientLight from './Lights/ambientLight'
import DirectionalLight from './Lights/directionalLight'
import OrbitControls from './Controls/orbitControls'
import DragControls from './Controls/dragControls'
import {
  computeBoundsTree,
  disposeBoundsTree,
  acceleratedRaycast,
} from 'three-mesh-bvh'
import SnappingBox from './Utils/snappingBox'
import { LoadingManager } from './Loaders/loadingManager'

// DOM elements
let htmlCanvas, htmlLoader, htmlMainMenu, htmlHeader, htmlFooter, htmlGUI
// Scene components
let scene, renderer, camera, loadingManager
// Objects
let pcCase, psu, motherboard, motherboard2, snappingBox
//Data
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}
let currentlyDraggable = []
let raycaster, pointer
// Controls
let orbitControls, dragControls
// Bounding boxes
let caseBB, psuBB, motherboardBB, motherboardBB2
// Events
const newModelDraggedIn = new Event('model-dragged-in')

const initScene = () => {
  // Scene
  scene = new THREE.Scene()

  // Loader
  loadingManager = new LoadingManager(scene, htmlLoader, htmlGUI)

  // Renderer
  renderer = new THREE.WebGLRenderer({ canvas: htmlCanvas, antialias: true })
  renderer.shadowMap.type = THREE.PCFShadowMap
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0xccd7d6, 1)
  renderer.physicallyCorrectLights = true

  // addHelpers(scene)
  loadCamera()
  loadModels()
  loadLights()
  loadControls()
  loadRaycaster()

  initMenuItems(htmlMainMenu, htmlCanvas, newModelDraggedIn)

  htmlCanvas.addEventListener('model-dragged-in', (e) => {
    // for testing
    console.log(e.chosenModel)

    const currentOptions = [motherboard, motherboard2]
    const chosenObject = currentOptions.find(
      (option) => option.name === e.chosenModel,
    )

    console.log(chosenObject)
    const newPosition = convertMouseToVector3(pointer, camera.instance)
    console.log(newPosition)

    chosenObject.position.set(newPosition.x, newPosition.y, newPosition.z)
    scene.add(chosenObject)
  })
}

const loadCamera = () => {
  // Add a basic camera
  camera = new Camera(
    {
      fov: 50,
      near: 0.1,
      far: 100,
      x: 4.4,
      y: 1.8,
      z: 7.2,
      width: sizes.width,
      height: sizes.height,
    },
    scene,
  )
  camera.rotate(-7, 29, 3)
}

const loadModels = () => {
  const gltfLoader = new GTLFLoader(scene, loadingManager.instance)

  gltfLoader
    .addModel(
      '../assets/models/PC/Cases/computer_case_based_off_of_nzxt_510b.glb',
      'case',
      true,
    )
    .then((result) => {
      pcCase = result
      caseBB = new THREE.Box3().setFromObject(pcCase)

      const center = caseBB.getCenter(new THREE.Vector3())

      pcCase.position.x += pcCase.position.x - center.x
      pcCase.position.y += pcCase.position.y - center.y
      pcCase.position.z += pcCase.position.z - center.z
    })
  gltfLoader
    .addModel('../assets/models/PC/PSU/power_supply_-_basic.glb', 'psu', true)
    .then((result) => {
      psu = result
      psuBB = new THREE.Box3().setFromObject(psu)
      psu.position.set(0, -2, 3)
      psu.scale.set(0.55, 0.55, 0.55)
      psu.rotation.y = Math.PI * 1.5
      psu.rotation.z = Math.PI
      psu.isDraggable = true
    })
  gltfLoader
    .addModel(
      '../assets/models/PC/Motherboards/motherboard_am4.glb',
      'motherboard',
    )
    .then((result) => {
      motherboard = result
      motherboardBB = new THREE.Box3().setFromObject(motherboard)
      motherboard.scale.set(0.49, 0.49, 0.49)
      motherboard.rotation.x = Math.PI / 2
      motherboard.isDraggable = true
    })
  gltfLoader
    .addModel(
      '../assets//models/PC/Motherboards/maximus_vi_formula.glb',
      'motherboard2',
    )
    .then((result) => {
      motherboard2 = result
      motherboardBB2 = new THREE.Box3().setFromObject(motherboard2)
      motherboard2.scale.set(0.6, 0.6, 0.6)
      motherboard2.rotation.y = Math.PI * 1.5
      motherboard2.isDraggable = true
    })
}

const loadLights = () => {
  // Add basic light to see models
  new AmbientLight({ color: 0xffffff, intensity: 2 }, scene)
  new DirectionalLight(
    { color: 0xffffff, intensity: 10, x: -14, y: 2.5, z: 11.2 },
    scene,
  )
}

const loadControls = () => {
  orbitControls = new OrbitControls(
    { dampening: true },
    camera.instance,
    htmlCanvas,
  )
  dragControls = new DragControls(
    currentlyDraggable,
    camera.instance,
    htmlCanvas,
  )

  dragControls.instance.transformGroup = true

  onDrag(orbitControls.instance, dragControls.instance)
}

const loadRaycaster = () => {
  // Add bvh extensions to THREE
  THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree
  THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree
  THREE.Mesh.prototype.raycast = acceleratedRaycast

  raycaster = new THREE.Raycaster()
  raycaster.firstHitOnly = true
  // raycaster is too performance intensive on large objects without bvh
  pointer = new THREE.Vector2()
  snappingBox = new SnappingBox(scene)
  onMouseMove(
    raycaster,
    pointer,
    camera.instance,
    scene,
    sizes,
    currentlyDraggable,
  )
  onMouseDown(raycaster, pointer, camera.instance, scene, sizes, snappingBox)
  onMouseUp(raycaster, pointer, camera.instance, scene, sizes, snappingBox)
}

const tick = () => {
  //Render
  renderer.render(scene, camera.instance)

  // Update movable object bounding boxes
  updateBoundingBoxes()

  // Loop
  window.requestAnimationFrame(tick)
}

const updateBoundingBoxes = () => {
  if (snappingBox) {
    snappingBox.updateBoundingBox()

    if (caseBB && psuBB) {
      psuBB = new THREE.Box3().setFromObject(psu)

      checkCollision(
        snappingBox,
        psuBB,
        psu,
        dragControls.instance,
        orbitControls.instance,
      )
    }
  }
}

;(() => {
  window.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded')
    htmlCanvas = document.querySelector('.webgl')
    htmlLoader = document.querySelector('.loading-bar')
    htmlGUI = document.querySelector('.gui')
    htmlMainMenu = htmlGUI.querySelector('.gui-main-menu')
    htmlHeader = htmlGUI.querySelector('.gui-header')
    htmlFooter = htmlGUI.querySelector('.gui-footer')

    // initTest()
    initScene()
    onScreenChange(sizes, camera, renderer)
    tick()
  })
})()
