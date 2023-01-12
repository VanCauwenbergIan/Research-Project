import '../index.css'
import { initTest } from './Tests/testScript'
import * as THREE from 'three'
import Camera from './Cameras/perspectiveCamera'
import { onDrag, onMouseMove, onScreenChange } from './Utils/utils'
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

// DOM elements
let htmlCanvas
// Scene components
let scene, renderer, camera
// Object Meshes
let pcCase, psu
//Data
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}
const draggableObjects = []
const currentlyDraggable = []
let raycaster, pointer

const initScene = () => {
  // Scene
  scene = new THREE.Scene()

  // Renderer
  renderer = new THREE.WebGLRenderer({ canvas: htmlCanvas, antialias: true })
  renderer.shadowMap.type = THREE.PCFShadowMap
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x333333, 1)
  renderer.physicallyCorrectLights = true

  loadCamera()
  loadModels()
  loadLights()
  loadRaycaster()
  loadControls()
}

const loadCamera = () => {
  // Add a basic camera
  camera = new Camera(
    {
      fov: 50,
      near: 0.01,
      far: 1000,
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
  const gltfLoader = new GTLFLoader(scene)

  gltfLoader
    .addModel(
      '../assets/models/PC/Cases/computer_case_based_off_of_nzxt_510b.glb',
    )
    .then((result) => {
      pcCase = result
      const box = new THREE.Box3().setFromObject(pcCase)
      const center = box.getCenter(new THREE.Vector3())

      pcCase.position.x += pcCase.position.x - center.x
      pcCase.position.y += pcCase.position.y - center.y
      pcCase.position.z += pcCase.position.z - center.z
    })

  gltfLoader
    .addModel('../assets/models/PC/PSU/power_supply_-_basic.glb')
    .then((result) => {
      psu = result
      draggableObjects.push(psu)

      console.log(psu)
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

const loadRaycaster = () => {
  // Add bvh extensions to THREE
  THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree
  THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree
  THREE.Mesh.prototype.raycast = acceleratedRaycast

  raycaster = new THREE.Raycaster()
  raycaster.firstHitOnly = true
  pointer = new THREE.Vector2()
  onMouseMove(
    raycaster,
    pointer,
    camera.instance,
    scene,
    sizes,
    draggableObjects,
    currentlyDraggable,
  )
}

const loadControls = () => {
  const orbitControls = new OrbitControls(
    { dampening: true },
    camera.instance,
    htmlCanvas,
  )
  const dragControls = new DragControls(
    currentlyDraggable,
    camera.instance,
    htmlCanvas,
  )

  onDrag(orbitControls.instance, dragControls.instance)
}

const tick = () => {
  //Render
  renderer.render(scene, camera.instance)

  // Loop
  window.requestAnimationFrame(tick)
}

;(() => {
  window.addEventListener('DOMContentLoaded', (e) => {
    console.log('DOM loaded')
    htmlCanvas = document.querySelector('.webgl')

    // initTest()
    initScene()
    onScreenChange(sizes, camera, renderer)
    tick()
  })
})()
