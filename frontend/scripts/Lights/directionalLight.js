import * as THREE from 'three'
import Light from './light'

export default class DirectionalLight extends Light {
  instance

  constructor(params, scene) {
    super(params.color, params.intensity)
    this.x = params.x
    this.y = params.y
    this.z = params.z
    this.scene = scene
    this.addLight()
    this.setShadowsMap(1024)
    this.setShadowsCamera(15, -7, 7, 7, -7)
  }

  addLight() {
    this.instance = new THREE.DirectionalLight(this.color, this.intensity)
    this.instance.position.set(this.x, this.y, this.z)
    this.scene.add(this.instance)
  }

  setShadowsMap(widthMap, heightMap = widthMap) {
    this.instance.castShadow = true
    this.instance.shadow.mapSize.set(widthMap, heightMap)
  }

  setShadowsCamera(far, left, top, right, bottom) {
    this.instance.shadow.camera.far = far
    this.instance.shadow.camera.left = left
    this.instance.shadow.camera.top = top
    this.instance.shadow.camera.far = right
    this.instance.shadow.camera.far = bottom
  }
}
