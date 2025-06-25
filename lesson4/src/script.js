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

// Set the wrapS and wrapT properties of the texture to RepeatWrapping
// This will allow the texture to repeat when it exceeds the boundaries of the box
texture.wrapS = THREE.RepeatWrapping
texture.wrapT = THREE.RepeatWrapping

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
// material.transparent = true
// material.opacity = 0.4

// iridescence is used for materials that change color based on the angle of viewss
// material.iridescence = 1.5
// material.iridescenceIOR = 1
// material.iridescenceThicknessRange = [100, 800]


//transmission is used for glass-like materials
material.transmission = 1
material.ior = 1.333
material.thickness = 0.5



// material.color = new THREE.Color(0x00ff00)
//material.matcap = texture
// material.transparent = true
// material.opacity = 0.5
// material.side = THREE.DoubleSide
//material.wireframe = true

// Add the material properties to the GUI for live editing
gui.add(material, 'roughness').name('Roughness').min(0).max(1).step(0.01)
gui.add(material, 'metalness').name('Metalness').min(0).max(1).step(0.01)


const BoxGeometry = new THREE.BoxGeometry(1, 1, 1)
const box = new THREE.Mesh(BoxGeometry, material)
box.position.set(-2, 0, 0)
scene.add(box)

const SphereGeometry = new THREE.SphereGeometry(1, 32, 32)
const sphere = new THREE.Mesh(SphereGeometry, material)
sphere.position.set(0, 0, 0)
scene.add(sphere)

const PlaneGeometry = new THREE.PlaneGeometry(1, 1)
const plane = new THREE.Mesh(PlaneGeometry, material)
plane.position.set(2, 0, 0)
plane.scale.set(2, 1, 1) // Scale the plane to make it larger
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

















//IMPORT THREE.JS LIBRARY
// import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
// import { RGBELoader } from 'three/examples/jsm/Addons.js'

// const canvas = document.querySelector('canvas.three')
// const gui = new GUI()   

// const resolution = {
//     width: window.innerWidth, 
//     height: window.innerHeight
// }

// const scene = new THREE.Scene()

// const camera = new THREE.PerspectiveCamera(75, resolution.width / resolution.height, 0.1, 1000)
// camera.position.set(0, 0, 5)
// scene.add(camera)

// const controls = new OrbitControls(camera, canvas)
// controls.target.set(0, 0, 0)
// controls.enableDamping = true

// const textureLoader = new THREE.TextureLoader()
// const texture = textureLoader.load('textures/wooden_gate_diff_4k.png')
// const aotexture = textureLoader.load('textures/wooden_gate_ao_4k.png')
// const dtexture = textureLoader.load('textures/wooden_gate_disp_4k.png')
// const rtexture = textureLoader.load('textures/wooden_gate_rough_4k.png')
// const mtexture = textureLoader.load('textures/wooden_gate_metal_4k.png')
// const ntexture = textureLoader.load('textures/wooden_gate_nor_gl_4k.png')
// texture.colorSpace = THREE.SRGBColorSpace
// texture.repeat.x = 1
// texture.repeat.y = 1
// texture.wrapS = THREE.RepeatWrapping
// texture.wrapT = THREE.RepeatWrapping
// texture.generateMipmaps = true
// texture.minFilter = THREE.NearestFilter
// texture.magFilter = THREE.NearestFilter
// const material = new THREE.MeshPhysicalMaterial()

// material.map = texture
// material.aoMap = aotexture
// material.aoMapIntensity = 1
// material.roughness = 1
// material.metalness = 1
// // material.iridescence =1
// // material.iridescenceIOR = 1
// // material.iridescenceThicknessRange = [100, 800]
// // material.transparent = true
// // material.displacementMap = dtexture
// // material.displacementScale = 0.01
// material.transmission = 1
// material.ior = 1.333
// material.thickness = 0.5
// material.roughnessMap = rtexture
// material.metalnessMap = mtexture
// material.normalMap = ntexture

// //material.normalScale = new THREE.Vector2(0.1, 0.1)
// gui.add(material, 'roughness').name('Color').min(0).max(1).step(0.01)
// gui.add(material, 'metalness').name('Color').min(0).max(1).step(0.01)
// // material.specular = new THREE.Color(0x00ffff)
// // material.shininess = 100
// //material.matcap = texture
// // material.side = THREE.DoubleSide
// // material.transparent = true
// // material.opacity = 0.5
// //material.wireframe = true
// const rgbeloader   = new RGBELoader()
// rgbeloader.load('textures/4k.hdr', (texture) => {
//     console.log(texture)
//     texture.mapping = THREE.EquirectangularReflectionMapping    
//     scene.background = texture
//     scene.environment = texture
// })

// const AmbientLight = new THREE.AmbientLight(0xffffff, 1)
// scene.add(AmbientLight)

// const pointLight = new THREE.PointLight(0xffffff, 30)
// pointLight.position.set(2, 3, 4)
// scene.add(pointLight)
// const sphere = new THREE.Mesh(
//     new THREE.SphereGeometry(1, 100, 100),
//     material
// )
// sphere.position.set(-3, 0, 0)
// scene.add(sphere)

// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1, 100, 100, 100),
//     material
// )
// cube.position.set(0, 0, 0)
// scene.add(cube)

// const plane = new THREE.Mesh(
//     new THREE.PlaneGeometry(1,1,100,100),
//     material
// )
// plane.position.set(3, 0, 0)
// scene.add(plane)

// const renderer = new THREE.WebGLRenderer({ 
//     canvas: canvas,
// })

// renderer.setSize(resolution.width, resolution.height)


// const clock = new THREE.Clock()
// const update = () => {
//     const time = clock.getElapsedTime()
//     sphere.rotation.y = time * 0.5
//     cube.rotation.x = time * 0.5
//     controls.update()
//     renderer.render(scene, camera)
//     window.requestAnimationFrame(update)
// }
// update()
