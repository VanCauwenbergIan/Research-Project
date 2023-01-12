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
  draggableObjects,
  currentlyDraggable,
) => {
  window.addEventListener('mousemove', (e) => {
    // reassigning the array won't be noticed by three.js
    currentlyDraggable.length = 0
    pointer.x = (e.clientX / sizes.width) * 2 - 1
    pointer.y = -(e.clientY / sizes.height) * 2 + 1
    raycaster.setFromCamera(pointer, camera)
    raycaster.firstHitOnly = true

    let intersects = raycaster.intersectObjects(scene.children)

    if (intersects.length > 0) {
      const object = intersects[0].object
      console.log('hello')

      // currentlyDraggable.push(object)
    }
    // raycaster is too performance intesnive on large objects
  })
}
