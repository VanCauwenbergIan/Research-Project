import * as THREE from 'three'
import gsap from 'gsap'

export const addTestCube = (scene, camera) => {
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshBasicMaterial({ color: 'red' })
  const mesh = new THREE.Mesh(geometry, material)

  // mesh.position.x = 0.7
  // mesh.position.y = -0.6
  // mesh.position.z = 1
  // mesh.position.set(0.7, -0.6, 1)

  // mesh.scale.x = 2
  // mesh.scale.y = 0.5
  // mesh.scale.z = 0.5
  // mesh.scale.set(2, 0.5, 0.5)

  // mesh.rotation.reorder('YXZ')
  // mesh.rotation.x = Math.PI / 4
  // mesh.rotation.y = Math.PI / 4
  // pi == half a unit
  // axes reorder can help you when you don't want certian rotations to "stack"

  scene.add(mesh)

  // mesh.position.normalize()
  // console.log(mesh.position.length())
  // console.log(mesh.position.distanceTo(camera.position))

  // camera.lookAt(mesh.position)
  return mesh
}

export const addTestGroup = (scene) => {
  const group = new THREE.Group()

  const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 'red' }),
  )
  const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 'green' }),
  )
  const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 'blue' }),
  )

  cube2.position.x = -2
  cube3.position.x = 2

  group.add(cube1)
  group.add(cube2)
  group.add(cube3)

  // group.position.y = 1
  // group.scale.y = 2
  // group.rotation.y = 1

  scene.add(group)

  return group
}

export const testAnimation = (camera, clock, mesh) => {
  // Clock
  console.log(clock)
  const elapsedTime = clock.getElapsedTime()
  // => Speed is otherwise dependant on FPS
  // you can use PI or other math functions (like sin or cos) to create an animation based on the incrementation

  // Update objects
  mesh.position.x = Math.cos(elapsedTime)
  mesh.position.y = Math.sin(elapsedTime)

  // camera.lookAt(mesh.position)
}

export const testAnimationGsap = (mesh) => {
  gsap.to(mesh.position, { x: 2, duration: 1, delay: 1})
  gsap.to(mesh.position, { x: 0, duration: 1, delay: 2})
}
