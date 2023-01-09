let htmlCanvas

const loadScene = () => {
  // Variables
  const sizes = {
    width: 800,
    height: 600,
  }

  // Create scene
  const scene = new THREE.Scene()

  // Test cube
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshBasicMaterial({ color: 'red' })
  const mesh = new THREE.Mesh(geometry, material)

  scene.add(mesh)

  // Camera
  const camera = new THREE.PerspectiveCamera(55, sizes.width / sizes.height)

  camera.position.z = 3
  scene.add(camera)

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
