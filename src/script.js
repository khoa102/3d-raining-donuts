import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import {FontLoader} from "three/examples/jsm/loaders/FontLoader.js";
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry.js";
import { MeshMatcapMaterial } from "three";

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
let matcapTexture1 = textureLoader.load('/textures/matcaps/1.png')
let matcapTexture2 = textureLoader.load('/textures/matcaps/2.png')
let matcapTexture3 = textureLoader.load('/textures/matcaps/3.png')
let matcapTexture4 = textureLoader.load('/textures/matcaps/4.png')
let matcapTexture5 = textureLoader.load('/textures/matcaps/5.png')
let matcapTexture6 = textureLoader.load('/textures/matcaps/6.png')
let matcapTexture7 = textureLoader.load('/textures/matcaps/7.png')
let matcapTexture8 = textureLoader.load('/textures/matcaps/8.png')

const materialArray = []
const material1 = new MeshMatcapMaterial({matcap: matcapTexture1})
const material2 = new MeshMatcapMaterial({matcap: matcapTexture2})
const material3 = new MeshMatcapMaterial({matcap: matcapTexture3})
const material4 = new MeshMatcapMaterial({matcap: matcapTexture4})
const material5 = new MeshMatcapMaterial({matcap: matcapTexture5})
const material6 = new MeshMatcapMaterial({matcap: matcapTexture6})
const material7 = new MeshMatcapMaterial({matcap: matcapTexture7})
const material8 = new MeshMatcapMaterial({matcap: matcapTexture8})
materialArray.push(material1, material2, material3, material4, material5, material6, material7, material8)


/**
 * CONSTANT
 */
const NUMBER_OF_MATERIAL = materialArray.length - 1
const NUMBER_OF_DONUT = 100

/**
 * Fonts
 */
let textGeometry = null
let text = null
const fontLoader = new FontLoader()
fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
    textGeometry = new TextGeometry('Khoa Tran Portfolio', {
        font: font,
        size: 0.5,
        height: 0.2,
        curveSegments: 5,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 4
    })
    // textGeometry.computeBoundingBox()
    // textGeometry.translate(
    //     - textGeometry.boundingBox.max.x * 0.5,
    //     - textGeometry.boundingBox.max.y * 0.5,
    //     - textGeometry.boundingBox.max.z * 0.5)
    textGeometry.center()

    text = new THREE.Mesh(textGeometry, material2)
    // text.material.wireframe = true
    scene.add(text)
})

/**
 * Objects
 */
const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
const donutArray = []
for (let i = 0; i < NUMBER_OF_DONUT; i++) {
    const materialIndex = Math.round(Math.random() * NUMBER_OF_MATERIAL)
    const donut = new THREE.Mesh(donutGeometry, materialArray[materialIndex])
    donut.position.x = (Math.random() - 0.5) * 10
    donut.position.y = (Math.random() - 0.5) * 5 + 5 // y is at least 5 above
    donut.position.z = (Math.random() - 0.5) * 10

    donut.rotation.x = Math.random() * Math.PI
    donut.rotation.y = Math.random() * Math.PI

    const scale = Math.random()
    donut.scale.x = scale
    donut.scale.y = scale
    donut.scale.z = scale

    donutArray.push(donut)
    scene.add(donut)
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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 2
camera.position.y = 1.3
camera.position.z = 3
scene.add(camera)

gui.add(camera.position, 'x').min(0).max(10).step(0.001)
gui.add(camera.position, 'y').min(0).max(10).step(0.001)
gui.add(camera.position, 'z').min(0).max(10).step(0.001)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
// const clock = new THREE.Clock()

const tick = () =>
{
    // const elapsedTime = clock.getElapsedTime()

    // update donut
    for (let i = 0; i < NUMBER_OF_DONUT; i++) {
        if (donutArray[i].position.y < -5) {
            const materialIndex = Math.round(Math.random() * NUMBER_OF_MATERIAL)
            donutArray[i].position.y = (Math.random() - 0.5) * 5 + 5 // y is at least 5 above
            donutArray[i].material = materialArray[materialIndex]
        }
        donutArray[i].position.y -= 0.01
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()