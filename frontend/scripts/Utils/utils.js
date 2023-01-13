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

export const onMouseDown = (raycaster, pointer, camera, scene, sizes, box) => {
  window.addEventListener('mousedown', (e) => {
    pointer.x = (e.clientX / sizes.width) * 2 - 1
    pointer.y = -(e.clientY / sizes.height) * 2 + 1
    raycaster.setFromCamera(pointer, camera)
    raycaster.firstHitOnly = true

    let intersects = raycaster.intersectObjects(scene.children)

    if (intersects.length > 0) {
      let object = intersects[0].object

      while (object.parent.parent !== null) {
        object = object.parent
      }
      if (object.name === 'psu' && object.isDraggable) {
        box.addPSUBox()
      }
    }
  })
}

export const onMouseUp = (raycaster, pointer, camera, scene, sizes, box) => {
  window.addEventListener('mouseup', (e) => {
    pointer.x = (e.clientX / sizes.width) * 2 - 1
    pointer.y = -(e.clientY / sizes.height) * 2 + 1
    raycaster.setFromCamera(pointer, camera)
    raycaster.firstHitOnly = true

    let intersects = raycaster.intersectObjects(scene.children)

    if (intersects.length > 0) {
      let object = intersects[0].object

      while (object.parent.parent !== null) {
        object = object.parent
      }
      if (object.name === 'psu') {
        box.removeBox()
      }
    }
  })
}

export const checkCollision = (
  snappingBox,
  bb2,
  model,
  dragControls,
  orbitControls,
) => {
  const bb1 = snappingBox.boundingBox

  if (bb2.intersectsBox(bb1) && !orbitControls.enabled) {
    const center = bb1.getCenter(new THREE.Vector3())
    const sizeBB = bb1.getSize(new THREE.Vector3())
    const sizeModel = bb2.getSize(new THREE.Vector3())

    dragControls.deactivate()
    model.isDraggable = false
    snappingBox.removeBox()

    if (center.x >= 0) {
      model.position.x = center.x + (sizeBB.x - sizeModel.x) / 2
    } else {
      model.position.x = center.x - (sizeBB.x - sizeModel.x) / 2
    }
    if (center.y >= 0) {
      model.position.y = center.y + (sizeBB.y - sizeModel.y) / 2
    } else {
      model.position.y = center.y - (sizeBB.y - sizeModel.y) / 2
    }
    if (center.z >= 0) {
      model.position.z = center.z + (sizeBB.z - sizeModel.z) / 2
    } else {
      model.position.z = center.z - (sizeBB.z - sizeModel.z) / 2
    }

    window.addEventListener('mouseup', () => {
      orbitControls.enabled = true
      window.removeEventListener('mouseup', this)
    })
  }
}
