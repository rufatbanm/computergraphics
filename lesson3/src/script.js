//IMPORT THREE.JS LIBRARY
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'


const canvas = document.querySelector('canvas.three')

// Create the scene
const scene = new THREE.Scene()

// Create a box mesh and add it to the scene
// The box will be a green cube with a size of 1x1x1
const geometry =new THREE.BoxGeometry(1, 1, 1)

// Create a texture loader to load the texture image
// The texture will be a wall image that will be repeated on the box
const teaxtureLoader = new THREE.TextureLoader()
const texture = teaxtureLoader.load('https://threejsfundamentals.org/threejs/resources/images/wall.jpg')
console.log(texture)    

// Set the repeat property of the texture to 2 in both x and y directions
// This will create a tiled effect on the box surface
texture.repeat.x =2
texture.repeat.y =2

// Set the wrapS and wrapT properties of the texture to RepeatWrapping
// This will allow the texture to repeat when it exceeds the boundaries of the box
texture.wrapS = THREE.RepeatWrapping
texture.wrapT = THREE.RepeatWrapping

// Mipmapping is a technique that improves the quality of textures when they are viewed at different distances
// It creates multiple versions of the texture at different resolutions
texture.generateMipmaps=false

// Set the minFilter property of the texture to LinearFilter
// This will smooth the texture when it is displayed at smaller sizes
texture.minFilter = THREE.LinearFilter

// Set the magFilter property of the texture to LinearFilter
// This will smooth the texture when it is displayed at its original size
texture.magFilter = THREE.LinearFilter


// Create a mesh with the box geometry and the texture material
// The material will use the texture as its map
const material = new THREE.MeshBasicMaterial({ map: texture })
const mesh = new THREE.Mesh(geometry, material)


mesh.position.set(0, 0, 4)
mesh.rotation.set(0, Math.PI * 0.25, 0)
mesh.scale.set(1, 2, 4)

scene.add(mesh)

// The resolution of the canvas
const resolution={
    width: 800,
    height: 600
}



// Create camera and add it to the scene
// The camera will have a field of view of 75 degrees and an aspect ratio based on
// The camera will be positioned 5 units away from the origin along the z-axis
const camera = new THREE.PerspectiveCamera(75, resolution.width / resolution.height, 0.1, 1000)
camera.position.set(0, 0, -5)
scene.add(camera)

// Create orbit controls to allow the user to rotate, zoom, and pan the camera
// OrbitControls will use the camera and the canvas as its target
const controls = new OrbitControls(camera, canvas)
// Set the target of the controls to the origin of the scene
controls.target.set(0, 0, 0)
// Enable damping to make the controls smoother
controls.enableDamping = true

// Create a renderer and set its size to the resolution
const renderer = new THREE.WebGLRenderer({ 
    canvas: canvas,
})
renderer.setSize(resolution.width, resolution.height)

//
//
const clock = new THREE.Clock()
// Update function to render the scene and update the controls
// This function will be called repeatedly using requestAnimationFrame
const update = () => {

    controls.update();
    renderer.render(scene, camera)
    window.requestAnimationFrame(update)
}
update()