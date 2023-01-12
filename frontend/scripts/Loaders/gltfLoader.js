import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

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
    scene.add(model.scene)

    return model.scene
  }

  onProgress() {}

  onError(error) {
    console.error(error)
  }
}
