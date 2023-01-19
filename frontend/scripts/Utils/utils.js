import * as THREE from 'three'

/**
 * Event listeners
 */

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
    refreshMouse(pointer, sizes, e)
    raycaster.setFromCamera(pointer, camera)

    let object = getFirstIntersect(raycaster, scene)

    if (object && object.isDraggable) {
      currentlyDraggable.push(object)
    }
  })
}

export const onMouseDown = (raycaster, pointer, camera, scene, sizes, box) => {
  window.addEventListener('mousedown', (e) => {
    refreshMouse(pointer, sizes, e)
    raycaster.setFromCamera(pointer, camera)

    let object = getFirstIntersect(raycaster, scene)

    if (object && object.name === 'psu' && object.isDraggable) {
      box.addPSUBox()
    }
  })
}

export const onMouseUp = (raycaster, pointer, camera, scene, sizes, box) => {
  window.addEventListener('mouseup', (e) => {
    refreshMouse(pointer, sizes, e)
    raycaster.setFromCamera(pointer, camera)

    let object = getFirstIntersect(raycaster, scene)

    if (object && object.name === 'psu') {
      box.removeBox()
    }
  })
}

/**
 * General purpose functions
 */

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

export const addMenuItems = (menu, models) => {
  menu.innerHTML = ''

  for (const model of models) {
    const innerHTML = `          
    <div
      id="${model.id}"
      class="mb-3 w-52 p-2 rounded-lg flex items-center flex-row bg-black bg-opacity-[0.12] gap-x-2"
    >
    <img src="../../assets/images/${model.imageUrl}" class="aspect-square w-16 h-16 bg-white rounded-lg p-1" draggable="false"/>
      <p draggable="false">${model.name}</p>
    </div>
    `
    
    menu.innerHTML += innerHTML
  }
}

export const enableDragMenu = (menu) => {
  for (const child of menu.children) {
    child.setAttribute('draggable', true)
    child.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', child.id)
    })
  }
}

export const disableDragMenu = (menu) => {
  for (const child of menu.children) {
    child.setAttribute('draggable', false)
  }
}

export const initMenuEvents = (event, canvas) => {
  canvas.addEventListener('dragover', (e) => {
    e.preventDefault()
  })
  canvas.addEventListener('dragenter', (e) => {
    e.preventDefault()
  })
  canvas.addEventListener('drop', (e) => {
    e.preventDefault()

    let data = e.dataTransfer.getData('text/plain')

    event.chosenModel = data
    canvas.dispatchEvent(event)
  })
}

export const convertMouseToVector3 = (pointer, camera) => {
  // convert x and y (-1,1) of mouse to 3d coordinates in world space
  const vector = new THREE.Vector3()
  const position = new THREE.Vector3()

  vector.set(pointer.x, pointer.y, 0.5)
  vector.unproject(camera)
  vector.sub(camera.position).normalize()

  const distance = -camera.position.z / vector.z

  position.copy(camera.position).add(vector.multiplyScalar(distance))

  return position
}

const refreshMouse = (pointer, sizes, e) => {
  pointer.x = (e.clientX / sizes.width) * 2 - 1
  pointer.y = -(e.clientY / sizes.height) * 2 + 1
}

const getFirstIntersect = (raycaster, scene) => {
  let intersects = raycaster.intersectObjects(scene.children)

  if (intersects.length > 0) {
    let object = intersects[0].object

    while (object.parent.parent !== null) {
      object = object.parent
    }

    return object
  }
}

/**
 * Debugging only
 */

export const addHelpers = (scene) => {
  const axesHelper = new THREE.AxesHelper()
  // const gridHelper = new THREE.GridHelper()

  scene.add(axesHelper)
}
