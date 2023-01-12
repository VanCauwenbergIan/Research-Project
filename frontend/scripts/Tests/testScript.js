import {
  add3DText,
  addBackdropForModels,
  addTestCube,
  addTestGroup,
  addTestMeshes,
  addTestTriangle,
  addTestTriangles,
  testAnimation,
  testAnimationGsap,
  testAnimationMeshes,
} from './testUtils'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as lil from 'lil-gui'
import gsap from 'gsap'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

// DOM Objects
let htmlCanvas
// Scene components
let Renderer, Camera, Scene, AxesHelper, Clock, Controls, Mixer
// Object meshes
let Mesh, Meshes
// Textures
let DoorColorTexture,
  DoorAlphaTexture,
  DoorHeightTexture,
  DoorNormalTexture,
  DoorAOTexture,
  DoorMetalnessTexture,
  DoorRoughnessTexture,
  MatcapTexture,
  GradientTexture,
  EnvironementMapTexture
// Data
const Sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}
const Cursor = {
  x: 0,
  y: 0,
}
let PreviousTime = 0

const loadScene = () => {
  const aspectRatio = Sizes.width / Sizes.height

  // Create scene
  Scene = new THREE.Scene()

  // Camera
  Camera = new THREE.PerspectiveCamera(55, aspectRatio, 0.1, 100)
  // Camera = new THREE.OrthographicCamera(
  //   -1 * aspectRatio,
  //   1 * aspectRatio,
  //   1,
  //   -1,
  //   0.1,
  //   100,
  // )
  // you have many more cameras like a stereroCamera => keep in mind for VR

  Camera.position.x = 2
  Camera.position.y = 2
  Camera.position.z = 2
  Scene.add(Camera)

  // Controls
  Controls = new OrbitControls(Camera, htmlCanvas)
  Controls.target.x = 0
  Controls.target.y = 0.75
  Controls.target.z = 0
  Controls.enableDamping = true
  // Controls.target.y = 1
  // Controls.update()

  // Test cube(s)
  // Mesh = addTestCube(Scene, Camera, DoorColorTexture)
  // Meshes = addTestMeshes(
  //   Scene,
  //   DoorColorTexture,
  //   DoorAlphaTexture,
  //   MatcapTexture,
  //   GradientTexture,
  //   DoorAOTexture,
  //   DoorHeightTexture,
  //   DoorMetalnessTexture,
  //   DoorRoughnessTexture,
  //   DoorNormalTexture,
  //   EnvironementMapTexture
  // )
  // Mesh = addTestTriangle(Scene)
  // Mesh = addTestTriangles(Scene)
  // addTestGroup(Scene)

  // Axes helper
  AxesHelper = new THREE.AxesHelper()
  Scene.add(AxesHelper)

  // Renderer
  Renderer = new THREE.WebGLRenderer({ canvas: htmlCanvas })
  Renderer.shadowMap.type = THREE.PCFSoftShadowMap
  Renderer.setSize(Sizes.width, Sizes.height)
  Renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  // Clock
  Clock = new THREE.Clock()
}

const getCursor = () => {
  window.addEventListener('mousemove', (e) => {
    Cursor.x = e.clientX / Sizes.width - 0.5
    Cursor.y = -(e.clientY / Sizes.height - 0.5)
  })
}

const resizeScreen = () => {
  window.addEventListener('resize', (e) => {
    Sizes.width = window.innerWidth
    Sizes.height = window.innerWidth

    // Update camera
    Camera.aspect = Sizes.width / Sizes.height
    Camera.updateProjectionMatrix()

    // Update renderer
    Renderer.setSize(Sizes.width, Sizes.height)
    Renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  })
}

