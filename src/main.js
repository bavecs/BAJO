import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const primaryColor = new THREE.Color(0x050057)

const canvasDIV = document.querySelector('#bg');

let fadeInArray = document.querySelectorAll(".fadeIn");
let isMobile = false
if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
    // true for mobile device
    isMobile = true
}

var scrollPosition = 0
var model

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: canvasDIV,
    antialias: true
})

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
camera.position.setZ(30);

const dirLight = new THREE.DirectionalLight(0xffffff, 5);
dirLight.position.set(0, 20, 10);
scene.add(dirLight);


const pointlight = new THREE.PointLight(0x9998f9, 200)


pointlight.position.set(0, 1, 14)

scene.add(pointlight)

const loader = new GLTFLoader();

loader.load('/minta-modern-export.gltf', function (gltf) {
    const root = gltf.scene

    const materialGlass = new THREE.MeshPhysicalMaterial({
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

    });

    const material2 = new THREE.MeshPhysicalMaterial({
        metalness: 1,
        roughness: 0.3,
        transparent: false,
        transmission: 1.4,
        color: 0x7A7AED
    });

    let csikok = root.getObjectByName('csíkok')
    let savok = root.getObjectByName('sávok')
    let kitoltes = root.getObjectByName('kitöltés')

    kitoltes.material = material2

    savok.material = csikok.material = materialGlass

    root.rotation.x = Math.PI / 3
    root.position.y = 5

    model = root
    scene.add(model)

}, undefined, (error) => console.error(error))


if (!isMobile) {
    window.addEventListener("resize", () => {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

});
}

const interaction = () => {
    requestAnimationFrame(interaction)
    renderer.render(scene, camera)
}


const mousemove = (e) => {
    const client = (e.touches) ? e.touches[0] : e;
    pointlight.position
        .setX(
            (client.clientX - window.innerWidth / 2) / 10 * 0.55
        )
        .setY(
            (client.clientY - window.innerHeight / 2) / 10 * -.5
        )
}

document.addEventListener("mousemove", mousemove)
document.addEventListener("touchmove", mousemove)





 document.addEventListener("scroll", () => {
    scrollPosition = window.scrollY / window.innerHeight
    if (model) {
        model.position.y = 5 + (scrollPosition * 15)
        model.rotation.y = scrollPosition
        model.rotation.x = Math.PI / 3 - (scrollPosition / 1.5)
        dirLight.intensity = 5 - (scrollPosition * 10)
    }

    fadeIn()
}) 



function fadeIn() {

    fadeInArray.forEach(elem => {
        var distInView = elem.getBoundingClientRect().top - window.innerHeight + 30;
        if (distInView < 0) {
            elem.classList.add("fade");
        } else {
            elem.classList.remove("fade");
        }
    });


}

fadeIn();
interaction()
