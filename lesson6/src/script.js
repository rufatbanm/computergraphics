//IMPORT THREE.JS LIBRARY
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/Addons.js'
import { FBXLoader } from 'three/examples/jsm/Addons.js'


const canvas = document.querySelector('canvas.three')
const scene = new THREE.Scene()


const resolution={
    width: window.innerWidth,
    height: window.innerHeight
}

// Create camera and add it to the scene
const camera = new THREE.PerspectiveCamera(75, resolution.width / resolution.height, 0.1, 1000)
camera.position.set(0, 0, 5)
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0, 0)
controls.enableDamping = true

const ambientLight = new THREE.AmbientLight(0xffffff, 2)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
directionalLight.castShadow = true 
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)


const gltfloader = new GLTFLoader()
const fbxloader = new FBXLoader()

// gltfloader.load(
//     "models/road/scene.gltf",
//     (model) =>{
//         console.log(model.scene)
//         model.scene.scale.set(0.005,0.005,0.005)
//         scene.add(model.scene)
//     }
// )
// gltfloader.load(
//     "models/lada/scene.gltf",
//     (model) =>{
//         console.log(model.scene)
//         model.scene.position.set(0,1,0)
//         model.scene.scale.set(0.5,0.5,0.5)
//         scene.add(model.scene)
//     }
// )

let mixer = null

fbxloader.load(
    "models/obama/obama.fbx",
    (model)=>{
        scene.add(model)
        mixer = new THREE.AnimationMixer(model)
        const animation = mixer.clipAction(model.animations[0])
        animation.play()
    }
)

const planeGeometry = new THREE.PlaneGeometry(5,5)
const material = new THREE.MeshPhysicalMaterial()
material.color = new THREE.Color(0x666666)
const plane = new THREE.Mesh(planeGeometry, material)
plane.rotation.x=-Math.PI/2
scene.add(plane)

const renderer = new THREE.WebGLRenderer({ 
    canvas: canvas,
})

renderer.setSize(resolution.width, resolution.height)
renderer.shadowMap.enabled = true   
renderer.shadowMap.type = THREE.PCFSoftShadowMap

const clock = new THREE.Clock()
let previousTime = 0

const update = () => {
    const time = clock.getElapsedTime()
    const delta = time-previousTime
    previousTime = time
    if(mixer!=null){
        mixer.update(delta)
    }
    controls.update();
    renderer.render(scene, camera)
    window.requestAnimationFrame(update)
}
update()

























//IMPORT THREE.JS LIBRARY
// import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import { FBXLoader, GLTFLoader } from 'three/examples/jsm/Addons.js'


// const canvas = document.querySelector('canvas.three')
// const scene = new THREE.Scene()


// const resolution={
//     width: window.innerWidth,
//     height: window.innerHeight
// }

// // Create camera and add it to the scene
// const camera = new THREE.PerspectiveCamera(75, resolution.width / resolution.height, 0.1, 1000)
// camera.position.set(0, 0, 5)
// scene.add(camera)

// const controls = new OrbitControls(camera, canvas)
// controls.target.set(0, 0, 0)
// controls.enableDamping = true

// const ambientLight = new THREE.AmbientLight(0xffffff, 2)
// scene.add(ambientLight)

// const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
// directionalLight.castShadow = true 
// directionalLight.position.set(5, 5, 5)
// scene.add(directionalLight)


// const gltfloader = new GLTFLoader()
// const fbxloader = new FBXLoader()
// let mixer = null
// fbxloader.load(
//     '/models/obama/obama.fbx', 
//     (model)=>{
//         scene.add(model)
//         mixer = new THREE.AnimationMixer(model)
//         const animation = mixer.clipAction(model.animations[0])
//         animation.play()
//     }
// )
// gltfloader.load(
//     '/models/lada/scene.gltf', 
//     (model) =>{
//         scene.add(model.scene)
//         const stuff = [...model.scene.children]
//         stuff.forEach(obj => {
//             console.log(obj)
//         });
//     }
// )
// const planeGeometry = new THREE.PlaneGeometry(5,5)
// const material = new THREE.MeshPhysicalMaterial()
// material.color = new THREE.Color(0x666666)
// const plane = new THREE.Mesh(planeGeometry, material)
// plane.rotation.x=-Math.PI/2
// scene.add(plane)

// const renderer = new THREE.WebGLRenderer({ 
//     canvas: canvas,
// })

// renderer.setSize(resolution.width, resolution.height)
// renderer.shadowMap.enabled = true   
// renderer.shadowMap.type = THREE.PCFSoftShadowMap

// const clock = new THREE.Clock()
// let previousTime = 0

// const update = () => {
//     const time = clock.getElapsedTime()
//     const delta = time - previousTime
//     previousTime = time
//     if(mixer!=null){
//         mixer.update(delta)
//     }
//     controls.update();
//     renderer.render(scene, camera)
//     window.requestAnimationFrame(update)
// }
// update()