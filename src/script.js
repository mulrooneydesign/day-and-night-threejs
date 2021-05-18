import './style.css'
import * as dat from 'dat.gui'
import * as THREE from 'three'
//import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { MeshToonMaterial } from 'three'


/**
 * Base
 */
// Debug
const gui = new dat.GUI({
    width: 400
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Materials
 */
const bakedMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 })
const houseMaterial = new THREE.MeshStandardMaterial({ color: 0xFFBA68 })
const trimMaterial = new THREE.MeshStandardMaterial({ color: 0xE7784B })
const grassMaterial = new THREE.MeshStandardMaterial({ color: 0x9BE717 })
const woodMaterial = new THREE.MeshStandardMaterial({ color: 0x63360A })
const pathMaterial = new THREE.MeshStandardMaterial({ color: 0xC8C8C8 })
const roofMaterial = new THREE.MeshStandardMaterial({ color: 0xA98156 })
const glassMaterial = new THREE.MeshStandardMaterial({ color: 0xE4FFA5 })
const doorKnobMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFE17 })
const sunMaterial = new THREE.MeshStandardMaterial({ color: 0xE79900 })
const moonMaterial = new THREE.MeshBasicMaterial({ color: 0x71b6f2 })

/**
 * Model
 */

const parameters = {
    color: 0x1722,
    sunDistance: 10,
    sunAngle: - Math.PI * 0.5
}




 gltfLoader.load(
    'house_extended.glb',
    (gltf) =>
    {

        scene.add(gltf.scene)

        const grass = gltf.scene.children.find((child) => child.name === 'Grass')
        grass.material = grassMaterial
        grass.receiveShadow = true
        grass.castShadow = true

        const house = gltf.scene.children.find((child) => child.name === 'House')
        house.material = houseMaterial
        house.receiveShadow = true
        house.castShadow = true

        const door = gltf.scene.children.find((child) => child.name === 'Door')
        door.material = trimMaterial
        door.receiveShadow = true
        door.castShadow = true

        const window = gltf.scene.children.find((child) => child.name === 'Window')
        window.material = trimMaterial
        window.receiveShadow = true
        window.castShadow = true

        const path = gltf.scene.children.find((child) => child.name === 'Path')
        path.material = pathMaterial
        path.receiveShadow = true
        path.castShadow = true

        const wood = gltf.scene.children.find((child) => child.name === 'Wood')
        wood.material = woodMaterial
        wood.receiveShadow = true
        wood.castShadow = true

        const glass = gltf.scene.children.find((child) => child.name === 'Glass')
        glass.material = glassMaterial
        glass.receiveShadow = true
        glass.castShadow = true

        const doorKnob = gltf.scene.children.find((child) => child.name === 'DoorKnob')
        doorKnob.material = doorKnobMaterial
        doorKnob.receiveShadow = true
        doorKnob.castShadow = true

        const sun = gltf.scene.children.find((child) => child.name === 'Sun')
        sun.material = sunMaterial
        parameters.sun = sun
        parameters.sun.receiveShadow = true
        parameters.sun.castShadow = true

        const moon = gltf.scene.children.find((child) => child.name === 'Moon')
        moon.material = moonMaterial
        parameters.moon = moon

        const cloud = gltf.scene.children.find((child) => child.name === 'Cloud')
        cloud.material = pathMaterial

        const roof = gltf.scene.children.find((child) => child.name === 'Roof')
        roof.material = roofMaterial
        roof.receiveShadow = true
        roof.castShadow = true
        console.log( gltf.scene.children)
    }
)

/**
 * Lights
 */
const sunLight = new THREE.PointLight( 0xffffff )
sunLight.castShadow = true
sunLight.position.x = 6
scene.add( sunLight )

const moonLight = new THREE.PointLight( 0x0000ff )
moonLight.castShadow = true
moonLight.position.x = 6
scene.add( moonLight )


const pointLightHelper = new THREE.PointLightHelper( moonLight, 1 )
scene.add( pointLightHelper )


const ambientLight = new THREE.AmbientLight( 0xffffff, 0.05 )
scene.add( ambientLight )


/**
 * Clearcolor
 */
const skyColor = {
    color: '0x0000ff'
}



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.x = -20
camera.position.y = 10
camera.position.z = 14
camera.lookAt(new THREE.Vector3(0,0,0))
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.shadowMap.enabled = true
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()


    // Update controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    //
    const sunAngle = parameters.sunAngle

    if(parameters.sun) {

        //Sun Settings
        parameters.sun.rotation.z -= 0.01 
        parameters.sun.position.z = parameters.sunDistance * Math.sin(sunAngle)
        parameters.sun.position.y = parameters.sunDistance*  Math.cos(sunAngle)

        sunLight.position.z = parameters.sunDistance * Math.sin(sunAngle)
        sunLight.position.y = parameters.sunDistance *  Math.cos(sunAngle)

        sunLight.intensity = Math.cos(sunAngle)

        //Moon Settings

        parameters.moon.position.z = - parameters.sunDistance * Math.sin(sunAngle)
        parameters.moon.position.y = - parameters.sunDistance *  Math.cos(sunAngle)

        moonLight.position.z = - parameters.sunDistance * Math.sin(sunAngle)
        moonLight.position.y = - parameters.sunDistance *  Math.cos(sunAngle)

        moonLight.intensity = 10

        //Ambient Light
        ambientLight.intensity  = Math.cos(sunAngle)


    }

    //Sun animation


    //Udpate sky color
    renderer.setClearColor(new THREE.Color(parameters.color));

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()


//Debug Objects
gui.addColor(parameters, 'color').onChange(()=>{
    renderer.setClearColor(new THREE.Color(parameters.color));
})

gui.add(parameters, 'sunAngle').min(- Math.PI * 2).max(Math.PI * 2).step(0.001).name('Sun Angle')

gui.add(parameters, 'sunDistance').min(0).max(20).step(0.001).name('Sun Distance')
gui.add(sunLight, 'intensity').min(0).max(10).step(0.001).name('Point Light')
gui.add(sunLight.position, 'x').min(0).max(20).step(0.001).name('Sunlight Position X')
gui.add(sunLight.position, 'y').min(0).max(20).step(0.001).name('Sunlight Position Y')
gui.add(sunLight.position, 'z').min(0).max(20).step(0.001).name('Sunlight Position Z')
