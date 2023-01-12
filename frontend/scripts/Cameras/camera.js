export default class Camera {
  instance

  constructor(fov, near, far, width, height, x, y, z) {
    this.fov = fov
    this.near = near
    this.far = far
    this.width = width
    this.height = height
    this.x = x
    this.y = y
    this.z = z
  }

  // In radians => so 2pi = 360 degrees
  rotate(x, y, z) {
    this.instance.rotation.x = (x * Math.PI) / 180
    this.instance.rotation.y = (y * Math.PI) / 180
    this.instance.rotation.z = (z * Math.PI) / 180
  }
}
