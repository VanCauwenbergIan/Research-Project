import * as THREE from 'three'
import { gsap } from 'gsap'

export class LoadingManager {
  instance
  overlay

  constructor(scene, domElement) {
    this.scene = scene
    this.domElement = domElement
    this.addLoader()
  }

  // You have two way to overlay elements on the canvas
  // 1) use a shader and make webgl render them on top of the other objects
  // 2) use a html div with position absolute and reference it through JS
  // mixing in html is not ideal, if you have performance issues try removing html and using the first method
  addLoader() {
    const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1)
    const overlayMaterial = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uAlpha: { value: 1 },
      },
      vertexShader: `
        void main()
        {
            gl_Position = vec4(position, 1);
        }
        `,
      fragmentShader: `
        uniform float uAlpha;
      
        void main()
        {
            gl_FragColor = vec4(0,0,0,uAlpha);
        }
        `,
    })

    this.overlay = new THREE.Mesh(overlayGeometry, overlayMaterial)
    this.scene.add(this.overlay)
    this.instance = new THREE.LoadingManager(
      () => this.onLoad(this.overlay),
      (url, done, togo) => this.onProgress(url, done, togo, this.domElement),
      this.onError,
    )
  }

  onLoad(overlay) {
    gsap.delayedCall(0.5, () => {
      gsap.to(overlay.material.uniforms.uAlpha, { duration: 3, value: 0 })

      this.domElement.style.transform = 'scaleX(0)'
      this.domElement.classList.remove('origin-top-left')
      this.domElement.classList.add('origin-top-right')
      this.domElement.classList.remove('duration-500')
      this.domElement.classList.add('duration-[1500]')
      this.domElement.classList.add('ease-in-out')
    })
  }

  onProgress(itemUrl, itemsLoaded, itemsTotal, element) {
    const ratio = itemsLoaded / itemsTotal

    element.style.transform = `scaleX(${ratio})`
  }

  onError(error) {
    console.error(error)
  }
}
