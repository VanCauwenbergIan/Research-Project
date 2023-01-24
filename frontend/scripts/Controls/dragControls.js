import { TransformControls } from 'three/addons/controls/TransformControls.js'
import Controls from './controls'

export default class DragControls extends Controls {
  instance

  constructor(camera, canvas) {
    super(camera, canvas)
    // this.objects = objects
    this.addDragControls()
  }

  addDragControls() {
    this.instance = new TransformControls(this.camera, this.canvas)
    // this.instance.transformGroup = true
  }
}
