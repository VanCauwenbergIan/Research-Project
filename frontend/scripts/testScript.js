import {
  addTestCube,
  addTestGroup,
  addTestTriangle,
  addTestTriangles,
  testAnimation,
  testAnimationGsap,
} from './testUtils'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as lil from 'lil-gui'
import gsap from 'gsap'

// DOM Objects
let htmlCanvas
// Scene components
let Renderer, Camera, Scene, AxesHelper, Clock, Controls
// Object meshes
let Mesh
// Textures
let ColorTexture,
  AlphaTexture,
  HeightTexture,
  NormalTexture,
  AOTexture,
  MetalnessTexture,
  RoughnessTexture
// Data
const Sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}
const Cursor = {
  x: 0,
  y: 0,
}

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

  // Camera.position.x = 2
  // Camera.position.y = 2
  Camera.position.z = 2
  Scene.add(Camera)

  // Controls
  Controls = new OrbitControls(Camera, htmlCanvas)
  Controls.enableDamping = true
  // Controls.target.y = 1
  // Controls.update()

  // Test cube(s)
  Mesh = addTestCube(Scene, Camera, ColorTexture)
  // Mesh = addTestTriangle(Scene)
  // Mesh = addTestTriangles(Scene)
  // addTestGroup(scene)

  // Axes helper
  AxesHelper = new THREE.AxesHelper()
  Scene.add(AxesHelper)

  // Renderer
  Renderer = new THREE.WebGLRenderer({ canvas: htmlCanvas })
  Renderer.setSize(Sizes.width, Sizes.height)

  // Clock
  Clock = new THREE.Clock()
}

const tick = () => {
  // Update objects manually
  // testAnimation(Camera, Clock, Mesh)

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

  gui.add(Mesh.position, 'x').min(-3).max(3).step(0.01).name('object distance')
  gui.add(Mesh.position, 'y').min(-3).max(3).step(0.01).name('object elevation')
  gui.add(Mesh.position, 'z').min(-3).max(3).step(0.01).name('object depth')
  gui.add(Mesh, 'visible')
  gui.add(Mesh.material, 'wireframe')
  gui.addColor(Mesh.material, 'color')
  gui.add(params, 'spin')
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

  ColorTexture = textureLoader.load(
    '../assets/textures/minecraft.png',
    // onLoad,
    // onProgress,
    // onError,
  )
  AlphaTexture = textureLoader.load('../assets/textures/door/alpha.jpg')
  HeightTexture = textureLoader.load('../assets/textures/door/height.jpg')
  NormalTexture = textureLoader.load('../assets/textures/door/normal.jpg')
  AOTexture = textureLoader.load('../assets/textures/door/ambientOcclusion.jpg')
  MetalnessTexture = textureLoader.load('../assets/textures/door/metalness.jpg')
  RoughnessTexture = textureLoader.load('../assets/textures/door/roughness.jpg')
  // you can reuse the same loader for multiple textures

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

  ColorTexture.generateMipmaps = false
  ColorTexture.minFilter = THREE.NearestFilter
  ColorTexture.magFilter = THREE.NearestFilter
  // NearestFilter gives better performance
  // Always consider compressing your textures (especially for distant objects) to decrease loading times
  // A resolution of the power of 2 gives the best results with mitmapping
}

export const init = () => {
  window.addEventListener('DOMContentLoaded', (e) => {
    console.log('DOM loaded!')
    console.log(THREE)
    htmlCanvas = document.querySelector('.webgl')

    getCursor()
    resizeScreen()
    listenForFullscreen()
    loadTextures()
    loadScene()
    initUI()
    // Animate using gsap
    // testAnimationGsap(Mesh)
    // => animation frames independent of tick
    tick()
  })
}
