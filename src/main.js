import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


const canvasDIV = document.querySelector('#bg');
const scene = new THREE.Scene();
 scene.background = new THREE.Color(0xffffff)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
    canvas: canvasDIV
})

renderer.setSize(window.innerWidth,window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
camera.position.setZ(40);


const dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
dirLight.position.set( 0, 20, 10 );
scene.add( dirLight );



const pointlight = new THREE.PointLight(0x9998f9, 200)

pointlight.position.set(0,-10,10)

scene.add(pointlight  )

const loader = new GLTFLoader();

const materialGlass = new THREE.MeshPhysicalMaterial( {
    transparent: true,
    transmission: 1,
    metalness: 0.47,
    roughness: 0.2,
    ior: 1.5,
    thickness: 0.7,
    specularIntensity: 1,
    specularColor: 0xffffff,
    side: THREE.FrontSide

  } );

  const material2 = new THREE.MeshPhysicalMaterial({
    metalness: 1,
    roughness: 0.4,
    transparent: false,
    transmission: 1.0,
    side: THREE.FrontSide
});

loader.load( '/minta-modern-export.gltf', function ( gltf ) {
    const root = gltf.scene

    let csikok = root.getObjectByName('csíkok')
    let savok = root.getObjectByName('sávok')

    savok.material = csikok.material = materialGlass

    root.rotation.x = Math.PI / 3
    root.position.y = 5

    scene.add( root )
}, undefined, ( error ) => console.error( error ))

const interaction = () => {
    requestAnimationFrame(interaction)

    const mousemove = (e) => {


        const client = (e.touches) ? e.touches[0] : e;

        pointlight.position
            .setX(
                (client.clientX - window.innerWidth / 2) /10 * 0.55
            )
            .setZ(
                (client.clientY - window.innerHeight / 2) /10 * .55
            )

    }

    document.addEventListener("mousemove", mousemove)
    document.addEventListener("touchmove", mousemove)
    
    renderer.render(scene, camera)
}

 interaction()
