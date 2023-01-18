import { DragControls as DragControlsThree } from 'three/examples/jsm/controls/DragControls'
import Controls from './controls'

export default class DragControls extends Controls {
  instance

  constructor(objects, camera, canvas) {
    super(camera, canvas)
    this.objects = objects
    this.addDragControls()
  }

  addDragControls() {
    this.instance = new DragControlsThree(
      this.objects,
      this.camera,
      this.canvas,
    )
  }
}
