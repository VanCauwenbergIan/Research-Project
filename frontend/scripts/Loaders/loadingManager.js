import * as THREE from 'three'
import { gsap } from 'gsap'

export class LoadingManager {
  instance
  overlay

  constructor(scene, domLoader, gui) {
    this.scene = scene
    this.domLoader = domLoader
    this.gui = gui
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
      (url, done, togo) => this.onProgress(url, done, togo, this.domLoader),
      this.onError,
    )
  }

  onLoad(overlay) {
    gsap.delayedCall(0.5, () => {
      gsap.to(overlay.material.uniforms.uAlpha, { duration: 3, value: 0 })

      // Loader
      this.domLoader.style.transform = 'scaleX(0)'
      this.domLoader.classList.remove('origin-top-left')
      this.domLoader.classList.add('origin-top-right')
      this.domLoader.classList.remove('duration-500')
      this.domLoader.classList.add('duration-[1500]')
      this.domLoader.classList.add('ease-in-out')

      gsap.delayedCall(1.5, () => {
        // Open menus
        this.gui.style.visibility = 'visible'
        gsap.to(this.gui, { duration: 1.5, opacity: 1 })
      })
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
