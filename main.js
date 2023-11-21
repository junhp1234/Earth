import * as THREE from "https://cdn.skypack.dev/three@0.129.0";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";

let scene, camera, renderer, sphere, controls, skybox;
let skyboxImage = "space";
const sdBtn = document.querySelector(".sd");
const hdBtn = document.querySelector(".hd");

function createPathStrings(filename) {
    const basePath = "../space/";
    const baseFilename = basePath + filename;
    const fileType = ".png";
    const sides = ["ft", "bk", "up", "dn", "rt", "lf"];
    const pathStrings = sides.map((side) => {
        return baseFilename + "_" + side + fileType;
    });
    return pathStrings;
}

function createMaterialArray(filename) {
    const skyboxImagepaths = createPathStrings(filename);
    const materialArray = skyboxImagepaths.map((image) => {
        let texture = new THREE.TextureLoader().load(image);
        return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
    });
    return materialArray;
}

function setSkyBox() {
    const materialArray = createMaterialArray(skyboxImage);
    let temp = new THREE.TextureLoader().load("../space/space_stars_bg.jpg");
    // let temp1 = new THREE.MeshBasicMaterial({ map: temp, side: THREE.BackSide });
    let skyboxGeo = new THREE.BoxGeometry(200, 200, 200);
    skybox = new THREE.Mesh(skyboxGeo, materialArray);
    scene.add(skybox);
}

function createPoint(lat, lon) {
    var markerPosition = latLonToVector3(lat, lon, 5); // 임의 마커 생성 위치, lat : 위도, lon : 경도, 지구 반지름 크기
    var markerGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    var markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    var marker = new THREE.Mesh(markerGeometry, markerMaterial);
    marker.position.copy(markerPosition);

    return marker;
}
function latLonToVector3(lat, lon, radius) {
    var phi = (90 - lat) * (Math.PI / 180);
    var theta = (lon + 180) * (Math.PI / 180);

    var x = radius * Math.sin(phi) * Math.cos(theta);
    var y = radius * Math.cos(phi);
    var z = radius * Math.sin(phi) * Math.sin(theta);

    return new THREE.Vector3(x, y, z);
}
function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        85,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    setSkyBox();
    loadTexture("../earth.jpg");
    scene.add(sphere);

    var point = createPoint(35.0, -124.0); // 한국 위치
    var point2 = createPoint(0.0, 0.0); // 널 아일랜드
    var point3 = createPoint(90.0, 0.0); // 극좌표

    scene.add(point);
    scene.add(point2);
    scene.add(point3);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    renderer.domElement.id = "c";

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 5;
    controls.maxDistance = 100;

    camera.position.z = 20;
}

function loadTexture(texture) {
    const geometry = new THREE.SphereGeometry(5, 32, 32, Math.PI, Math.PI * 2, 0, Math.PI);
    const loader = new THREE.TextureLoader();
    const earthTexture = loader.load(texture);
    const material = new THREE.MeshBasicMaterial({ map: earthTexture });

    sphere = new THREE.Mesh(geometry, material);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onWindowResize, false);

init();
animate();
