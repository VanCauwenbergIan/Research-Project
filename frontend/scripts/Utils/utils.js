import * as THREE from 'three'

export const addHelpers = (scene) => {
  const axesHelper = new THREE.AxesHelper()
  // const gridHelper = new THREE.GridHelper()

  scene.add(axesHelper)
}

export const onScreenChange = (sizes, camera, renderer) => {
  window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.updateAspect(sizes.width / sizes.height)

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  })
}

export const onDrag = (orbitControls, dragControls) => {
  dragControls.addEventListener('dragstart', () => {
    orbitControls.enabled = false
  })
  dragControls.addEventListener('dragend', () => {
    orbitControls.enabled = true
  })
}

export const onMouseMove = (
  raycaster,
  pointer,
  camera,
  scene,
  sizes,
  currentlyDraggable,
) => {
  window.addEventListener('mousemove', (e) => {
    // reassigning the array won't be noticed by three.js
    currentlyDraggable.length = 0
    pointer.x = (e.clientX / sizes.width) * 2 - 1
    pointer.y = -(e.clientY / sizes.height) * 2 + 1
    raycaster.setFromCamera(pointer, camera)
    raycaster.firstHitOnly = true
    // raycaster is too performance intensive on large objects without bvh

    let intersects = raycaster.intersectObjects(scene.children)

    if (intersects.length > 0) {
      let object = intersects[0].object
      while (object.parent.parent !== null) {
        object = object.parent
      }
      if (object.isDraggable) {
        currentlyDraggable.push(object)
      }
    }
  })
}

