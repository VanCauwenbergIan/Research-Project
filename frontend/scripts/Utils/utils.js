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
  dragControls.addEventListener('dragging-changed', (e) => {
    orbitControls.enabled = !e.value
  })
  // dragControls.addEventListener('dragend', () => {
  //   orbitControls.enabled = true
  // })
}

export const onMouseMove = (
  raycaster,
  pointer,
  camera,
  scene,
  sizes,
  currentlyDraggable,
) => {
  window.addEventListener('pointermove', (e) => {
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

/**
 * General purpose functions
 */

export const addMenuItems = (menu, models, cart, event, canvas) => {
  menu.innerHTML = ''

  const currentCase = cart.find((item) => item.objectType === 'case')
  const currentMotherboard = cart.find(
    (item) => item.objectType === 'motherboard',
  )
  const totalPower = calculatePower(cart)

  for (const model of models) {
    const innerHTML = `          
    <button disabled
      id="${model.id}"
      class="gui-main-menu-item mb-3 w-52 p-2 rounded-lg flex items-center flex-row bg-black bg-opacity-[0.12] gap-x-2 disabled:bg-black disabled:opacity-50 disabled:bg-opacity-[0.12]"
    >
      <img src="../../assets/images/${model.imageUrl}" class="aspect-square w-16 h-16 bg-white rounded-lg p-1"/>
      <p>${model.name}</p>
    </button>
    `

    switch (model.objectType) {
      case 'case':
      case 'cooler':
      case 'storage':
        menu.innerHTML += innerHTML
        break
      case 'motherboard':
        if (
          currentCase &&
          currentCase.supportedMotherboardFormats.includes(model.format)
        ) {
          menu.innerHTML += innerHTML
        }
        break
      case 'cpu':
        if (currentMotherboard && currentMotherboard.socket === model.socket) {
          menu.innerHTML += innerHTML
        }
        break
      case 'memory':
        if (
          currentMotherboard &&
          currentMotherboard.supportedMemoryTypes.includes(model.generation)
        ) {
          menu.innerHTML += innerHTML
        }
        break
      case 'cpu_cooler':
        if (
          currentMotherboard &&
          model.supportedSockets.includes(currentMotherboard.socket)
        ) {
          menu.innerHTML += innerHTML
        }
        break
      case 'gpu':
        if (
          currentCase &&
          currentCase.pciSlots >= model.slots &&
          currentCase.maxLengthGPU >= model.length
        ) {
          menu.innerHTML += innerHTML
        }
        break
      case 'psu':
        if (
          currentCase &&
          currentCase.supportedMotherboardFormats.includes(model.format) &&
          (model.power / 100) * model.rating - 50 >= totalPower
        ) {
          if (currentCase.supportedMotherboardFormats.includes('atx')) {
            if (model.format !== 'itx') {
              menu.innerHTML += innerHTML
            }
          } else {
            menu.innerHTML += innerHTML
          }
        }
        break
    }
  }

  const menuItems = menu.querySelectorAll('.gui-main-menu-item')

  for (const item of menuItems) {
    item.addEventListener('click', () => {
      event.chosenModel = item.id
      canvas.dispatchEvent(event)
    })
  }
}

// export const enableDragMenu = (menu) => {
//   for (const child of menu.children) {
//     child.setAttribute('draggable', true)
//     child.addEventListener('dragstart', (e) => {
//       e.dataTransfer.setData('text/plain', child.id)
//     })
//   }
// }

// export const disableDragMenu = (menu) => {
//   for (const child of menu.children) {
//     child.setAttribute('draggable', false)
//   }
// }

export const enableMenu = (menu, bool) => {
  for (const child of menu.children) {
    child.disabled = !bool
  }
}

export const initMenuEvents = (event, canvas, cart, overlay, open, close) => {
  // canvas.addEventListener('dragover', (e) => {
  //   e.preventDefault()
  // })
  // canvas.addEventListener('dragenter', (e) => {
  //   e.preventDefault()
  // })
  // canvas.addEventListener('drop', (e) => {
  //   e.preventDefault()

  //   let data = e.dataTransfer.getData('text/plain')

  //   event.chosenModel = data
  //   canvas.dispatchEvent(event)
  // })

  open.addEventListener('click', () => {
    cart.classList.remove('hidden')
    overlay.classList.remove('hidden')

    cart.classList.add('flex')
  })
  close.addEventListener('click', () => {
    cart.classList.remove('flex')

    cart.classList.add('hidden')
    overlay.classList.add('hidden')
  })
}

export const convertMouseToVector3 = (pointer, camera) => {
  // convert x and y (-1,1) of mouse to 3d coordinates in world space
  const vector = new THREE.Vector3()
  const position = new THREE.Vector3()

  vector.set(pointer.x, 0, 3)
  // vector.unproject(camera)

  // const distance = -camera.position.z / vector.z

  // position.copy(camera.position).add(vector.multiplyScalar(distance))

  return vector
}

export const refreshMouse = (pointer, sizes, e) => {
  pointer.x = (e.clientX / sizes.width) * 2 - 1
  pointer.y = -(e.clientY / sizes.height) * 2 + 1
}

export const getFirstIntersect = (raycaster, scene) => {
  let intersects = raycaster.intersectObjects(scene.children)

  if (intersects.length > 0) {
    let object = intersects[0].object

    while (object.parent.parent !== null) {
      object = object.parent
    }

    return object
  }
}

export const calculatePower = (cart) => {
  let memoryCount = 0
  let totalPower = 0

  for (const item of cart) {
    switch (item.objectType) {
      case 'cpu':
      case 'gpu':
        totalPower += item.tdp
        break
      case 'memory':
        memoryCount += item.size
        break
      case 'cpu_cooler':
        totalPower += 10
        break
      case 'cooler':
        totalPower += 5
        break
      case 'motherboard':
        switch (item.format) {
          case 'itx':
            totalPower += 30
            break
          case 'm_atx':
            totalPower += 65
            break
          case 'atx':
            totalPower += 70
            break
          case 'e_atx':
            totalPower += 105
            break
        }
        break
      case 'storage':
        if (item.type === 'ssd') {
          totalPower += 10
        } else {
          totalPower += 20
        }
        break
    }
  }

  totalPower += (7 * memoryCount) / 8

  return totalPower
}

export const lookForOrphans = (scene, menuInfo, cart) => {
  let orphanedChildFound = false
  let previousChildren = []

  for (const child of scene.children) {
    if (
      menuInfo.findIndex((option) => option.id === child.name) > -1 &&
      cart.findIndex((item) => item.id === child.name) === -1
    ) {
      console.log('orphan')
      orphanedChildFound = true
    }

    previousChildren.push(child)
  }

  for (const child of scene.children) {
    const childrenInArray = previousChildren.filter(
      (prevChild) => prevChild.name === child.name,
    )
    const element = document.getElementById(`${child.name}-cart`)

    if (element) {
      let countElement = element.querySelector('.gui-cart-item-count')
      let count = countElement.innerHTML[1]
      console.log(childrenInArray.length, count)

      if (childrenInArray.length != count) {
        console.log('orphan')
        orphanedChildFound = true
      }
    }
  }

  return orphanedChildFound
}

/**
 * Debugging only
 */

export const addHelpers = (scene) => {
  const axesHelper = new THREE.AxesHelper()
  // const gridHelper = new THREE.GridHelper()

  scene.add(axesHelper)
}
