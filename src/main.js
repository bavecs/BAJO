import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const primaryColor = new THREE.Color(0x050057)

const canvasDIV = document.querySelector('#bg');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


const renderer = new THREE.WebGLRenderer({
    canvas: canvasDIV,
    antialias: true
})

var scrollPosition = 0
var model

renderer.setSize(window.innerWidth,window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
camera.position.setZ(30);


const dirLight = new THREE.DirectionalLight( 0xffffff, 9 );
dirLight.position.set( 0, 20, 10 );
scene.add( dirLight );



const pointlight = new THREE.PointLight(0x9998f9, 200)

pointlight.position.set(0,1,14)

scene.add(pointlight  )

const loader = new GLTFLoader();

const materialGlass = new THREE.MeshPhysicalMaterial( {
    transparent: true,
    transmission: .5,
    metalness: 2,
    roughness: 0.1,
    ior: 1,
    thickness: .2,
    specularIntensity: 1,
    specularColor: 0xffffff,
    side: THREE.FrontSide,
    color: primaryColor

  } );

  const material2 = new THREE.MeshPhysicalMaterial({
    metalness: 1,
    roughness: 0.3,
    transparent: false,
    transmission: 1.4,
    color: 0x7A7AED
});

loader.load( '/minta-modern-export.gltf', function ( gltf ) {
    const root = gltf.scene

    let csikok = root.getObjectByName('csíkok')
    let savok = root.getObjectByName('sávok')
    let kitoltes = root.getObjectByName('kitöltés')

    kitoltes.material = material2

    savok.material = csikok.material = materialGlass

    root.rotation.x = Math.PI / 3 
    root.position.y = 5

    model = root
    scene.add(model)

}, undefined, ( error ) => console.error( error ))


const interaction = () => {
    requestAnimationFrame(interaction)
    renderer.render(scene, camera)
}


const mousemove = (e) => {
    const client = (e.touches) ? e.touches[0] : e;
        pointlight.position
        .setX(
            (client.clientX - window.innerWidth / 2) /10 * 0.55
        )
        .setY(
            (client.clientY - window.innerHeight / 2) /10 * -.5
        )
}

document.addEventListener("mousemove", mousemove)
document.addEventListener("touchmove", mousemove)

document.addEventListener("scroll", () => {
    scrollPosition = window.scrollY / document.body.clientHeight
    if (model) {
        model.position.y = 5 + (scrollPosition * 20)
        model.rotation.y = scrollPosition
        model.rotation.x = Math.PI / 3 - (scrollPosition/2)
        dirLight.intensity = 9 - (scrollPosition * 17)
    }
})

 interaction()
