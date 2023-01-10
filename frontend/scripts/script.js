import {
  addTestCube,
  addTestGroup,
  addTestTriangle,
  addTestTriangles,
  testAnimation,
  testAnimationGsap,
} from './test'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as lil from 'lil-gui'
import gsap from 'gsap'

// DOM Objects
let htmlCanvas
// Scene components
let Renderer, Camera, Scene, AxesHelper, Clock, Controls
// Objects
let Mesh
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
  Mesh = addTestCube(Scene, Camera)
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

export const init = () => {
  window.addEventListener('DOMContentLoaded', (e) => {
    console.log('DOM loaded!')
    console.log(THREE)
    htmlCanvas = document.querySelector('.webgl')

    getCursor()
    resizeScreen()
    listenForFullscreen()
    loadScene()
    initUI()
    // Animate using gsap
    // testAnimationGsap(Mesh)
    // => animation frames independent of tick
    tick()
  })
}
