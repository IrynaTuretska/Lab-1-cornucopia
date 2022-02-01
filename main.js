"use strict"

import * as THREE from "three";

import Stats from "./jsm/libs/stats.module.js";

import { Curves } from "./jsm/curves/CurveExtras.js";
import { ParametricGeometry } from "./jsm/geometries/ParametricGeometry.js";
import { ParametricGeometries } from "./jsm/geometries/ParametricGeometries.js";

let camera, scene, renderer, stats;

init();
animate();

// CORNUCOPIA _ HALF SHAPE (v = PI * 1) & CORNUCOPIA _ FULL SHAPE (v <= PI * 2)

function cornucopia_2(u, v, t) {

    var p = 0.07;
    var m = 0.07;

    u = u * Math.PI * 3;
    v = v * Math.PI * 1;

    var x = [Math.exp(m * u) + ((Math.exp(p * u) * Math.cos(v)))] * Math.cos(u);
    var y = [Math.exp(m * u) + ((Math.exp(p * u) * Math.cos(v)))] * Math.sin(u);
    var z = Math.exp(p * u) * Math.sin(v);

   const scale = 1;
    
    t.x = x * scale;
    t.y = y * scale;
    t.z = z * scale;


    //return new THREE.Vector3(t.x * scale, t.y * scale, t.z * scale);
}



function init() {
    const container = document.getElementById("container");

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.y = 400;

    scene = new THREE.Scene();

    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    camera.add(pointLight);
    scene.add(camera);

    const map = new THREE.TextureLoader().load("textures/uv_grid_directx.jpg");
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 16;

    const material = new THREE.MeshPhongMaterial({ map: map, side: THREE.DoubleSide,});

    let geometry, object;
    

    geometry = new ParametricGeometry(cornucopia_2, 40, 40);

   
    object = new THREE.Mesh(geometry, material);
    object.position.set(0, 0, 200);
    object.scale.multiplyScalar(30);
    scene.add(object);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    stats = new Stats();
    container.appendChild(stats.dom);

    window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    render();
    stats.update();
}

function render() {
    const timer = Date.now() * 0.0001;

    camera.position.x = Math.cos(timer) * 800;
    camera.position.z = Math.sin(timer) * 800;

    camera.lookAt(scene.position);

    scene.traverse(function(object) {
        if (object.isMesh === true) {
            object.rotation.x = timer * 5;
            object.rotation.y = timer * 2.5;
        }
    });

    renderer.render(scene, camera);
}