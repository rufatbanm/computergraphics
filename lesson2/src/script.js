import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.three')

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Cursor
const cursor = {
    x: 0,
    y: 0
}

//mousemove event listener to update cursor position
// This will allow us to use cursor.x and cursor.y in our animations if we want it
window.addEventListener('mousemove', (event) =>
{
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = - (event.clientY / sizes.height - 0.5)
})

// Scene
const scene = new THREE.Scene()

// Object
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
scene.add(mesh)

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
// const aspectRatio = sizes.width / sizes.height
// const camera = new THREE.OrthographicCamera(- 1 * aspectRatio, 1 * aspectRatio, 1, - 1, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Delta time version
// let currenttime = Date.now()

// const update = () => {
//     const newtime = Date.now()
//     const delta =newtime-currenttime
//     currenttime = newtime
//     mesh.rotation.x += 0.005 * delta
//     renderer.render(scene, camera)
//     window.requestAnimationFrame(update)
// }

// Animate
const clock = new THREE.Clock()

const update = () =>
{
    // Update mesh rotation
    const elapsedTime = clock.getElapsedTime()
    //Use sin and cos to create a smooth animation
    mesh.position.x = Math.sin(elapsedTime) * Math.PI * 0.5
    mesh.position.y = Math.cos(elapsedTime) * Math.PI * 0.5
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(update)
}

update()