//IMPORT THREE.JS LIBRARY
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { RectAreaLight } from 'three'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'



const canvas = document.querySelector('canvas.three')
const gui = new GUI()

const scene = new THREE.Scene()

const resolution={
    width: window.innerWidth,
    height: window.innerHeight
}


const camera = new THREE.PerspectiveCamera(75, resolution.width / resolution.height, 0.1, 1000)
camera.position.set(0, 0, 5)
scene.add(camera)

const controls = new OrbitControls(camera, canvas)

controls.target.set(0, 0, 0)

controls.enableDamping = true

const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('textures/wooden_gate_diff_4k.png')
const shadow = textureLoader.load('textures/simpleShadow.jpg')
const aotexture = textureLoader.load('textures/wooden_gate_ao_4k.png')
const rtexture = textureLoader.load('textures/wooden_gate_rough_4k.png')
const mtexture = textureLoader.load('textures/wooden_gate_metal_4k.png')
const ntexture = textureLoader.load('textures/wooden_gate_nor_dx_4k.png')



const water = textureLoader.load('textures/floor/water.png')
water.wrapS = THREE.RepeatWrapping
water.wrapT = THREE.RepeatWrapping
water.repeat.set(3, 3) // Adjust the repeat value as needed


texture.colorSpace = THREE.SRGBColorSpace

const rgbeloader = new RGBELoader()
rgbeloader.load('textures/house.hdr', (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping    
    scene.background = texture
    scene.environment = texture
})

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(5, 5, 5)
directionalLight.castShadow = true // Enable shadow casting


const material = new THREE.MeshPhysicalMaterial()
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

const watermaterial = new THREE.MeshPhysicalMaterial()
watermaterial.color = new THREE.Color(0xd4f1f9) // Set the base color
watermaterial.normalMap = water
watermaterial.normalScale = new THREE.Vector2(10, 10)
watermaterial.metalness = 0.1
watermaterial.roughness = 0.1
watermaterial.transmission  = 0.9
watermaterial.ior = 1.33 // Index of refraction for water
watermaterial.thickness = 0.1 // Thickness of the water layer

gui.add(watermaterial, 'roughness').name('Floor Roughness').min(0).max(1).step(0.01)
gui.add(watermaterial, 'metalness').name('Floor Metalness').min(0).max(1).step(0.01)


gui.add(material, 'roughness').name('Roughness').min(0).max(1).step(0.01)
gui.add(material, 'metalness').name('Metalness').min(0).max(1).step(0.01)


// const BoxGeometry = new THREE.BoxGeometry(1, 1, 1)
// const box = new THREE.Mesh(BoxGeometry, material)
// box.castShadow = true // Enable shadow casting on the box
// box.position.set(-2, 0, 0)
// scene.add(box)

const SphereGeometry = new THREE.SphereGeometry(1, 32, 32)
const sphere = new THREE.Mesh(SphereGeometry, material)
sphere.castShadow = true // Enable shadow casting on the sphere
sphere.position.set(0, 0, 0)
scene.add(sphere)

const floorgeometry = new THREE.PlaneGeometry(1, 1, 200, 200)
const floor = new THREE.Mesh(floorgeometry, watermaterial)
floor.position.set(0, -1, 0)
floor.rotation.x = -Math.PI / 2 
floor.scale.set(15, 15, 15) 
floor.receiveShadow = true // Enable shadow receiving on the floor
scene.add(floor)


// Create a renderer and set its size to the resolution
const renderer = new THREE.WebGLRenderer({ 
    canvas: canvas,
})
renderer.setSize(resolution.width, resolution.height)
renderer.shadowMap.enabled = true   
renderer.shadowMap.type = THREE.PCFSoftShadowMap // Use soft shadows

const clock = new THREE.Clock()
// Update function to render the scene and update the controls
// This function will be called repeatedly using requestAnimationFrame
const update = () => {

    const time = clock.getElapsedTime() 
    water.offset.x = time*0.025
    water.offset.y = Math.sin(time)*0.025
    sphere.position.y = Math.abs(Math.sin(time*2)) // Make the sphere bounce up and down
    sphere.position.x = Math.cos(time) * 2 // Make the sphere move left and right
    sphere.position.z = Math.sin(time) * 2 // Make the sphere move forward and backward
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(update)
}
update()