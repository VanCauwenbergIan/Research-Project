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
  addMenuItems,
  convertMouseToVector3,
  initMenuEvents,
  enableDragMenu,
  disableDragMenu,
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
import { fetchAllComponents, fetchCases } from './Utils/requests'

// DOM elements
let htmlCanvas, htmlLoader, htmlMainMenu, htmlHeader, htmlFooter, htmlGUI
// Scene components
let scene, renderer, camera, loadingManager, snappingBox
// Meshes
let caseMesh,
  motherboardMesh,
  cpuMesh,
  memoryMeshes = [],
  cpucoolerMesh,
  gpuMesh,
  storageMeshes = [],
  coolerMeshes = [],
  psuMesh
// Objects
let cases = [],
  motherboards = [],
  cpus = [],
  memory = [],
  cpucoolers = [],
  gpus = [],
  storage = [],
  coolers = [],
  psus = []
// Object info
let casesInfo = [],
  motherboardsInfo = [],
  cpusInfo = [],
  memoryInfo = [],
  cpucoolersInfo = [],
  gpusInfo = [],
  storageInfo = [],
  coolersInfo = [],
  psusInfo = []
//Data
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}
let currentlyDraggable = []
let currentMenuOptions = [],
  currentMenuInfo = []
let raycaster, pointer
let currentstage = 0
// Controls
let orbitControls, dragControls
// Bounding boxes
let caseBB,
  motherboardBB,
  cpuBB,
  memoryBB = [],
  cpucoolerBB,
  gpuBB,
  storageBB = [],
  coolerBB = [],
  psuBB
// Events
const newModelDraggedIn = new Event('model-dragged-in')
// Shopping cart
let cart = []

const initScene = async () => {
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

  addHelpers(scene)
  loadCamera()
  loadLights()
  loadControls()
  loadRaycaster()

  // Init Menu (cases)
  handleStages(currentstage)
  handleDrag()
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

const loadModels = (components, arrayModels, arrayInfo) => {
  const gltfLoader = new GTLFLoader(scene, loadingManager.instance)

  for (const component of components) {
    gltfLoader
      .addModel(`../assets/models/${component.modelUrl}`, component.id)
      .then((result) => {
        arrayModels.push(result)
        result.rotation.set(
          component.rotation.x,
          component.rotation.y,
          component.rotation.z,
        )
        result.scale.set(
          component.scale.x,
          component.scale.y,
          component.scale.z,
        )

        if (component.objectType !== 'case') {
          console.log('draggable')
          result.isDraggable = true
        }

        console.log(arrayModels, arrayInfo)
      })
    arrayInfo.push(component)
  }

  // gltfLoader
  //   .addModel(
  //     '../assets/models/PC/Cases/computer_case_based_off_of_nzxt_510b.glb',
  //     'case',
  //     true,
  //   )
  //   .then((result) => {
  //     pcCase = result
  //     caseBB = new THREE.Box3().setFromObject(pcCase)

  //     const center = caseBB.getCenter(new THREE.Vector3())

  //     pcCase.position.x += pcCase.position.x - center.x
  //     pcCase.position.y += pcCase.position.y - center.y
  //     pcCase.position.z += pcCase.position.z - center.z
  //   })
  // gltfLoader
  //   .addModel('../assets/models/PC/PSU/power_supply_-_basic.glb', 'psu', true)
  //   .then((result) => {
  //     psu = result
  //     psuBB = new THREE.Box3().setFromObject(psu)
  //     psu.position.set(0, -2, 3)
  //     psu.scale.set(0.55, 0.55, 0.55)
  //     psu.rotation.y = Math.PI * 1.5
  //     psu.rotation.z = Math.PI
  //     psu.isDraggable = true
  //   })
  // gltfLoader
  //   .addModel(
  //     '../assets/models/PC/Motherboards/motherboard_am4.glb',
  //     'motherboard',
  //   )
  //   .then((result) => {
  //     motherboard = result
  //     motherboardBB = new THREE.Box3().setFromObject(motherboard)
  //     motherboard.scale.set(0.49, 0.49, 0.49)
  //     motherboard.rotation.x = Math.PI / 2
  //     motherboard.isDraggable = true
  //   })
  // gltfLoader
  //   .addModel(
  //     '../assets//models/PC/Motherboards/maximus_vi_formula.glb',
  //     'motherboard2',
  //   )
  //   .then((result) => {
  //     motherboard2 = result
  //     motherboardBB2 = new THREE.Box3().setFromObject(motherboard2)
  //     motherboard2.scale.set(0.6, 0.6, 0.6)
  //     motherboard2.rotation.y = Math.PI * 1.5
  //     motherboard2.isDraggable = true
  //   })
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

const handleDrag = () => {
  initMenuEvents(newModelDraggedIn, htmlCanvas)
  htmlCanvas.addEventListener('model-dragged-in', (e) => {
    const chosenObject = currentMenuOptions.find(
      (option) => option.name === e.chosenModel,
    )
    const chosenObjectInfo = currentMenuInfo.find(
      (info) => info.id === e.chosenModel,
    )
    console.log(chosenObject, chosenObjectInfo)

    let newPosition = new THREE.Vector3()

    if (chosenObjectInfo.objectType === 'case') {
      caseMesh = chosenObject
      caseBB = new THREE.Box3().setFromObject(caseMesh)

      const center = caseBB.getCenter(new THREE.Vector3())

      caseMesh.position.x += caseMesh.position.x - center.x
      caseMesh.position.y += caseMesh.position.y - center.y
      caseMesh.position.z += caseMesh.position.z - center.z
    } else {
      newPosition = convertMouseToVector3(pointer, camera.instance)
      chosenObject.position.set(newPosition.x, newPosition.y, newPosition.z)
    }

    scene.add(chosenObject)
    disableDragMenu(htmlMainMenu)
  })
}

const goForward = () => {
  currentstage += 1
  handleStages(currentstage)
}

const goBackward = () => {
  currentstage -= 1
  handleStages(currentstage)
}

const handleStages = async (stage) => {
  switch (stage) {
    case 0:
      const result = await fetchCases()
      loadModels(result.data.cases, cases, casesInfo)
      addMenuItems(htmlMainMenu, casesInfo)
      enableDragMenu(htmlMainMenu)
      currentMenuOptions = cases
      currentMenuInfo = casesInfo
      break
    case 1:
      break
    case 2:
      break
    case 3:
      break
    case 4:
      break
    case 5:
      break
    case 6:
      break
    case 7:
      break
    case 8:
      break
  }
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
  window.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded')
    htmlCanvas = document.querySelector('.webgl')
    htmlLoader = document.querySelector('.loading-bar')
    htmlGUI = document.querySelector('.gui')
    htmlMainMenu = htmlGUI.querySelector('.gui-main-menu')
    htmlHeader = htmlGUI.querySelector('.gui-header')
    htmlFooter = htmlGUI.querySelector('.gui-footer')

    // initTest()
    await initScene()
    onScreenChange(sizes, camera, renderer)
    tick()
  })
})()
