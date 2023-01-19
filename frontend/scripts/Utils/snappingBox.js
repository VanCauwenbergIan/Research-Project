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

  addBoundingBox(position, scale) {
    this.mesh.position.set(position.x, position.y, position.z)
    this.mesh.scale.set(scale.x, scale.y, scale.z)
    this.scene.add(this.mesh)
  }

  removeBox() {
    let object = this.scene.getObjectByName(this.mesh.name)
    this.scene.remove(object)
  }
}
