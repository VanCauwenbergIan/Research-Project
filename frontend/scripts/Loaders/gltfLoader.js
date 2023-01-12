import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import {
  computeBoundsTree,
  disposeBoundsTree,
  acceleratedRaycast,
} from 'three-mesh-bvh'

export default class ModelLoader {
  constructor(scene) {
    this.instance = new GLTFLoader()
    this.scene = scene
  }

  addModel(path) {
    return new Promise((resolve) =>
      this.instance.load(
        path,
        (gltf) => {
          resolve(this.onLoad(gltf, this.scene))
        },
        this.onProgress,
        this.onError,
      ),
    )
  }

  onLoad(model, scene) {
    this.generateGeometry(model.scene)
    scene.add(model.scene)
    console.log(model.scene)

    return model.scene
  }

  onProgress() {}

  onError(error) {
    console.error(error)
  }

  generateGeometry(object) {
    object.children.forEach((child) => {
      if (child.type === 'Mesh') {
        child.geometry.computeBoundsTree()
      }
      this.generateGeometry(child)
    })
  }
}