const listenForFullscreen = () => {
  window.addEventListener('dblclick', (e) => {
    if (!document.fullscreenElement) {
      htmlCanvas.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  })
}

const initUI = () => {
  const gui = new lil.GUI({ width: 400 })

  gui.hide()

  const params = {
    spin: () => {
      gsap.to(Mesh.rotation, { y: Mesh.rotation.y + 10, duration: 1 })
    },
  }

  // Readd shortcut for debug menu
  window.addEventListener('keydown', (e) => {
    if (e.key === 'h') {
      if (gui._hidden) {
        gui.show()
      } else {
        gui.hide()
      }
    }
  })

  // gui.add(Mesh.position, 'x').min(-3).max(3).step(0.01).name('object distance')
  // gui.add(Mesh.position, 'y').min(-3).max(3).step(0.01).name('object elevation')
  // gui.add(Mesh.position, 'z').min(-3).max(3).step(0.01).name('object depth')
  // gui.add(Mesh, 'visible')
  // gui.add(Mesh.material, 'wireframe')
  // gui.addColor(Mesh.material, 'color')
  // gui.add(params, 'spin')

  // they all share the same material in this case, so changing one will change them all
  //   gui.add(Meshes.sphere.material, 'metalness').min(0).max(1).step(0.0001)
  //   gui.add(Meshes.sphere.material, 'roughness').min(0).max(1).step(0.0001)
  //   gui.add(Meshes.sphere.material, 'aoMapIntensity').min(0).max(10).step(0.0001)
  //   gui
  //     .add(Meshes.sphere.material, 'displacementScale')
  //     .min(0)
  //     .max(1)
  //     .step(0.0001)
}

const loadTextures = () => {
  const image = new Image()
  // Load texture manually
  // Texture = new THREE.Texture(image)

  // image.onload = () => {
  //   Texture.needsUpdate = true
  // }
  // image.src = '../assets/textures/door/color.jpg'
  // Built-in loader
  const loadingManager = new THREE.LoadingManager()

  loadingManager.onStart = () => {
    console.log('start')
  }
  loadingManager.onLoad = () => {
    console.log('loaded')
  }
  loadingManager.onProgress = () => {
    console.log('progress')
  }
  loadingManager.onError = () => {
    console.log('error')
  }

  const textureLoader = new THREE.TextureLoader(loadingManager)
  const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager)

  // Optional callback functions
  // const onLoad = () => {
  //   console.log('loaded')
  // }
  // const onProgress = () => {
  //   console.log('progress')
  // }
  // const onError = () => {
  //   console.log('error')
  // }
  // Can also be handled through a loading manager

  DoorColorTexture = textureLoader.load(
    '../assets/textures/door/color.jpg',
    // onLoad,
    // onProgress,
    // onError,
  )
  DoorAlphaTexture = textureLoader.load('../assets/textures/door/alpha.jpg')
  DoorHeightTexture = textureLoader.load('../assets/textures/door/height.jpg')
  DoorNormalTexture = textureLoader.load('../assets/textures/door/normal.jpg')
  DoorAOTexture = textureLoader.load(
    '../assets/textures/door/ambientOcclusion.jpg',
  )
  DoorMetalnessTexture = textureLoader.load(
    '../assets/textures/door/metalness.jpg',
  )
  DoorRoughnessTexture = textureLoader.load(
    '../assets/textures/door/roughness.jpg',
  )
  MatcapTexture = textureLoader.load('../assets/textures/matcaps/8.png')
  GradientTexture = textureLoader.load('../assets/textures/gradients/5.jpg')
  // you can reuse the same loader for multiple textures

  EnvironementMapTexture = cubeTextureLoader.load([
    '../assets/textures/environmentMaps/3/px.jpg',
    '../assets/textures/environmentMaps/3/nx.jpg',
    '../assets/textures/environmentMaps/3/py.jpg',
    '../assets/textures/environmentMaps/3/ny.jpg',
    '../assets/textures/environmentMaps/3/pz.jpg',
    '../assets/textures/environmentMaps/3/nz.jpg',
  ])

  // ColorTexture.repeat.x = 2
  // ColorTexture.repeat.y = 3
  // By default the last pixel of a texture gets repeated => fix:
  // ColorTexture.wrapS = THREE.MirroredRepeatWrapping
  // ColorTexture.wrapT = THREE.MirroredRepeatWrapping

  // ColorTexture.offset.x = 0.5
  // ColorTexture.offset.y = 0.5
  // ColorTexture.rotation = Math.PI / 4
  // ColorTexture.center.x = 0.5
  // ColorTexture.center.y = 0.5

  DoorColorTexture.generateMipmaps = false
  DoorColorTexture.minFilter = THREE.NearestFilter
  DoorColorTexture.magFilter = THREE.NearestFilter
  // NearestFilter gives better performance + you can disable mipmaps for less vram usage
  // Always consider compressing your textures (especially for distant objects) to decrease loading times
  // A resolution of the power of 2 gives the best results with mitmapping

  GradientTexture.generateMipmaps = false
  GradientTexture.minFilter = THREE.NearestFilter
  GradientTexture.magFilter = THREE.NearestFilter
}

