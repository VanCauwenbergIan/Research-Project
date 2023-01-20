import '../index.css'
import { initTest } from './Tests/testScript'
import * as THREE from 'three'
import Camera from './Cameras/perspectiveCamera'
import {
  addHelpers,
  onDrag,
  onMouseMove,
  onScreenChange,
  addMenuItems,
  convertMouseToVector3,
  initMenuEvents,
  enableDragMenu,
  disableDragMenu,
  refreshMouse,
  getFirstIntersect,
  calculatePower,
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
import {
  fetchAllComponents,
  fetchCases,
  fetchCoolers,
  fetchCPUCoolers,
  fetchCPUs,
  fetchGPUs,
  fetchMemory,
  fetchMotherboards,
  fetchPSUs,
  fetchStorage,
} from './Utils/requests'

// DOM elements
let htmlCanvas,
  htmlLoader,
  htmlGUI,
  htmlMainMenu,
  htmlHeader,
  htmlFooter,
  htmlPriceHeader,
  htmlWattage,
  htmlStage,
  htmlConfirm,
  htmlRevert,
  htmlCart,
  htmlCartOpen,
  htmlCartClose,
  htmlCartItems,
  htmlOverlay,
  htmlPriceCart
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
let priceTotal = 0,
  wattageTotal = 0
let centeredCases = []
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

  // addHelpers(scene)
  loadCamera()
  loadLights()
  loadControls()
  loadRaycaster()

  initButtons()
  handleDrag()
  goForward()
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

  if (arrayModels.length === 0) {
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
            result.isDraggable = true
          }
        })
      arrayInfo.push(component)
    }
  }
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
  onMouseDown()
  onMouseUp()
}

export const checkCollision = (bb2, model) => {
  const bb1 = snappingBox.boundingBox

  if (bb2.intersectsBox(bb1) && !orbitControls.instance.enabled) {
    const center = bb1.getCenter(new THREE.Vector3())
    const sizeBB = bb1.getSize(new THREE.Vector3())
    const sizeModel = bb2.getSize(new THREE.Vector3())
    const modelInfo = currentMenuInfo.find((info) => info.id === model.name)

    dragControls.instance.deactivate()
    model.isDraggable = false
    snappingBox.removeBox()

    if (modelInfo && !cart.includes(modelInfo)) {
      addToCart(modelInfo)
    }

    if (center.x >= 0) {
      model.position.x = center.x + (sizeBB.x - sizeModel.x) / 2
    } else {
      model.position.x = center.x - (sizeBB.x - sizeModel.x) / 2
    }
    if (center.y >= 0) {
      model.position.y = center.y + (sizeBB.y - sizeModel.y) / 2
    } else {
      model.position.y = center.y - (sizeBB.y - sizeModel.y) / 2
    }
    if (center.z >= 0) {
      model.position.z = center.z + (sizeBB.z - sizeModel.z) / 2
    } else {
      model.position.z = center.z - (sizeBB.z - sizeModel.z) / 2
    }

    window.addEventListener('mouseup', () => {
      orbitControls.instance.enabled = true
      window.removeEventListener('mouseup', this)
    })
  }
}

const onMouseDown = () => {
  window.addEventListener('mousedown', (e) => {
    refreshMouse(pointer, sizes, e)
    raycaster.setFromCamera(pointer, camera.instance)

    let object = getFirstIntersect(raycaster, scene)

    if (object && object.isDraggable) {
      dragControls.instance.activate()

      const objectInfo = currentMenuInfo.find((info) => info.id === object.name)
      const currentCase = cart.find((item) => item.objectType === 'case')
      const currentMotherboard = cart.find(
        (item) => item.objectType === 'motherboard',
      )
      const currentCpu = cart.find((item) => item.objectType === 'cpu')
      let position, scale

      switch (objectInfo.objectType) {
        case 'cooler':
          break
        case 'cpu':
          position = currentMotherboard.cpuBB.position
          scale = currentMotherboard.cpuBB.scale
          break
        case 'cpu_cooler':
          position = currentCpu.coolerBB.position
          scale = currentCpu.coolerBB.scale
          break
        case 'gpu':
          position = currentMotherboard.gpuBB.position
          scale = currentMotherboard.gpuBB.scale
          break
        case 'memory':
          break
        case 'motherboard':
          position = currentCase.motherboardBB.position
          scale = currentCase.motherboardBB.scale
          break
        case 'psu':
          position = currentCase.psuBB.position
          scale = currentCase.psuBB.scale
          break
        case 'storage':
          break
      }

      snappingBox.addBoundingBox(position, scale)
    }
  })
}

const onMouseUp = () => {
  window.addEventListener('mouseup', (e) => {
    refreshMouse(pointer, sizes, e)
    raycaster.setFromCamera(pointer, camera.instance)

    let object = getFirstIntersect(raycaster, scene)

    if (object) {
      snappingBox.removeBox()
    }
  })
}

