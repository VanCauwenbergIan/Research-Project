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
  // enableDragMenu,
  // disableDragMenu,
  refreshMouse,
  getFirstIntersect,
  calculatePower,
  lookForOrphans,
  enableMenu,
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
  coolersMeshes = [],
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
let motherboardCentered, cpuCentered
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
  coolersBB = [],
  psuBB
// Events
const newModelDraggedIn = new Event('model-dragged-in')
const newModelClicked = new Event('model-clicked')
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

  renderer.setAnimationLoop(() => {
    tick()
  })

  // addHelpers(scene)
  loadCamera()
  loadLights()
  loadControls()
  loadRaycaster()

  initButtons()
  handleClick()
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
          if (component.objectType !== 'case') {
            result.isDraggable = true
          }

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
  dragControls = new DragControls(camera.instance, htmlCanvas)
  scene.add(dragControls.instance)

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
    const modelInfo = currentMenuInfo.find((info) => info.id === model.name)
    const max = bb1.max
    const min = bb1.min
    const sizeModel = bb2.getSize(new THREE.Vector3())
    const currentCase = cart.find((item) => item.objectType === 'case')

    dragControls.instance.detach(model)
    model.isDraggable = false
    snappingBox.removeBox()

    if (modelInfo && !cart.includes(modelInfo)) {
      addToCart(modelInfo)
    } else if (modelInfo) {
      let inCart = cart.filter((item) => item.id === modelInfo.id)

      switch (modelInfo.objectType) {
        case 'memory':
          if (inCart.length < memoryMeshes.length) {
            increaseCountCart(modelInfo)
          }
          break
        case 'cooler':
          if (inCart.length < coolersMeshes.length) {
            increaseCountCart(modelInfo)
          }
          break
        case 'storage':
          if (inCart.length < storageMeshes.length) {
            increaseCountCart(modelInfo)
          }
          break
      }
    }

    if (modelInfo && modelInfo.objectType === 'cooler') {
      const size = snappingBox.boundingBox.getSize(new THREE.Vector3())

      if (size.x > size.y) {
        model.rotation.set(Math.PI / 2, 0, 0)
      } else {
        model.rotation.set(0, Math.PI / 2, 0)
      }
    }

    if (
      modelInfo.objectType === 'motherboard' &&
      currentCase.supportedMotherboardFormats.includes('atx')
    ) {
      // snap to top left back
      model.position.set(
        min.x + sizeModel.x / 2,
        max.y - sizeModel.y / 2,
        min.z + sizeModel.z / 2,
      )
    } else if (modelInfo.objectType === 'gpu') {
      model.position.set(
        min.x + sizeModel.x / 2,
        max.y - sizeModel.y / 2,
        min.z + sizeModel.z / 2,
      )
    } else {
      // default snap center
      model.position.set(center.x, center.y, center.z)
    }

    window.addEventListener('pointerup', () => {
      orbitControls.instance.enabled = true
      window.removeEventListener('pointerup', this)
    })
  }
}

