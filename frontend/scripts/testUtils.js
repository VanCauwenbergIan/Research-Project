import * as THREE from 'three'
import gsap from 'gsap'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'

export const addTestCube = (scene, camera, texture) => {
  const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)
  // console.log(geometry.attributes.uv)

  const material = new THREE.MeshBasicMaterial({
    // color: 'red',
    // wireframe: true,
    // map: texture,
  })
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

  camera.lookAt(mesh.position)
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

export const addTestTriangle = (scene) => {
  const positionsArray = new Float32Array([0, 0, 0, 0, 1, 0, 1, 0, 0])
  const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)
  const geometry = new THREE.BufferGeometry()

  geometry.setAttribute('position', positionsAttribute)

  const material = new THREE.MeshBasicMaterial({
    color: 'red',
    wireframe: true,
  })
  const mesh = new THREE.Mesh(geometry, material)

  scene.add(mesh)

  return mesh
}

export const addTestTriangles = (scene) => {
  const geometry = new THREE.BufferGeometry()
  const count = 50 * 100
  const positionsArray = new Float32Array(count * 3 * 3)

  for (let i = 0; i < count * 3 * 3; i++) {
    positionsArray[i] = Math.random()
  }

  const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)

  geometry.setAttribute('position', positionsAttribute)

  const material = new THREE.MeshBasicMaterial({
    color: 'red',
    wireframe: true,
  })
  const mesh = new THREE.Mesh(geometry, material)

  scene.add(mesh)

  return mesh
}

export const addTestMeshes = (
  scene,
  materialTexture,
  materialAlphaTexture,
  materialMatcapTexture,
  materialGradientTexture,
  materialAOTexture,
  materialHeightTexture,
  materialMetalnessTexture,
  materialRoughnessTexture,
  materialNormalTexture,
  environementMap,
) => {
  // const material = new THREE.MeshBasicMaterial()
  // {color: 'red'}
  // material.color.set('magenta')
  // material.color = new THREE.Color('purple')
  // material.wireframe = true
  // material.opacity = 0.5
  // material.transparent = true
  // material.map = materialTexture
  // material.alphaMap = materialAlphaTexture
  // material.side = THREE.DoubleSide
  // render both sides at the cost of performance

  // const material = new THREE.MeshNormalMaterial()
  // material.flatShading = true

  // const material = new THREE.MeshMatcapMaterial()
  // material.map = materialMatcapTexture

  // const material = new THREE.MeshDepthMaterial()

  // const material = new THREE.MeshLambertMaterial()

  // better result with a performance tradeoff
  // const material = new THREE.MeshPhongMaterial()
  // material.shininess = 100
  // material.specular = new THREE.Color('blue')

  // const material = new THREE.MeshToonMaterial()
  // material.gradientMap = materialGradientTexture

  const material = new THREE.MeshStandardMaterial()
  material.metalness = 0.7
  material.roughness = 0.2
  // don't use in combination with the map or use default values (0,1)
  // material.map = materialTexture
  // material.aoMap = materialAOTexture
  // material.aoMapIntensity = 1
  // material.displacementMap = materialHeightTexture
  // material.displacementScale = 0.05
  // material.metalnessMap = materialMetalnessTexture
  // material.roughnessMap = materialRoughnessTexture
  // material.normalMap = materialNormalTexture
  // material.normalScale.set(0.5, 0.5)
  // material.alphaMap = materialAlphaTexture
  // material.transparent = true
  material.envMap = environementMap

  const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material)

  sphere.position.x = -1.5
  sphere.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2),
  )

  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 100, 100),
    material,
  )

  plane.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2),
  )

  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 64, 128),
    material,
  )

  torus.position.x = 1.5
  torus.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2),
  )

  scene.add(sphere, plane, torus)

  return { sphere: sphere, plane: plane, torus: torus }
}

export const add3DText = (font, scene, texture) => {
  const textGeometry = new TextGeometry('Hello world', {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4,
  })

  // Text isn't centered because of the bevel
  // manual way to center
  // textGeometry.computeBoundingBox()
  // textGeometry.translate(
  //   -(textGeometry.boundingBox.max.x - 0.02) / 2,
  //   -(textGeometry.boundingBox.max.y - 0.02) / 2,
  //   -(textGeometry.boundingBox.max.z - 0.03) / 2,
  // )
  // built-in method
  textGeometry.center()

  const material = new THREE.MeshMatcapMaterial()

  // textMaterial.wireframe = true
  material.matcap = texture

  const text = new THREE.Mesh(textGeometry, material)

  scene.add(text)

  const torusGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
  // always reuse the material and geometry whenever possible

  for (let i = 0; i <= 100; i++) {
    const torus = new THREE.Mesh(torusGeometry, material)

    torus.position.x = (Math.random() - 0.5) * 10
    torus.position.y = (Math.random() - 0.5) * 10
    torus.position.z = (Math.random() - 0.5) * 10

    torus.rotation.x = Math.random() * Math.PI
    torus.rotation.y = Math.random() * Math.PI

    const scale = Math.random()

    torus.scale.set(scale, scale, scale)
    scene.add(torus)
  }

  return text
}

export const addBackdropForModels = (scene) => {
  const geometry = new THREE.PlaneGeometry(10, 10)
  const material = new THREE.MeshStandardMaterial({
    color: '#444444',
    metalness: 0,
    roughness: 0.5,
  })
  const floor = new THREE.Mesh(geometry, material)

  floor.receiveShadow = true
  floor.rotation.x = -Math.PI * 0.5
  scene.add(floor)
}

export const testAnimation = (camera, clock, mesh) => {
  // Clock
  const elapsedTime = clock.getElapsedTime()
  // => Speed is otherwise dependant on FPS
  // you can use PI or other math functions (like sin or cos) to create an animation based on the incrementation

  // Update objects
  // mesh.position.x = Math.cos(elapsedTime)
  // mesh.position.y = Math.sin(elapsedTime)
  mesh.rotation.y = elapsedTime

  // camera.lookAt(mesh.position)
}

export const testAnimationGsap = (mesh) => {
  gsap.to(mesh.position, { x: 2, duration: 1, delay: 1 })
  gsap.to(mesh.position, { x: 0, duration: 1, delay: 2 })
}

export const testAnimationMeshes = (clock, meshes) => {
  const elapsedTime = clock.getElapsedTime()

  meshes.sphere.rotation.y = 0.1 * elapsedTime
  meshes.plane.rotation.y = 0.1 * elapsedTime
  meshes.torus.rotation.y = 0.1 * elapsedTime

  meshes.sphere.rotation.x = 0.15 * elapsedTime
  meshes.plane.rotation.x = 0.15 * elapsedTime
  meshes.torus.rotation.x = 0.15 * elapsedTime
}
