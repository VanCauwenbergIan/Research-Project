import { OrbitControls as OrbitControlsThree } from 'three/examples/jsm/controls/OrbitControls'

export default class OrbitControls {
  instance

  constructor(params, camera, canvas) {
    this.targetX = params.x || 0
    this.targetY = params.y || 0
    this.targetZ = params.z || 0
    this.dampening = params.dampening || false
    this.camera = camera
    this.canvas = canvas
    this.addControls()
  }

  addControls() {
    this.instance = new OrbitControlsThree(this.camera, this.canvas)
    this.instance.target.x = this.targetX
    this.instance.target.y = this.targetY
    this.instance.target.z = this.targetZ
    this.enableDampening = this.dampening
  }
}
