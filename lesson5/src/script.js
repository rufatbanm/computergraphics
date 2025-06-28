//IMPORT THREE.JS LIBRARY
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { RectAreaLight } from 'three'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'
import { roughness } from 'three/tsl'



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

// Create a RGBELoader to load the HDR texture
// The RGBELoader will load the texture from the specified path and return a texture object
const rgbeloader = new RGBELoader()
const hdrTexture = rgbeloader.load('textures/4k.hdr', (texture) => {
    // Set the mapping of the texture to equirectangular reflection mapping
    texture.mapping = THREE.EquirectangularReflectionMapping,
    // Set the background and environment of the scene to the HDR texture
    scene.background = texture
    scene.environment = texture
})

// Create a texture loader to load the texture image
// The texture will be a wall image that will be repeated on the box
const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('textures/wooden_gate_diff_4k.png')
const aotexture = textureLoader.load('textures/wooden_gate_ao_4k.png')
const rtexture = textureLoader.load('textures/wooden_gate_rough_4k.png')
const mtexture = textureLoader.load('textures/wooden_gate_metal_4k.png')
const ntexture = textureLoader.load('textures/wooden_gate_nor_dx_4k.png')
texture.colorSpace = THREE.SRGBColorSpace

//Fake shadow texture
// This texture will be used to create a shadow effect on the floor
const shadow = textureLoader.load('textures/simpleShadow.jpg')

//Ambient light is a light that illuminates all objects equally, without casting shadows
// It is useful for simulating the ambient light in a scene
const ambientLight = new THREE.AmbientLight(0xffffff, 2)
//scene.add(ambientLight)

// Create a directional light that will cast shadows
// Directional light is a light that has a direction and can cast shadows
const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
directionalLight.castShadow = true 
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

// Set the shadow properties of the directional light
// The shadow will be cast from the light's position to the scene
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024
// The shadow camera will be used to render the shadow
// The shadow camera will be positioned at the light's position and will look at the origin
directionalLight.shadow.camera.near = 0.5 // default
directionalLight.shadow.camera.far = 500 // default    

// Set the shadow camera's frustum size
// The frustum size will determine the size of the shadow camera's view
directionalLight.shadow.camera.left = -50 // default         
directionalLight.shadow.camera.right = 50 // default
directionalLight.shadow.camera.top = 50 // default
directionalLight.shadow.camera.bottom = -50 // default

// Create a camera helper to visualize the shadow camera's frustum
// The camera helper will show the shadow camera's view in the scene
const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
//scene.add(directionalLightCameraHelper)


const hemisphericLight = new THREE.HemisphereLight(0x0000ff, 0xff0000, 1)
hemisphericLight.position.set(1, 1, 1)
//scene.add(hemisphericLight)

// Create a point light that will cast shadows
// Point light is a light that has a position and can cast shadows
const pointLight = new THREE.PointLight(0xffff00, 10)
pointLight.position.set(-3,6, 0)

//scene.add(pointLight)

pointLight.castShadow = true // Enable shadow casting on the point light
pointLight.shadow.mapSize.width = 512
pointLight.shadow.mapSize.height = 512 

pointLight.shadow.camera.near = 0.5
pointLight.shadow.camera.far = 500 
pointLight.shadow.camera.fov = 100

// Create a camera helper to visualize the point light's shadow camera
const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
//scene.add(pointLightCameraHelper)


const spotLight = new THREE.SpotLight(0xffffff, 5, 10)
spotLight.position.set(0, 2, 0) 
spotLight.target.position.set(-1, 0, 0)
spotLight.castShadow = true // Enable shadow casting on the spot light
spotLight.shadow.mapSize.width = 512
spotLight.shadow.mapSize.height = 512
spotLight.shadow.camera.near = 0.5 
spotLight.shadow.camera.far = 5
//scene.add(spotLight)
//scene.add(spotLight.target)

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
//scene.add(spotLightCameraHelper)

const rectAreaLight = new THREE.RectAreaLight(0x3e00b8, 3, 3, 3)
rectAreaLight.position.set(-1.5, 0, 1.5)
rectAreaLight.lookAt(0, 0, 0)
//scene.add(rectAreaLight)