const handleDrag = () => {
  initMenuEvents(
    newModelDraggedIn,
    htmlCanvas,
    htmlCart,
    htmlOverlay,
    htmlCartOpen,
    htmlCartClose,
  )
  htmlCanvas.addEventListener('model-dragged-in', (e) => {
    const chosenObject = currentMenuOptions.find(
      (option) => option.name === e.chosenModel,
    )
    const chosenObjectInfo = currentMenuInfo.find(
      (info) => info.id === e.chosenModel,
    )
    let newPosition = new THREE.Vector3()

    if (chosenObjectInfo.objectType === 'case') {
      if (!centeredCases.includes(chosenObjectInfo.id)) {
        caseMesh = chosenObject
        caseBB = new THREE.Box3().setFromObject(caseMesh)

        const center = caseBB.getCenter(new THREE.Vector3())

        caseMesh.position.sub(center)
        centeredCases.push(chosenObjectInfo.id)
      }

      addToCart(chosenObjectInfo)
      enableConfirmButton(true)
    } else {
      newPosition = convertMouseToVector3(pointer, camera.instance)
      chosenObject.position.set(newPosition.x, newPosition.y, newPosition.z)
      chosenObject.isDraggable = true

      switch (chosenObjectInfo.objectType) {
        case 'cooler':
          break
        case 'cpu':
          cpuMesh = chosenObject
          cpuBB = new THREE.Box3().setFromObject(cpuMesh)
          break
        case 'cpu_cooler':
          cpucoolerMesh = chosenObject
          cpucoolerBB = new THREE.Box3().setFromObject(cpucoolerMesh)
          break
        case 'gpu':
          gpuMesh = chosenObject
          gpuBB = new THREE.Box3().setFromObject(gpuMesh)
          break
        case 'memory':
          break
        case 'motherboard':
          motherboardMesh = chosenObject
          motherboardBB = new THREE.Box3().setFromObject(motherboardMesh)
          break
        case 'psu':
          psuMesh = chosenObject
          psuBB = new THREE.Box3().setFromObject(psuMesh)
          break
        case 'storage':
          break
      }
    }

    scene.add(chosenObject)
    disableDragMenu(htmlMainMenu)
    enableRevertButton(true)
  })
}

const initButtons = () => {
  htmlConfirm.addEventListener('click', () => {
    goForward()
  })
  htmlRevert.addEventListener('click', () => {
    let orphanedChildFound = false

    for (const child of scene.children) {
      if (
        currentMenuInfo.findIndex((option) => option.id === child.name) > -1 &&
        cart.findIndex((item) => item.id === child.name) === -1
      ) {
        console.log('orphan')
        orphanedChildFound = true
      }
    }

    if (!orphanedChildFound) {
      const lastChild = cart[cart.length - 1]

      removeFromCart()

      if (
        cart.length >= 1 &&
        currentstage > 1 &&
        currentMenuInfo[0].objectType !== lastChild.objectType
      ) {
        goBackward()
      }
    } else {
      scene.children.pop()
      enableDragMenu(htmlMainMenu)
    }

    if (cart.length == 0) {
      enableRevertButton(false)

      if (currentstage === 2) {
        goBackward()
      }
    }
  })
}

const enableConfirmButton = (bool) => {
  htmlConfirm.disabled = !bool
}

const enableRevertButton = (bool) => {
  htmlRevert.disabled = !bool
}

const addToCart = (item) => {
  cart.push(item)
  priceTotal += item.price
  wattageTotal = calculatePower(cart)
  htmlPriceHeader.innerHTML = priceTotal.toFixed(2)
  htmlPriceCart.innerHTML = priceTotal.toFixed(2)
  htmlWattage.innerHTML = wattageTotal

  htmlCartItems.innerHTML += `              
  <li id="${item.id}-cart" class="my-8 flex flex-row gap-x-8">
    <img src="../assets/images/${item.imageUrl}"
    class="aspect-square w-20 h-20 bg-black bg-opacity-[0.12] rounded-lg p-1"/>
    <div class="flex flex-row justify-between items-center w-full">
      <div class="flex flex-col justify-between">
        <p class="text-lg font-semibold">${item.name}</p>
        <P class="text-base opacity-50 capitalize">${item.objectType} - ${
    item.manufacturer
  }</P>
      </div>
      <p class="font-semibold text-lg">€ ${item.price.toFixed(2)}</p>
    </div>
  </li>`

  console.log(cart)
  // handleWattage()
}