const onMouseDown = () => {
  window.addEventListener('pointerdown', (e) => {
    refreshMouse(pointer, sizes, e)
    raycaster.setFromCamera(pointer, camera.instance)

    let object = getFirstIntersect(raycaster, scene)

    if (object && object.isDraggable) {
      dragControls.instance.attach(object)

      const objectInfo = currentMenuInfo.find((info) => info.id === object.name)
      const currentCase = cart.find((item) => item.objectType === 'case')
      const currentMotherboard = cart.find(
        (item) => item.objectType === 'motherboard',
      )
      const currentCpu = cart.find((item) => item.objectType === 'cpu')
      let position, scale

      switch (objectInfo.objectType) {
        case 'cooler':
          const coolersInCart = cart.filter(
            (item) => item.objectType === 'cooler',
          )
          const coolersBB = currentCase.fansBB
          const currentCoolerBB = coolersBB[coolersInCart.length]

          position = currentCoolerBB.position
          scale = currentCoolerBB.scale
          snappingBox.addBoundingBox(position, scale)
          break
        case 'cpu':
          position = new THREE.Vector3(
            currentMotherboard.cpuBB.position.x,
            currentMotherboard.cpuBB.position.y,
            currentMotherboard.cpuBB.position.z,
          )
          scale = currentMotherboard.cpuBB.scale
          snappingBox.addBoundingBox(position, scale, motherboardCentered)
          break
        case 'cpu_cooler':
          position = new THREE.Vector3(
            currentCpu.coolerBB.position.x,
            currentCpu.coolerBB.position.y,
            currentCpu.coolerBB.position.z,
          )
          scale = currentCpu.coolerBB.scale
          snappingBox.addBoundingBox(position, scale, cpuCentered)
          break
        case 'gpu':
          position = new THREE.Vector3(
            currentMotherboard.gpuBB.position.x,
            currentMotherboard.gpuBB.position.y,
            currentMotherboard.gpuBB.position.z,
          )
          scale = currentMotherboard.gpuBB.scale
          snappingBox.addBoundingBox(position, scale, motherboardCentered)
          break
        case 'memory':
          const memoryBB = []
          const memoryInCart = cart.filter(
            (item) => item.objectType === 'memory',
          )

          for (const bb of currentMotherboard.ramBB) {
            memoryBB.push({
              position: new THREE.Vector3(
                bb.position.x,
                bb.position.y,
                bb.position.z,
              ),
              scale: new THREE.Vector3(bb.scale.x, bb.scale.y, bb.scale.z),
            })
          }

          const currentMemoryBB = memoryBB[memoryInCart.length]

          position = currentMemoryBB.position
          scale = currentMemoryBB.scale
          snappingBox.addBoundingBox(position, scale, motherboardCentered)
          break
        case 'motherboard':
          position = currentCase.motherboardBB.position
          scale = currentCase.motherboardBB.scale
          snappingBox.addBoundingBox(position, scale)
          break
        case 'psu':
          position = currentCase.psuBB.position
          scale = currentCase.psuBB.scale
          snappingBox.addBoundingBox(position, scale)
          break
        case 'storage':
          const storageInCart = cart.filter(
            (item) => item.objectType === 'storage',
          )
          const storageBB = currentCase.drivesBB
          const currentStorageBB = storageBB[storageInCart.length]

          position = currentStorageBB.position
          scale = currentStorageBB.scale
          snappingBox.addBoundingBox(position, scale)
          break
      }
    }
  })
}

