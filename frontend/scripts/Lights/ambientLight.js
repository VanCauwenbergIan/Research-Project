import * as THREE from 'three'
import Light from './light'

export default class AmbientLight extends Light {
  instance

  constructor(params, scene) {
    super(params.color, params.intensity)
    this.scene = scene
    this.addLight()
  }

  addLight() {
    this.instance = new THREE.AmbientLight(this.color, this.intensity)
    this.scene.add(this.instance)
  }
}
