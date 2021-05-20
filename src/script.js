import './style.css'
import * as dat from 'dat.gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import vertexShader from '../shaders/sky/vertex.glsl'
import fragmentShader from '../shaders/sky/fragment.glsl'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'

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
 * Materials
 */

const houseMaterial = new THREE.MeshStandardMaterial({ color: 0xFFBA68 })
const trimMaterial = new THREE.MeshStandardMaterial({ color: 0xE7784B })
const grassMaterial = new THREE.MeshStandardMaterial({ color: 0x9BE717 })
const woodMaterial = new THREE.MeshStandardMaterial({ color: 0x63360A })
const pathMaterial = new THREE.MeshStandardMaterial({ color: 0xC8C8C8 })
const roofMaterial = new THREE.MeshStandardMaterial({ color: 0xA98156 })
const glassMaterial = new THREE.MeshStandardMaterial({ color: 0xE4FFA5 })
const doorKnobMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFE17 })
const sunMaterial = new THREE.MeshStandardMaterial({ color: 0xE79900, emissive: 0xE79900 })
const moonMaterial = new THREE.MeshBasicMaterial({ color: 0x71b6f2 })

/**
 * Parameters
 */

const parameters = {
    color: 0x1722,
    sunDistance: 10,
    sunAngle: - Math.PI * 0.5
}

const uniforms = {
    uSunAngle: { value: parameters.sunAngle }
}


/**
 * Custom Materials
 */
const skyMaterial = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: uniforms    
})

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
 * Model
 */
 gltfLoader.load(
    'house_extended.glb',
    (gltf) =>
    {

        scene.add(gltf.scene)

        const modelChildren = gltf.scene.children

        gltf.scene.traverse((child) => { 
            child.receiveShadow = true
            child.castShadow = true
        })

        const sky = modelChildren.find((child) => child.name === 'Sky')
        sky.material = skyMaterial

        const grass = modelChildren.find((child) => child.name === 'Grass')
        grass.material = grassMaterial

        const house = modelChildren.find((child) => child.name === 'House')
        house.material = houseMaterial
  
        const door = modelChildren.find((child) => child.name === 'Door')
        door.material = trimMaterial

        const window = modelChildren.find((child) => child.name === 'Window')
        window.material = trimMaterial

        const path = modelChildren.find((child) => child.name === 'Path')
        path.material = pathMaterial

        const wood = modelChildren.find((child) => child.name === 'Wood')
        wood.material = woodMaterial

        const glass = modelChildren.find((child) => child.name === 'Glass')
        glass.material = glassMaterial

        const doorKnob = modelChildren.find((child) => child.name === 'DoorKnob')
        doorKnob.material = doorKnobMaterial

        const sun = modelChildren.find((child) => child.name === 'Sun')
        sun.material = sunMaterial
        parameters.sun = sun
        parameters.sun.receiveShadow = true

        const moon = modelChildren.find((child) => child.name === 'Moon')
        moon.material = moonMaterial
        parameters.moon = moon
        
        const cloud = modelChildren.find((child) => child.name === 'Cloud')
        cloud.material = pathMaterial

        const roof = modelChildren.find((child) => child.name === 'Roof')
        roof.material = roofMaterial
    }
)

/**
 * Lights
 */
const sunLight = new THREE.PointLight( 0xffffff )
sunLight.castShadow = true
sunLight.position.x = 8
sunLight.shadow.mapSize.width = 1024 * 2; // default
sunLight.shadow.mapSize.height = 1024 * 2; // default
sunLight.shadow.camera.near = 0.5; // default
sunLight.shadow.camera.far = 500; // default
scene.add( sunLight )

const moonLight = new THREE.PointLight( 0x0000ff )
moonLight.castShadow = true
moonLight.position.x = 8
moonLight.shadow.mapSize.width = 1024 * 2;
moonLight.shadow.mapSize.height = 1024 * 2;
moonLight.shadow.camera.near = 0.5;
moonLight.shadow.camera.far = 500;
scene.add( moonLight )

const ambientLight = new THREE.AmbientLight( 0xffffff, 0.05 )
scene.add( ambientLight )

const light = new THREE.HemisphereLight( 0x1f33, 0x220b00, 0.5 );
scene.add( light );


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
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 200)
camera.position.x = -20
camera.position.y = 10
camera.position.z = 14
camera.lookAt(new THREE.Vector3(0,0,0))
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

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
 * Post processing
 */
const effectComposer = new EffectComposer(renderer)
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
effectComposer.setSize(sizes.width, sizes.height)

const bloomPass = new UnrealBloomPass()
bloomPass.enabled = true
bloomPass.strength = 0.182
bloomPass.radius = 2
bloomPass.threshold = 0.891

const renderPass = new RenderPass(scene, camera)

effectComposer.addPass(renderPass)
effectComposer.addPass(bloomPass)



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
    //renderer.render(scene, camera)
    effectComposer.render()

    //Sun Angle
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
        parameters.moon.rotation.z -= 0.01 
        parameters.moon.position.z = - parameters.sunDistance * Math.sin(sunAngle)
        parameters.moon.position.y = - parameters.sunDistance *  Math.cos(sunAngle)

        moonLight.position.z = - parameters.sunDistance * Math.sin(sunAngle)
        moonLight.position.y = - parameters.sunDistance *  Math.cos(sunAngle)

        moonLight.intensity = 10

    }

    //Udate Uniforms
    uniforms.uSunAngle.value = parameters.sunAngle / Math.PI

    //Get Hour
    const hour = new Date().getHours();

    //Ambient Light
    ambientLight.intensity  = Math.cos(sunAngle) * 0.45

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

//GUI 
gui.add(parameters, 'sunAngle').min(- Math.PI).max(Math.PI).step(0.001).name('Sun Angle').onFinishChange(
    () => {
        console.log(skyMaterial.uniforms.uSunAngle)
    }
)


gui.add(bloomPass, 'enabled')
gui.add(bloomPass, 'strength').min(0).max(2).step(0.001)
gui.add(bloomPass, 'radius').min(0).max(2).step(0.001)
gui.add(bloomPass, 'threshold').min(0).max(1).step(0.001)