const setupLights = () => {
  // without light you won't be able to see some models
  const ambientLights = new THREE.AmbientLight(0xffffff, 0.8)

  Scene.add(ambientLights)

  // const pointLight = new THREE.PointLight(0xffffff, 0.5)

  // pointLight.position.x = 2
  // pointLight.position.y = 3
  // pointLight.position.z = 4
  // Scene.add(pointLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)

  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.set(1024, 1024)
  directionalLight.shadow.camera.far = 15
  directionalLight.shadow.camera.left = -7
  directionalLight.shadow.camera.top = 7
  directionalLight.shadow.camera.right = 7
  directionalLight.shadow.camera.bottom = -7
  directionalLight.position.x = 5
  directionalLight.position.y = 5
  directionalLight.position.z = 5
  Scene.add(directionalLight)
}

const loadFonts = () => {
  const fontLoader = new FontLoader()

  fontLoader.load(
    '../assets/fonts/helvetiker_regular.typeface.json',
    (font) => {
      Mesh = add3DText(font, Scene, MatcapTexture)
    },
  )
}

const loadModels = () => {
  addBackdropForModels(Scene)

  // every format has a different loader
  const dracoLoader = new DRACOLoader()

  // Draco is a compressed version of gltf that is run in Web Assembly
  dracoLoader.setDecoderPath('../libs/draco/')
  // But not always a win-win since you need to load the class and decoder...

  const gltfLoader = new GLTFLoader()

  // provide the draco loader to the gltf loader
  gltfLoader.setDRACOLoader(dracoLoader)
  // const onLoad = () => {
  //   console.log('loaded')
  // }
  // const onProgress = () => {
  //   console.log('progress')
  // }
  // const onError = () => {
  //   console.log('error')
  // }

  gltfLoader.load('../assets/models/Donut/donut.glb', (gltf) => {
    // Activating model animations
    // Mixer = new THREE.AnimationMixer(gltf.scene)
    // const action = Mixer.clipAction(gltf.animations[2])

    // action.play()
    // also needs an update each frame => tick

    // console.log(gltf)
    // There are multiple ways of adding a third party model depending on the specific file format (gltf, glb, gltf embedded, ...)
    // 1) Add the whole scene inside our scene
    // gltf.scene.scale.set(0.025, 0.025, 0.025)
    // If you don't see a model or error it's likely so big that you're inside of it
    Scene.add(gltf.scene)
    // 2) Add only the childeren to the scene
    // Scene.add(gltf.scene.children[0])
    // only works when there's only one child however...
    // while (gltf.scene.children.length > 0) {
    //   Scene.add(gltf.scene.children[0])
    // }
    // OR
    // const childeren = [...gltf.scene.children]
    // for (const child of childeren) {
    //   Scene.add(child)
    // }
    // every time you add a child to your scene it gets automatically removed from the model's scene
    // 3) Add only the mesh => wrong scale, position, rotation, ...
    // 4) Open the model in 3d software and clean it
  })
}

const tick = () => {
  // Update objects manually
  // testAnimation(Camera, Clock, Mesh)
  // testAnimationMeshes(Clock, Meshes)

  // Update mixer
  // const elapsedTime = Clock.getElapsedTime()
  // const deltaTime = elapsedTime - PreviousTime

  // PreviousTime = elapsedTime

  // if (Mixer) {
  //   Mixer.update(deltaTime)
  // }

  // Update camera
  // Custom controls
  // Camera.position.x = Math.sin(Cursor.x * Math.PI * 2) * 3
  // Camera.position.y = Cursor.y * 5
  // Camera.position.z = Math.cos(Cursor.x * Math.PI * 2) * 3
  // Camera.lookAt(Mesh.position)
  // Built-in controls
  Controls.update()

  //Render
  Renderer.render(Scene, Camera)

  window.requestAnimationFrame(tick)
}

export const initTest = () => {
  window.addEventListener('DOMContentLoaded', (e) => {
    console.log('DOM loaded!')
    console.log(THREE)
    htmlCanvas = document.querySelector('.webgl')

    getCursor()
    resizeScreen()
    listenForFullscreen()
    loadTextures()
    loadScene()
    setupLights()
    loadModels()
    // loadFonts()
    initUI()
    // Animate using gsap
    // testAnimationGsap(Mesh)
    // => animation frames independent of tick
    tick()
  })
}
