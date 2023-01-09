import { addTestCube } from './test'

let htmlCanvas

const loadScene = () => {
  // Variables
  const sizes = {
    width: 800,
    height: 600,
  }

  // Create scene
  const scene = new THREE.Scene()

  // Camera
  const camera = new THREE.PerspectiveCamera(55, sizes.width / sizes.height)

  // camera.position.x = 1
  // camera.position.y = 1
  camera.position.z = 3
  scene.add(camera)

  // Test cube
  addTestCube(scene, camera)

  // Axes helper
  const axesHelper = new THREE.AxesHelper()

  scene.add(axesHelper)

  // Renderer
  const renderer = new THREE.WebGLRenderer({ canvas: htmlCanvas })

  renderer.setSize(sizes.width, sizes.height)
  renderer.render(scene, camera)
}

export const init = () => {
  window.addEventListener('DOMContentLoaded', (e) => {
    console.log('DOM loaded!')
    console.log(THREE)
    htmlCanvas = document.querySelector('.webgl')

    loadScene()
  })
}
