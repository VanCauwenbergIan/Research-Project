import '../index.css'
import { initTest } from './Tests/testScript'
import * as THREE from 'three'
import Camera from './Cameras/perspectiveCamera'
import { listenToScreenChanges } from './Utils/utils'
import GTLFLoader from './Loaders/gltfLoader'
import AmbientLight from './Lights/ambientLight'
import DirectionalLight from './Lights/directionalLight'
import OrbitControls from './Controls/orbitControls'

// DOM elements
let htmlCanvas
// Scene components
let scene, renderer, camera
// Object Meshes
let pcCase
//Data
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}
const cursor = {
  x: 0,
  y: 0,
}

const initScene = () => {
  // Scene
  scene = new THREE.Scene()

  // Renderer
  renderer = new THREE.WebGLRenderer({ canvas: htmlCanvas })
  renderer.shadowMap.type = THREE.PCFShadowMap
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x333333, 1)
  renderer.physicallyCorrectLights = true

  loadCamera()
  loadModels()
  loadLights()
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
      // pcCase.scale.set(0.25, 0.25, 0.25)
      // camera.instance.lookAt(pcCase.position)
      const box = new THREE.Box3().setFromObject(pcCase)
      const center = box.getCenter(new THREE.Vector3())

      pcCase.position.x += pcCase.position.x - center.x
      pcCase.position.y += pcCase.position.y - center.y
      pcCase.position.z += pcCase.position.z - center.z
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
  new OrbitControls({ dampening: true }, camera.instance, htmlCanvas)
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
    listenToScreenChanges(sizes, camera, renderer)
    tick()
  })
})()
