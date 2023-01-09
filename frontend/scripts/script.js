import {
  addTestCube,
  addTestGroup,
  testAnimation,
  testAnimationGsap,
} from './test'
import * as THREE from 'three'

// DOM Objects
let htmlCanvas
// Scene components
let Renderer, Camera, Scene, AxesHelper, Clock
// Objects
let Mesh

const loadScene = () => {
  // Variables
  const sizes = {
    width: 800,
    height: 600,
  }

  // Create scene
  Scene = new THREE.Scene()

  // Camera
  Camera = new THREE.PerspectiveCamera(55, sizes.width / sizes.height)

  // camera.position.x = 1
  // camera.position.y = 1
  Camera.position.z = 3
  Scene.add(Camera)

  // Test cube(s)
  Mesh = addTestCube(Scene, Camera)
  // addTestGroup(scene)

  // Axes helper
  AxesHelper = new THREE.AxesHelper()

  Scene.add(AxesHelper)

  // Renderer
  Renderer = new THREE.WebGLRenderer({ canvas: htmlCanvas })

  Renderer.setSize(sizes.width, sizes.height)

  // Clock
  Clock = new THREE.Clock()
}

const tick = () => {
  // Update objects manually
  // testAnimation(Camera, Clock, Mesh)

  //Render
  Renderer.render(Scene, Camera)

  window.requestAnimationFrame(tick)
}

export const init = () => {
  window.addEventListener('DOMContentLoaded', (e) => {
    console.log('DOM loaded!')
    console.log(THREE)
    htmlCanvas = document.querySelector('.webgl')

    loadScene()
    // Animate using gsap
    testAnimationGsap(Mesh)
    // => animation frames independent of tick
    tick()
  })
}
