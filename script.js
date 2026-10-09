import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';

const canvas = document.querySelector('#scene');
const host = canvas.parentElement;
let renderer, scene, camera, core, wire, particles, rings = [], animationId;
let pointer = {x:0,y:0,down:false,lastX:0,lastY:0,rotX:0,rotY:0};
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function init() {
  try {
    renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(host.clientWidth, host.clientHeight, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(38, host.clientWidth / host.clientHeight, .1, 100);
    camera.position.z = 7.5;

    scene.add(new THREE.AmbientLight(0x7b8bff, 1.8));
    const key = new THREE.PointLight(0x80f7ff, 55, 18); key.position.set(3, 3, 4); scene.add(key);
    const rim = new THREE.PointLight(0x8e65ff, 65, 15); rim.position.set(-4, -2, 1); scene.add(rim);

    const group = new THREE.Group(); scene.add(group);
    const geometry = new THREE.IcosahedronGeometry(1.25, 5);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x8d9bff, metalness: .68, roughness: .23, clearcoat: 1,
      clearcoatRoughness: .12, emissive: 0x252b7c, emissiveIntensity: .45
    });
    core = new THREE.Mesh(geometry, material); group.add(core);

    wire = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.31, 2),
      new THREE.MeshBasicMaterial({color:0x8cf6ff, wireframe:true, transparent:true, opacity:.28})
    );
    group.add(wire);

    for (let i=0;i<3;i++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.72 + i*.18, .006 + i*.001, 8, 180),
        new THREE.MeshBasicMaterial({color:[0x7feef5,0x8d83ff,0xb1c9ff][i],transparent:true,opacity:.7-i*.13})
      );
      ring.rotation.set(.7+i*.5, .3+i*.55, i*.7); group.add(ring); rings.push(ring);
    }

    const count = 1500;
    const positions = new Float32Array(count*3);
    const colors = new Float32Array(count*3);
    for(let i=0;i<count;i++){
      const radius = 2.0 + Math.random()*2.1;
      const theta = Math.random()*Math.PI*2;
      const phi = Math.acos(2*Math.random()-1);
      positions[i*3] = radius*Math.sin(phi)*Math.cos(theta);
      positions[i*3+1] = radius*Math.sin(phi)*Math.sin(theta);
      positions[i*3+2] = radius*Math.cos(phi);
      const t = Math.random();
      colors[i*3] = .36 + .35*t; colors[i*3+1] = .68 + .28*t; colors[i*3+2] = .95;
    }
    const pg = new THREE.BufferGeometry();
    pg.setAttribute('position',new THREE.BufferAttribute(positions,3));
    pg.setAttribute('color',new THREE.BufferAttribute(colors,3));
    particles = new THREE.Points(pg,new THREE.PointsMaterial({size:.018,vertexColors:true,transparent:true,opacity:.8,sizeAttenuation:true}));
    scene.add(particles);
    group.userData.rings = rings;
    scene.userData.group = group;

    canvas.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', () => pointer.down=false);
    window.addEventListener('resize', resize);
    animate();
  } catch (err) {
    console.error('3D scene could not start:', err);
    host.classList.add('scene-fallback');
  }
}
function onDown(e){ pointer.down=true; pointer.lastX=e.clientX; pointer.lastY=e.clientY; canvas.setPointerCapture?.(e.pointerId); }
function onMove(e){
  const rect=host.getBoundingClientRect();
  pointer.x=((e.clientX-rect.left)/rect.width-.5)*2;
  pointer.y=((e.clientY-rect.top)/rect.height-.5)*2;
  if(pointer.down){pointer.rotY+=(e.clientX-pointer.lastX)*.008;pointer.rotX+=(e.clientY-pointer.lastY)*.008;pointer.lastX=e.clientX;pointer.lastY=e.clientY;}
}
function resize(){
  if(!renderer||!camera)return;
  const w=host.clientWidth,h=host.clientHeight;
  renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();
}
const clock = new THREE.Clock();
function animate(){
  animationId=requestAnimationFrame(animate);
  if(!renderer)return;
  const t=clock.getElapsedTime(), group=scene.userData.group;
  if(!pointer.down && !reducedMotion){pointer.rotY += .0022;}
  group.rotation.y += (pointer.rotY-group.rotation.y)*.055;
  group.rotation.x += (pointer.rotX*.6 + pointer.y*.12-group.rotation.x)*.035;
  core.rotation.y=t*.12;core.rotation.x=Math.sin(t*.23)*.08;
  wire.rotation.y=-t*.09;wire.rotation.x=t*.07;
  rings.forEach((r,i)=>{r.rotation.z += (i%2?1:-1)*(.0015+i*.0005);});
  particles.rotation.y=t*.018;particles.rotation.x=Math.sin(t*.1)*.05;
  const scale=1+Math.sin(t*1.4)*.018;group.scale.setScalar(scale);
  camera.position.x += (pointer.x*.16-camera.position.x)*.02;
  camera.lookAt(0,0,0);
  renderer.render(scene,camera);
}
init();

// Mobile navigation
const menuButton=document.querySelector('.menu-toggle');
const navLinks=document.querySelector('.nav-links');
menuButton.addEventListener('click',()=>{
  const open=navLinks.classList.toggle('mobile-open');
  menuButton.setAttribute('aria-expanded',String(open));
});
navLinks.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>navLinks.classList.remove('mobile-open')));

// Subtle entrance reveals
const revealTargets=document.querySelectorAll('.feature-card,.manifesto-copy,.manifesto-art,.final-cta');
if('IntersectionObserver' in window && !reducedMotion){
  revealTargets.forEach(el=>{el.style.opacity='0';el.style.transform='translateY(18px)';el.style.transition='opacity .7s ease, transform .7s ease';});
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.style.opacity='1';entry.target.style.transform='translateY(0)';observer.unobserve(entry.target);}
  }),{threshold:.12});
  revealTargets.forEach(el=>observer.observe(el));
}
