import * as THREE from 'three'
import Camera from './camera'

export default class PerspectiveCamera extends Camera {
  constructor(params, scene) {
    super(
      params.fov,
      params.near,
      params.far,
      params.width,
      params.height,
      params.x,
      params.y,
      params.z,
    )
    this.scene = scene
    this.addCamera()
  }

  addCamera() {
    this.instance = new THREE.PerspectiveCamera(
      this.fov,
      this.width / this.height,
      this.near,
      this.far,
    )
    this.instance.position.set(this.x, this.y, this.z)
    this.scene.add(this.instance)
  }

  updateAspect(aspectRatio) {
    this.instance.aspect = aspectRatio
    this.instance.updateProjectionMatrix()
  }
}
