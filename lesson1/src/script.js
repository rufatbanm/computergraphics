//IMPORT THREE.JS LIBRARY
import * as THREE from 'three'

const canvas = document.querySelector('canvas.three')

// Create the scene
const scene = new THREE.Scene()

// Create a box mesh and add it to the scene
// The box will be a green cube with a size of 1x1x1
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// The resolution of the canvas
const resolution={
    width: 800,
    height: 600
}

// Create camera and add it to the scene
// The camera will have a field of view of 75 degrees and an aspect ratio based on
// The camera will be positioned 5 units away from the origin along the z-axis
const camera = new THREE.PerspectiveCamera(75, resolution.width / resolution.height)
camera.position.z = 5
scene.add(camera)

// Create a renderer and set its size to the resolution
const renderer = new THREE.WebGLRenderer({ 
    canvas: canvas 
})

renderer.setSize(resolution.width, resolution.height)
renderer.render(scene, camera)