const onMouseUp = () => {
  window.addEventListener('pointerup', (e) => {
    refreshMouse(pointer, sizes, e)
    raycaster.setFromCamera(pointer, camera.instance)

    let object = getFirstIntersect(raycaster, scene)

    if (object) {
      snappingBox.removeBox()
    }
  })
}
const handleClick = () => {
  initMenuEvents(
    newModelDraggedIn,
    htmlCanvas,
    htmlCart,
    htmlOverlay,
    htmlCartOpen,
    htmlCartClose,
  )
  htmlCanvas.addEventListener('model-clicked', (e) => {
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

      scene.add(chosenObject)
      addToCart(chosenObjectInfo)
      enableConfirmButton(true)
    } else {
      if (chosenObjectInfo.objectType === 'motherboard') {
      } else if (chosenObjectInfo.objectType === 'cpu') {
      }

      newPosition = convertMouseToVector3(pointer, camera.instance)

      const currentMotherboard = cart.find(
        (item) => item.objectType === 'motherboard',
      )
      const currentCase = cart.find((item) => item.objectType === 'case')

      switch (chosenObjectInfo.objectType) {
        case 'cooler':
          if (currentCase.fansBB.length > coolersMeshes.length) {
            const existingModel = scene.getObjectByName(chosenObjectInfo.id)
            let copy

            if (!existingModel) {
              copy = chosenObject
            } else {
              copy = existingModel.clone()
            }

            copy.position.set(newPosition.x, newPosition.y, newPosition.z)
            copy.isDraggable = true
            coolersMeshes.push(copy)
            coolersBB.push(new THREE.Box3().setFromObject(copy))
            scene.add(copy)
          }
          break
        case 'cpu':
          const centerCPU = new THREE.Box3()
            .setFromObject(chosenObject)
            .getCenter(new THREE.Vector3())
          cpuCentered = chosenObject.position.sub(centerCPU)

          chosenObject.position.set(newPosition.x, newPosition.y, newPosition.z)
          chosenObject.isDraggable = true
          cpuMesh = chosenObject
          cpuBB = new THREE.Box3().setFromObject(cpuMesh)
          scene.add(chosenObject)
          break
        case 'cpu_cooler':
          chosenObject.position.set(newPosition.x, newPosition.y, newPosition.z)
          chosenObject.isDraggable = true
          cpucoolerMesh = chosenObject
          cpucoolerBB = new THREE.Box3().setFromObject(cpucoolerMesh)
          scene.add(chosenObject)
          break
        case 'gpu':
          chosenObject.position.set(newPosition.x, newPosition.y, newPosition.z)
          chosenObject.isDraggable = true
          gpuMesh = chosenObject
          gpuBB = new THREE.Box3().setFromObject(gpuMesh)
          scene.add(chosenObject)
          break
        case 'memory':
          if (currentMotherboard.memorySlots > memoryMeshes.length) {
            const existingModel = scene.getObjectByName(chosenObjectInfo.id)
            let copy

            if (!existingModel) {
              copy = chosenObject
            } else {
              copy = existingModel.clone()
            }

            copy.position.set(newPosition.x, newPosition.y, newPosition.z)
            copy.isDraggable = true
            memoryMeshes.push(copy)
            memoryBB.push(new THREE.Box3().setFromObject(copy))
            scene.add(copy)
          }
          break
        case 'motherboard':
          const centerMobo = new THREE.Box3()
            .setFromObject(chosenObject)
            .getCenter(new THREE.Vector3())
          motherboardCentered = chosenObject.position.sub(centerMobo)

          chosenObject.position.set(newPosition.x, newPosition.y, newPosition.z)
          chosenObject.isDraggable = true
          motherboardMesh = chosenObject
          motherboardBB = new THREE.Box3().setFromObject(motherboardMesh)
          scene.add(chosenObject)
          break
        case 'psu':
          chosenObject.position.set(newPosition.x, newPosition.y, newPosition.z)
          chosenObject.isDraggable = true
          psuMesh = chosenObject
          psuBB = new THREE.Box3().setFromObject(psuMesh)
          scene.add(chosenObject)
          break
        case 'storage':
          if (currentCase.drivesBB.length > storageMeshes.length) {
            const existingModel = scene.getObjectByName(chosenObjectInfo.id)
            let copy

            if (!existingModel) {
              copy = chosenObject
            } else {
              copy = existingModel.clone()
            }

            copy.position.set(newPosition.x, newPosition.y, newPosition.z)
            copy.isDraggable = true
            storageMeshes.push(copy)
            storageBB.push(new THREE.Box3().setFromObject(copy))
            scene.add(copy)
          }
          break
      }
    }

    // disableDragMenu(htmlMainMenu)
    enableMenu(htmlMainMenu, false)
    enableRevertButton(true)
  })
}