const removeFromCart = () => {
  const removedItem = cart.pop()
  const element = document.getElementById(`${removedItem.id}-cart`)

  htmlCartItems.removeChild(element)
  scene.children.pop()
  enableDragMenu(htmlMainMenu)

  priceTotal -= removedItem.price
  wattageTotal = calculatePower(cart)
  htmlPriceHeader.innerHTML = priceTotal.toFixed(2)
  htmlPriceCart.innerHTML = priceTotal.toFixed(2)
  htmlWattage.innerHTML = wattageTotal

  console.log(cart)
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
  console.log(stage)
  enableConfirmButton(false)

  switch (stage) {
    case 1:
      const resultCases = await fetchCases()

      loadModels(resultCases.data.cases, cases, casesInfo)
      addMenuItems(htmlMainMenu, casesInfo)
      enableDragMenu(htmlMainMenu)
      currentMenuOptions = cases
      currentMenuInfo = casesInfo
      htmlStage.innerHTML = 'Case'
      break
    case 2:
      const resultMobo = await fetchMotherboards()

      loadModels(resultMobo.data.motherboards, motherboards, motherboardsInfo)
      addMenuItems(htmlMainMenu, motherboardsInfo)
      enableDragMenu(htmlMainMenu)
      currentMenuOptions = motherboards
      currentMenuInfo = motherboardsInfo
      htmlStage.innerHTML = 'Motherboard'
      break
    case 3:
      const resultCpus = await fetchCPUs()

      loadModels(resultCpus.data.cpus, cpus, cpusInfo)
      addMenuItems(htmlMainMenu, cpusInfo)
      enableDragMenu(htmlMainMenu)
      currentMenuOptions = cpus
      currentMenuInfo = cpusInfo
      htmlStage.innerHTML = 'CPU'
      break
    case 4:
      const resultMemory = await fetchMemory()

      loadModels(resultMemory.data.memory, memory, memoryInfo)
      addMenuItems(htmlMainMenu, memoryInfo)
      enableDragMenu(htmlMainMenu)
      currentMenuOptions = memory
      currentMenuInfo = memoryInfo
      htmlStage.innerHTML = 'Memory'
      break
    case 5:
      const resultCpuCoolers = await fetchCPUCoolers()

      loadModels(resultCpuCoolers.data.cpucoolers, cpucoolers, cpucoolersInfo)
      addMenuItems(htmlMainMenu, cpucoolersInfo)
      enableDragMenu(htmlMainMenu)
      currentMenuOptions = cpucoolers
      currentMenuInfo = cpucoolersInfo
      htmlStage.innerHTML = 'CPU Cooler'
      break
    case 6:
      const resultGpus = await fetchGPUs()

      loadModels(resultGpus.data.gpus, gpus, gpusInfo)
      addMenuItems(htmlMainMenu, gpusInfo)
      enableDragMenu(htmlMainMenu)
      currentMenuOptions = gpus
      currentMenuInfo = gpusInfo
      htmlStage.innerHTML = 'GPU'
      break
    case 7:
      const resultStorage = await fetchStorage()

      loadModels(resultStorage.data.storage, storage, storageInfo)
      addMenuItems(htmlMainMenu, storageInfo)
      enableDragMenu(htmlMainMenu)
      currentMenuOptions = storage
      currentMenuInfo = storageInfo
      htmlStage.innerHTML = 'Storage Device'
      break
    case 8:
      const resultCoolers = await fetchCoolers()

      loadModels(resultCoolers.data.coolers, coolers, coolersInfo)
      addMenuItems(htmlMainMenu, coolersInfo)
      enableDragMenu(htmlMainMenu)
      currentMenuOptions = coolers
      currentMenuInfo = coolersInfo
      htmlStage.innerHTML = 'Case Fan'
      break
    case 9:
      const resultPsus = await fetchPSUs()

      loadModels(resultPsus.data.coolers, psus, psusInfo)
      addMenuItems(htmlMainMenu, psusInfo)
      enableDragMenu(htmlMainMenu)
      currentMenuOptions = psus
      currentMenuInfo = psusInfo
      htmlStage.innerHTML = 'PSU'
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

    if (motherboardMesh && motherboardBB) {
      motherboardBB = new THREE.Box3().setFromObject(motherboardMesh)
      checkCollision(motherboardBB, motherboardMesh)
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
    htmlPriceHeader = htmlHeader.querySelector('.gui-header-price')
    htmlWattage = htmlHeader.querySelector('.gui-header-wattage')
    htmlStage = htmlFooter.querySelector('.gui-footer-stage')
    htmlRevert = htmlFooter.querySelector('.gui-footer-revert')
    htmlConfirm = htmlFooter.querySelector('.gui-footer-confirm')
    htmlCart = htmlGUI.querySelector('.gui-cart')
    htmlCartOpen = htmlHeader.querySelector('.gui-header-opencart')
    htmlCartClose = htmlCart.querySelector('.gui-cart-close')
    htmlCartItems = htmlCart.querySelector('.gui-cart-items')
    htmlOverlay = htmlGUI.querySelector('.gui-overlay')
    htmlPriceCart = htmlCart.querySelector('.gui-cart-price')

    // initTest()
    await initScene()
    onScreenChange(sizes, camera, renderer)
    tick()
  })
})()