//Create a helpers for the lights to visualize their positions and directions
//These helpers will show the light's position, direction, and frustum in the scene

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 1)
scene.add(directionalLightHelper)

const hemisphericLightHelper = new THREE.HemisphereLightHelper(hemisphericLight, 1)
//scene.add(hemisphericLightHelper)

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.5)
//scene.add(pointLightHelper)

const spotLightHelper = new THREE.SpotLightHelper(spotLight)
//scene.add(spotLightHelper)

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
//scene.add(rectAreaLightHelper)


const material = new THREE.MeshStandardMaterial()
material.color = new THREE.Color(0xeeeeee) // Set the base color to white
material.map = texture
material.aoMap = aotexture
material.aoMapIntensity = 1
material.roughness = 1
material.metalness = 1
material.roughnessMap = rtexture
material.metalnessMap = mtexture
material.normalMap = ntexture
material.normalScale = new THREE.Vector2(1, 1)

gui.add(material, 'roughness').name('Roughness').min(0).max(1).step(0.01)
gui.add(material, 'metalness').name('Metalness').min(0).max(1).step(0.01)


const BoxGeometry = new THREE.BoxGeometry(1, 1, 1)
const box = new THREE.Mesh(BoxGeometry, material)
box.castShadow = true // Enable shadow casting on the box
box.position.set(5, 0.5, 0)
scene.add(box)

const SphereGeometry = new THREE.SphereGeometry(1, 32, 32)
const sphere = new THREE.Mesh(SphereGeometry, material)
sphere.position.set(0, 0, 0)
scene.add(sphere)

const floorgeometry = new THREE.PlaneGeometry(5, 5)
const floorMaterial = new THREE.MeshPhysicalMaterial()
floorMaterial.color = new THREE.Color(0x666666) // Set the base color to white
floorMaterial.metalness = 0.5  // Set the metalness to 0.1 for a slightly metallic look
floorMaterial.roughness = 0.2 // Set the roughness to 0.   
gui.add(floorMaterial, 'roughness').name('Floor Roughness').min(0).max(1).step(0.01)
gui.add(floorMaterial, 'metalness').name('Floor Metalness').min(0).max(1).step(0.01)


const floor = new THREE.Mesh(floorgeometry, floorMaterial)
floor.position.set(0, 0, 0)
floor.rotation.x = -Math.PI / 2 // Rotate the floor to be horizontal
floor.scale.set(15, 15, 15) // Scale the plane to make it larger
floor.receiveShadow = true // Enable shadow receiving on the floor
scene.add(floor)

const sphereShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.MeshBasicMaterial({
        color: 0x0000000,
        transparent: true,
        alphaMap: shadow
    })
)
sphereShadow.rotation.x = -Math.PI / 2 
sphereShadow.position.y = floor.position.y + 0.001
scene.add(sphereShadow)


// Create a renderer and set its size to the resolution
const renderer = new THREE.WebGLRenderer({ 
    canvas: canvas,
})
renderer.setSize(resolution.width, resolution.height)
//enable shadow maps in the renderer
renderer.shadowMap.enabled = true   
renderer.shadowMap.type = THREE.PCFSoftShadowMap // Use soft shadows

const clock = new THREE.Clock()

// Update function to render the scene and update the controls
// This function will be called repeatedly using requestAnimationFrame
const update = () => {

    const time = clock.getElapsedTime()

    sphere.position.y = Math.abs(Math.sin(time*2)) +1// Make the sphere bounce up and down
    sphere.position.x = Math.cos(time) * 2 // Make the sphere move left and right
    sphere.position.z = Math.sin(time) * 2 // Make the sphere move forward and backward

    // Update the fake shadows poisiton and opacity based on the sphere's position
    sphereShadow.position.x = sphere.position.x
    sphereShadow.position.z = sphere.position.z
    sphereShadow.material.opacity = (1 - sphere.position.y *0.4)

    controls.update();
    renderer.render(scene, camera)
    window.requestAnimationFrame(update)
}
update()