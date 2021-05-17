import './style.css'
import * as dat from 'dat.gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

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
// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Materials
 */
// Baked material
const bakedMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const houseMaterial = new THREE.MeshBasicMaterial({ color: 0xFFBA68 })
const trimMaterial = new THREE.MeshBasicMaterial({ color: 0xE7784B })
const grassMaterial = new THREE.MeshBasicMaterial({ color: 0x9BE717 })
const woodMaterial = new THREE.MeshBasicMaterial({ color: 0x63360A })
const pathMaterial = new THREE.MeshBasicMaterial({ color: 0xC8C8C8 })
const roofMaterial = new THREE.MeshBasicMaterial({ color: 0xA98156 })
const glassMaterial = new THREE.MeshBasicMaterial({ color: 0xE4FFA5 })
const doorKnobMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFE17 })



/**
 * Model
 */
 gltfLoader.load(
    'house.glb',
    (gltf) =>
    {

        scene.add(gltf.scene)


        const grass = gltf.scene.children.find((child) => child.name === 'Grass')
        grass.material = grassMaterial

        const house = gltf.scene.children.find((child) => child.name === 'House')
        house.material = houseMaterial

        const door = gltf.scene.children.find((child) => child.name === 'Door')
        door.material = trimMaterial

        const window = gltf.scene.children.find((child) => child.name === 'Window')
        window.material = trimMaterial

        const path = gltf.scene.children.find((child) => child.name === 'Path')
        path.material = pathMaterial

        const wood = gltf.scene.children.find((child) => child.name === 'Wood')
        wood.material = woodMaterial

        const glass = gltf.scene.children.find((child) => child.name === 'Glass')
        glass.material = glassMaterial

        const doorKnob = gltf.scene.children.find((child) => child.name === 'DoorKnob')
        doorKnob.material = doorKnobMaterial

        const roof = gltf.scene.children.find((child) => child.name === 'Roof')
        roof.material = roofMaterial
        console.log( gltf.scene.children)

    }
)

/**
 * Object
 */
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()
)

scene.add(cube)

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
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()