const initButtons = () => {
  htmlConfirm.addEventListener('click', () => {
    goForward()
  })
  htmlRevert.addEventListener('click', () => {
    let orphanedChildFound = lookForOrphans(scene, currentMenuInfo, cart)

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
      // enableDragMenu(htmlMainMenu)
      enableMenu(htmlMainMenu, true)

      switch (currentstage) {
        case 4:
          memoryMeshes.pop()
          memoryBB.pop()
          break
        case 7:
          storageMeshes.pop()
          storageBB.pop()
          break
        case 8:
          coolersMeshes.pop()
          coolersBB.pop()
          break
      }
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
  <li id="${item.id}-cart" class="gui-cart-item my-8 flex flex-row gap-x-8">
    <img src="../assets/images/${item.imageUrl}"
    class="aspect-square w-20 h-20 bg-black bg-opacity-[0.12] rounded-lg p-1"/>
    <div class="flex flex-row justify-between items-center w-full">
      <div class="flex flex-col justify-between">
        <p class="gui-cart-item-count text-lg font-semibold">x1 ${item.name}</p>
        <P class="text-base opacity-50">${item.objectType} - ${
    item.manufacturer
  }</P>
      </div>
      <p class="font-semibold text-lg gui-cart-item-price">€ ${item.price.toFixed(
        2,
      )}</p>
    </div>
  </li>`

  console.log(cart)
  enableConfirmButton(true)
  // reinit drag controls to prevent jumping after snap
  // dragControls.instance.dispose()
  // dragControls = new DragControls(
  //   currentlyDraggable,
  //   camera.instance,
  //   htmlCanvas,
  // )
  // onDrag(orbitControls.instance, dragControls.instance)

  const currentMotherboard = cart.find(
    (item) => item.objectType === 'motherboard',
  )
  const currentCase = cart.find((item) => item.objectType === 'case')

  switch (item.objectType) {
    case 'memory':
      if (currentMotherboard.memorySlots > memoryMeshes.length) {
        // enableDragMenu(htmlMainMenu)
        enableMenu(htmlMainMenu, true)
      }
      break
    case 'cooler':
      if (currentCase.fansBB.length > coolersMeshes.length) {
        // enableDragMenu(htmlMainMenu)
        enableMenu(htmlMainMenu, true)
      }
      break
    case 'storage':
      if (currentCase.drivesBB.length > storageMeshes.length) {
        // enableDragMenu(htmlMainMenu)
        enableMenu(htmlMainMenu, true)
      }
      break
  }
}

const increaseCountCart = (item) => {
  const element = document.getElementById(`${item.id}-cart`)
  let countElement = element.querySelector('.gui-cart-item-count')
  let priceElement = element.querySelector('.gui-cart-item-price')
  let count = countElement.innerHTML[1]

  count++
  cart.push(item)
  countElement.innerHTML = `x${count}` + countElement.innerHTML.slice(2)
  priceElement.innerHTML = `€ ${(count * item.price).toFixed(2)}`
  priceTotal += item.price
  wattageTotal = calculatePower(cart)
  htmlPriceHeader.innerHTML = priceTotal.toFixed(2)
  htmlPriceCart.innerHTML = priceTotal.toFixed(2)
  htmlWattage.innerHTML = wattageTotal
  enableConfirmButton(true)
  // reinit drag controls to prevent jumping after snap
  // dragControls.instance.dispose()
  // dragControls = new DragControls(
  //   currentlyDraggable,
  //   camera.instance,
  //   htmlCanvas,
  // )
  // onDrag(orbitControls.instance, dragControls.instance)

  const currentMotherboard = cart.find(
    (item) => item.objectType === 'motherboard',
  )
  const currentCase = cart.find((item) => item.objectType === 'case')

  switch (item.objectType) {
    case 'memory':
      if (currentMotherboard.memorySlots > memoryMeshes.length) {
        // enableDragMenu(htmlMainMenu)
        enableMenu(htmlMainMenu, true)
      }
      break
    case 'cooler':
      if (currentCase.fansBB.length > coolersMeshes.length) {
        // enableDragMenu(htmlMainMenu)
        enableMenu(htmlMainMenu, true)
      }
      break
    case 'storage':
      if (currentCase.drivesBB.length > storageMeshes.length) {
        // enableDragMenu(htmlMainMenu)
        enableMenu(htmlMainMenu, true)
      }
      break
  }
}

const removeFromCart = () => {
  const removedItem = cart.pop()
  const element = document.getElementById(`${removedItem.id}-cart`)
  let countElement = element.querySelector('.gui-cart-item-count')
  let priceElement = element.querySelector('.gui-cart-item-price')
  let count = countElement.innerHTML[1]

  if (count > 1) {
    count--
    countElement.innerHTML = `x${count}` + countElement.innerHTML.slice(2)
    priceElement.innerHTML = `€ ${(count * removedItem.price).toFixed(2)}`
  } else {
    htmlCartItems.removeChild(element)
  }

  scene.children.pop()
  enableConfirmButton(false)
  // enableDragMenu(htmlMainMenu)
  enableMenu(htmlMainMenu, true)

  priceTotal -= removedItem.price
  wattageTotal = calculatePower(cart)
  htmlPriceHeader.innerHTML = priceTotal.toFixed(2)
  htmlPriceCart.innerHTML = priceTotal.toFixed(2)
  htmlWattage.innerHTML = wattageTotal

  switch (removedItem.objectType) {
    case 'memory':
    case 'cooler':
    case 'storage':
      if (
        cart.filter((item) => item.objectType === removedItem.objectType)
          .length >= 1
      ) {
        enableConfirmButton(true)
      }
    case 'memory':
      memoryMeshes.pop()
      memoryBB.pop()
      break
    case 'cooler':
      coolersMeshes.pop()
      coolersBB.pop()
      break
    case 'storage':
      storageMeshes.pop()
      storageBB.pop()
      break
  }

  console.log(cart)
}

const goForward = () => {
  const orphanFound = lookForOrphans(scene, currentMenuInfo, cart)

  if (orphanFound) {
    scene.children.pop()
    // enableDragMenu(htmlMainMenu)
    enableMenu(htmlMainMenu, true)

    switch (currentstage) {
      case 4:
        memoryMeshes.pop()
        memoryBB.pop()
        break
      case 7:
        storageMeshes.pop()
        storageBB.pop()
        break
      case 8:
        coolersMeshes.pop()
        coolersBB.pop()
        break
    }
  }

  if (currentstage !== 9) {
    currentstage += 1
    handleStages(currentstage)
  } else {
    htmlCart.classList.remove('hidden')
    htmlOverlay.classList.remove('hidden')
    htmlCart.classList.add('flex')
    htmlOverlay.classList.add('flex')
  }
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
      addMenuItems(htmlMainMenu, casesInfo, cart, newModelClicked, htmlCanvas)
      // enableDragMenu(htmlMainMenu)
      enableMenu(htmlMainMenu, true)
      currentMenuOptions = cases
      currentMenuInfo = casesInfo
      htmlStage.innerHTML = 'Case'
      break
    case 2:
      const resultMobo = await fetchMotherboards()

      loadModels(resultMobo.data.motherboards, motherboards, motherboardsInfo)
      addMenuItems(
        htmlMainMenu,
        motherboardsInfo,
        cart,
        newModelClicked,
        htmlCanvas,
      )
      // enableDragMenu(htmlMainMenu)
      enableMenu(htmlMainMenu, true)
      currentMenuOptions = motherboards
      currentMenuInfo = motherboardsInfo
      htmlStage.innerHTML = 'Motherboard'
      break
    case 3:
      const resultCpus = await fetchCPUs()

      loadModels(resultCpus.data.cpus, cpus, cpusInfo)
      addMenuItems(htmlMainMenu, cpusInfo, cart, newModelClicked, htmlCanvas)
      // enableDragMenu(htmlMainMenu)
      enableMenu(htmlMainMenu, true)
      currentMenuOptions = cpus
      currentMenuInfo = cpusInfo
      htmlStage.innerHTML = 'CPU'
      break
    case 4:
      const resultMemory = await fetchMemory()

      loadModels(resultMemory.data.memory, memory, memoryInfo)
      addMenuItems(htmlMainMenu, memoryInfo, cart, newModelClicked, htmlCanvas)
      // enableDragMenu(htmlMainMenu)
      enableMenu(htmlMainMenu, true)
      currentMenuOptions = memory
      currentMenuInfo = memoryInfo
      htmlStage.innerHTML = 'Memory'
      break
    case 5:
      const resultCpuCoolers = await fetchCPUCoolers()

      loadModels(resultCpuCoolers.data.cpucoolers, cpucoolers, cpucoolersInfo)
      addMenuItems(
        htmlMainMenu,
        cpucoolersInfo,
        cart,
        newModelClicked,
        htmlCanvas,
      )
      // enableDragMenu(htmlMainMenu)
      enableMenu(htmlMainMenu, true)
      currentMenuOptions = cpucoolers
      currentMenuInfo = cpucoolersInfo
      htmlStage.innerHTML = 'CPU Cooler'
      break
    case 6:
      const resultGpus = await fetchGPUs()

      loadModels(resultGpus.data.gpus, gpus, gpusInfo)
      addMenuItems(htmlMainMenu, gpusInfo, cart, newModelClicked, htmlCanvas)
      // enableDragMenu(htmlMainMenu)
      enableMenu(htmlMainMenu, true)
      currentMenuOptions = gpus
      currentMenuInfo = gpusInfo
      htmlStage.innerHTML = 'GPU'
      break
    case 7:
      const resultStorage = await fetchStorage()

      loadModels(resultStorage.data.storage, storage, storageInfo)
      addMenuItems(htmlMainMenu, storageInfo, cart, newModelClicked, htmlCanvas)
      // enableDragMenu(htmlMainMenu)
      enableMenu(htmlMainMenu, true)
      storageMeshes = []
      storageBB = []
      currentMenuOptions = storage
      currentMenuInfo = storageInfo
      htmlStage.innerHTML = 'Storage Device'
      break
    case 8:
      const resultCoolers = await fetchCoolers()

      loadModels(resultCoolers.data.coolers, coolers, coolersInfo)
      addMenuItems(htmlMainMenu, coolersInfo, cart, newModelClicked, htmlCanvas)
      // enableDragMenu(htmlMainMenu)
      enableMenu(htmlMainMenu, true)
      coolersMeshes = []
      coolersBB = []
      currentMenuOptions = coolers
      currentMenuInfo = coolersInfo
      htmlStage.innerHTML = 'Case Fan'
      break
    case 9:
      const resultPsus = await fetchPSUs()

      loadModels(resultPsus.data.psus, psus, psusInfo)
      addMenuItems(htmlMainMenu, psusInfo, cart, newModelClicked, htmlCanvas)
      // enableDragMenu(htmlMainMenu)
      enableMenu(htmlMainMenu, true)
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
  // window.requestAnimationFrame(tick)
}

const updateBoundingBoxes = () => {
  if (snappingBox) {
    snappingBox.updateBoundingBox()

    if (motherboardMesh && currentstage === 2) {
      motherboardBB = new THREE.Box3().setFromObject(motherboardMesh)
      checkCollision(motherboardBB, motherboardMesh)
    } else if (cpuMesh && currentstage === 3) {
      cpuBB = new THREE.Box3().setFromObject(cpuMesh)
      checkCollision(cpuBB, cpuMesh)
    } else if (memoryMeshes.length >= 1 && currentstage === 4) {
      const memoryInCart = cart.filter((item) => item.objectType === 'memory')
      const index = memoryInCart.length

      if (memoryMeshes.length > index) {
        memoryBB[index] = new THREE.Box3().setFromObject(memoryMeshes[index])
        checkCollision(memoryBB[index], memoryMeshes[index])
      }
    } else if (cpucoolerMesh && currentstage === 5) {
      cpucoolerBB = new THREE.Box3().setFromObject(cpucoolerMesh)
      checkCollision(cpucoolerBB, cpucoolerMesh)
    } else if (gpuMesh && gpuBB && currentstage === 6) {
      gpuBB = new THREE.Box3().setFromObject(gpuMesh)
      checkCollision(gpuBB, gpuMesh)
    } else if (storageMeshes.length >= 1 && currentstage === 7) {
      const storageInCart = cart.filter((item) => item.objectType === 'storage')
      const index = storageInCart.length

      if (storageMeshes.length > index) {
        storageBB[index] = new THREE.Box3().setFromObject(storageMeshes[index])
        checkCollision(storageBB[index], storageMeshes[index])
      }
    } else if (coolersMeshes.length >= 1 && currentstage === 8) {
      const coolersInCart = cart.filter((item) => item.objectType === 'cooler')
      const index = coolersInCart.length

      if (coolersMeshes.length > index) {
        coolersBB[index] = new THREE.Box3().setFromObject(coolersMeshes[index])
        checkCollision(coolersBB[index], coolersMeshes[index])
      }
    } else if (psuMesh && currentstage === 9) {
      psuBB = new THREE.Box3().setFromObject(psuMesh)
      checkCollision(psuBB, psuMesh)
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
  })
})()
