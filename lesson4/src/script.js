//IMPORT THREE.JS LIBRARY
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'


const canvas = document.querySelector('canvas.three')
const gui = new GUI()

// Create the scene
const scene = new THREE.Scene()

// The resolution of the canvas
const resolution={
    width: window.innerWidth,
    height: window.innerHeight
}

// Create camera and add it to the scene
// The camera will have a field of view of 75 degrees and an aspect ratio based on
// The camera will be positioned 5 units away from the origin along the z-axis
const camera = new THREE.PerspectiveCamera(75, resolution.width / resolution.height, 0.1, 1000)
camera.position.set(0, 0, 5)
scene.add(camera)

// Create orbit controls to allow the user to rotate, zoom, and pan the camera
// OrbitControls will use the camera and the canvas as its target
const controls = new OrbitControls(camera, canvas)
// Set the target of the controls to the origin of the scene
controls.target.set(0, 0, 0)
// Enable damping to make the controls smoother
controls.enableDamping = true

// Create a texture loader to load the texture image
// The texture will be a wall image that will be repeated on the box
const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('textures/wooden_gate_diff_4k.png')
const aotexture = textureLoader.load('textures/wooden_gate_ao_4k.png')
const dtexture = textureLoader.load('textures/wooden_gate_disp_4k.png')
const rtexture = textureLoader.load('textures/wooden_gate_rough_4k.png')
const mtexture = textureLoader.load('textures/wooden_gate_metal_4k.png')
const ntexture = textureLoader.load('textures/wooden_gate_nor_dx_4k.png')
const rgbeloader = new RGBELoader()
rgbeloader.load('textures/4k.hdr', (environment) => {
    environment.mapping = THREE.EquirectangularReflectionMapping
    scene.background = environment
    scene.environment = environment
})

texture.colorSpace = THREE.SRGBColorSpace

// Set the repeat property of the texture to 2 in both x and y directions
// This will create a tiled effect on the box surface
texture.repeat.x = 2
texture.repeat.y = 2
mtexture.repeat.set(2,2)
ntexture.repeat.set(2,2)
rtexture.repeat.set(2,2)
aotexture.repeat.set(2,2)
// Set the wrapS and wrapT properties of the texture to RepeatWrapping
// This will allow the texture to repeat when it exceeds the boundaries of the box
texture.wrapS = THREE.RepeatWrapping
texture.wrapT = THREE.RepeatWrapping
ntexture.wrapS = THREE.RepeatWrapping
ntexture.wrapT = THREE.RepeatWrapping
mtexture.wrapS = THREE.RepeatWrapping
mtexture.wrapT = THREE.RepeatWrapping
rtexture.wrapS = THREE.RepeatWrapping
rtexture.wrapT = THREE.RepeatWrapping
aotexture.wrapS = THREE.RepeatWrapping
aotexture.wrapT = THREE.RepeatWrapping

// Mipmapping is a technique that improves the quality of textures when they are viewed at different distances
// It creates multiple versions of the texture at different resolutions
texture.generateMipmaps = true

// Set the minFilter property of the texture to LinearFilter
// This will smooth the texture when it is displayed at smaller sizes
texture.minFilter = THREE.NearestFilter

// Set the magFilter property of the texture to LinearFilter
// This will smooth the texture when it is displayed at its original size
texture.magFilter = THREE.NearestFilter


// // Create ambient light to illuminate the scene
// // Ambient light is a type of light that affects all objects in the scene equally
// const AmbientLight = new THREE.AmbientLight(0xffffff, 1.2)
// scene.add(AmbientLight)
// // Create a point light to create a spotlight effect
// // Point light is a type of light that emits light in all directions from a single point
// const pointLight = new THREE.PointLight(0xffffff, 20)
// pointLight.position.set(2, 3, 4)
// scene.add(pointLight)

const material = new THREE.MeshPhysicalMaterial()
material.map = texture
material.aoMap = aotexture
material.aoMapIntensity = 1
material.roughness = 1
material.metalness = 1
material.roughnessMap = rtexture
material.metalnessMap = mtexture
material.normalMap = ntexture
material.normalScale = new THREE.Vector2(1, 1)





// Add the material properties to the GUI for live editing
gui.add(material, 'roughness').name('Roughness').min(0).max(1).step(0.01)
gui.add(material, 'metalness').name('Metalness').min(0).max(1).step(0.01)


const BoxGeometry = new THREE.BoxGeometry(1, 1, 1)
const box = new THREE.Mesh(BoxGeometry, material)
box.position.set(-2, 0, 0)
scene.add(box)

const SphereGeometry = new THREE.SphereGeometry(1, 32, 32)

const material2 = new THREE.MeshPhysicalMaterial()
// iridescence is used for materials that change color based on the angle of viewss
material2.transparent = true
material2.opacity = 0.5
material2.iridescence = 1.5
material2.iridescenceIOR = 1
material2.iridescenceThicknessRange = [100, 800]
gui.add(material2, 'roughness').name('Roughness').min(0).max(1).step(0.01)
gui.add(material2, 'metalness').name('Metalness').min(0).max(1).step(0.01)

const sphere = new THREE.Mesh(SphereGeometry, material2)
sphere.position.set(0, 0, 0)
scene.add(sphere)


const PlaneGeometry = new THREE.CylinderGeometry(0.5,0.5,2)
const plane = new THREE.Mesh(PlaneGeometry, material)
plane.position.set(2, 0, 0)

scene.add(plane)



// Create a renderer and set its size to the resolution
const renderer = new THREE.WebGLRenderer({ 
    canvas: canvas,
})
renderer.setSize(resolution.width, resolution.height)

const clock = new THREE.Clock()
// Update function to render the scene and update the controls
// This function will be called repeatedly using requestAnimationFrame
const update = () => {

    const time = clock.getElapsedTime()
    box.rotation.y = time * 0.5
    sphere.rotation.x = time * 0.5
    controls.update();
    renderer.render(scene, camera)
    window.requestAnimationFrame(update)
}
update()