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


const fbxloader = new FBXLoader()

const sphere1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32), 
    new THREE.MeshStandardMaterial({ color: 0x00ff00 })
)
const sphere2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32), 
    new THREE.MeshStandardMaterial({ color: 0x00ff00 })
)

sphere1.position.set(2, 0, 0)
sphere2.position.set(-2, 0, 0)  
scene.add(sphere1, sphere2)


let mixer = null
let animation = null
let obama = null
fbxloader.load(
    "models/obama/obama.fbx",
    (model)=>{
        obama = model 
        scene.add(model)
        mixer = new THREE.AnimationMixer(model)
        animation = mixer.clipAction(model.animations[0])
    }
)

const renderer = new THREE.WebGLRenderer({ 
    canvas: canvas,
})

renderer.setSize(resolution.width, resolution.height)

const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (event) =>
{
    mouse.x = event.clientX / resolution.width * 2 - 1
    mouse.y = - (event.clientY / resolution.height) * 2 + 1
})

window.addEventListener('click', () => {
    if(lastIntersect)
    {
        switch(lastIntersect.object)
        {
            case sphere1:
                console.log('click on sphere1')
                break
            case sphere2:
                console.log('click on sphere2')
                break
        }
    }
    if(obama){
        if(animation){
            if(animation.isRunning())
            {
                animation.stop()
            }
            else
            {
                animation.play()
            }
        }
    }
})

const clock = new THREE.Clock()

let lastIntersect= null

const update = () => {

    if(mixer)
    {
        mixer.update(clock.getDelta())
    }
    
    sphere1.position.y = Math.sin(clock.getElapsedTime() * 2) * 2
    sphere2.position.y = Math.sin(clock.getElapsedTime()) * 2

    const raycaster = new THREE.Raycaster()
    // const rayOrigin = new THREE.Vector3(-3, 0, 0)
    // const rayDirection = new THREE.Vector3(10, 0, 0)
    // rayDirection.normalize()
    // raycaster.set(rayOrigin, rayDirection)

    const objectsToTest = [sphere1, sphere2]
    raycaster.setFromCamera(mouse, camera)

    const intersects = raycaster.intersectObjects(objectsToTest)

    // if(obama)
    // {
    //     // Test intersect with a model
    //     const intersectsWithModel = raycaster.intersectObject(obama, true)
    //     if(intersectsWithModel.length)
    //     {
    //         obama.scale.set(1.2, 1.2, 1.2)
    //     }
    //     else
    //     {
    //         obama.scale.set(1, 1, 1)
    //     }

    // }

    if(intersects.length)
    {
        lastIntersect = intersects[0]
    }
    else
    {
        lastIntersect = null
    }
    
    for(const object of objectsToTest)
    {
        object.material.color.set('#ff0000')
    }

    for(const intersect of intersects)
    {
        intersect.object.material.color.set('#0000ff')
    }


    
    controls.update();
    renderer.render(scene, camera)
    window.requestAnimationFrame(update)
}
update()


    // if(mixer)
    // {
    //     mixer.update(clock.getDelta())
    // }
    // //sphere.position.y = Math.sin(clock.getElapsedTime() * 3) * 2
    // sphere1.position.y = Math.sin(clock.getElapsedTime() * 2) * 2
    // sphere2.position.y = Math.sin(clock.getElapsedTime()) * 2


    // // const raycaster = new THREE.Raycaster()
    // // const rayOrigin = new THREE.Vector3(-3, 0, 0)
    // // const rayDirection = new THREE.Vector3(10, 0, 0)
    // // rayDirection.normalize()
    // // raycaster.set(rayOrigin, rayDirection)

    // // const intersects = raycaster.intersectObjects([sphere, sphere1, sphere2])
    // const objectsToTest = [sphere1, sphere2]
    // const raycaster = new THREE.Raycaster()

    // raycaster.setFromCamera(mouse, camera)
    // const intersects = raycaster.intersectObjects(objectsToTest)
    // // if(obama)
    // // {
    // //     // Test intersect with a model
    // //     const intersectsWithModel = raycaster.intersectObject(obama, true)
    // //     if(intersectsWithModel.length)
    // //     {
    // //         obama.scale.set(1.2, 1.2, 1.2)
    // //         lastIntersect = intersectsWithModel[0]
    // //     }
    // //     else
    // //     {
    // //         obama.scale.set(1, 1, 1)
    // //         lastIntersect = null
    // //     }
    // // }   
    
    // for(const object of objectsToTest)
    // {
        
    //     object.material.color.set('#ff0000')
    // }

    // for(const intersect of intersects)
    // {
    //     intersect.object.material.color.set('#0000ff')
    // }

    
    // if(intersects.length)
    // {
    //     console.log('mouse enter')
    //     lastIntersect = intersects[0]
    // }
    // else 
    // {
    //     console.log('mouse leave')
    //     lastIntersect = null
    // }