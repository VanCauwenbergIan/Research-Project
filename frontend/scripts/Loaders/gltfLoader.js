import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'

export default class ModelLoader {
  constructor(scene) {
    this.instance = new GLTFLoader()
    this.scene = scene
  }

  addModel(path, name) {
    return new Promise((resolve) =>
      this.instance.load(
        path,
        (gltf) => {
          resolve(this.onLoad(gltf, this.scene, name))
        },
        this.onProgress,
        this.onError,
      ),
    )
  }

  onLoad(model, scene, name) {
    this.generateGeometry(model.scene)
    model.scene.name = name
    scene.add(model.scene)

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
