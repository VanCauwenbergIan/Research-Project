import * as THREE from 'three'

export default class SnappingBox {
  mesh
  boundingBox

  constructor(scene) {
    this.scene = scene

    let geometry = new THREE.BoxGeometry(1, 1, 1)
    let material = new THREE.MeshBasicMaterial({
      color: 0xff9176,
      opacity: 0.6,
      side: THREE.DoubleSide,
      transparent: true,
      // wireframe: true,
    })
    // bug with transparency => change render order

    this.mesh = new THREE.Mesh(geometry, material)
    this.mesh.name = 'snappingBox'
    this.mesh.renderOrder = -1
    this.boundingBox = new THREE.Box3().setFromObject(this.mesh)
  }

  updateBoundingBox() {
    this.boundingBox
      .copy(this.mesh.geometry.boundingBox)
      .applyMatrix4(this.mesh.matrixWorld)
  }

  addPSUBox() {
    this.mesh.position.set(-1.5, -1.75, 0)
    this.mesh.scale.set(1.95, 1.3, 2.45)
    this.scene.add(this.mesh)
  }

  removeBox() {
    let object = this.scene.getObjectByName(this.mesh.name)
    this.scene.remove(object)
  }
}
