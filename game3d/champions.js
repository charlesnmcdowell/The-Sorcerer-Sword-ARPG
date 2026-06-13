// ======================================================================
//  champions.js — shared 3D champion builders for The Sorcerer-Sword 3D
//  HYBRID HERO: custom procedural low-poly bodies parented onto the KayKit
//  "Rig_Medium" skeleton (Knight mesh hidden) so the bought animation clips
//  drive our own characters. Used by the look-test (index.html) and the Pit.
//  Plain global script (no modules) so it runs from file:// double-click.
// ======================================================================
(function(){
"use strict";
const THREE=window.THREE;
if(!THREE){console.warn('champions.js: THREE not loaded');return;}

const M=(c,o={})=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.72,metalness:.12,flatShading:true},o));
const EMISS=(c,e,i)=>new THREE.MeshStandardMaterial({color:c,emissive:e,emissiveIntensity:i,flatShading:true,roughness:.4});
const glowTex=(function(){const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');
  const g=x.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.35,'rgba(255,255,255,.55)');g.addColorStop(1,'rgba(255,255,255,0)');
  x.fillStyle=g;x.fillRect(0,0,128,128);return new THREE.CanvasTexture(c);})();
function addGlow(p,col,size,op){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:col,transparent:true,opacity:op==null?.7:op,blending:THREE.AdditiveBlending,depthWrite:false,fog:false}));s.scale.set(size,size,1);p.add(s);return s;}

const LEN={upperarm:0.242,lowerarm:0.26,upperleg:0.227,lowerleg:0.149};
function makeApi(model){
  const bn=n=>model.getObjectByName(n);
  const parts=[],missing=[];
  function add(bone,mesh,pos,rot){const b=bn(bone);if(!b){if(missing.indexOf(bone)<0)missing.push(bone);return null;}
    if(pos)mesh.position.set(pos[0],pos[1],pos[2]);if(rot)mesh.rotation.set(rot[0]||0,rot[1]||0,rot[2]||0);
    mesh.castShadow=true;mesh.receiveShadow=true;b.add(mesh);parts.push(mesh);return mesh;}
  return {
    bn,parts,missing,add,
    box:(bone,w,h,d,mat,pos,rot)=>add(bone,new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat),pos,rot),
    cyl:(bone,rt,rb,h,mat,pos,rot,sg)=>add(bone,new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,sg||12),mat),pos,rot),
    sph:(bone,r,mat,pos)=>add(bone,new THREE.Mesh(new THREE.SphereGeometry(r,14,12),mat),pos),
    cone:(bone,r,h,mat,pos,rot,sg)=>add(bone,new THREE.Mesh(new THREE.ConeGeometry(r,h,sg||16),mat),pos,rot),
    torus:(bone,r,t,mat,pos,rot)=>add(bone,new THREE.Mesh(new THREE.TorusGeometry(r,t,10,28),mat),pos,rot),
    octa:(bone,r,mat,pos,rot)=>add(bone,new THREE.Mesh(new THREE.OctahedronGeometry(r),mat),pos,rot),
    limb:(bone,key,w,d,mat)=>add(bone,new THREE.Mesh(new THREE.BoxGeometry(w,LEN[key]*0.98,d),mat),[0,LEN[key]/2,0]),
    glow:(bone,col,size,op,pos)=>{const b=bn(bone);if(!b)return;const s=addGlow(b,col,size,op);if(pos)s.position.set(pos[0],pos[1],pos[2]);parts.push(s);return s;}
  };
}
function baseLimbs(a,mat,o){o=o||{};
  for(const s of['l','r']){
    a.sph('upperarm.'+s,0.12,o.shoulderMat||mat,[0,0,0]);
    a.limb('upperarm.'+s,'upperarm',0.17,0.17,mat);
    a.limb('lowerarm.'+s,'lowerarm',0.15,0.15,mat);
    a.box('hand.'+s,0.15,0.15,0.15,o.handMat||mat,[0,0.06,0]);
    if(!o.noLegs){
      a.limb('upperleg.'+s,'upperleg',0.21,0.22,o.legMat||mat);
      a.limb('lowerleg.'+s,'lowerleg',0.18,0.19,o.legMat||mat);
      a.box('foot.'+s,0.18,0.16,0.24,o.footMat||mat,[0,0.05,0.05]);
    }
  }
}
function eyes(a,mat){a.box('head',0.05,0.07,0.03,mat,[-0.08,0.12,0.155]);a.box('head',0.05,0.07,0.03,mat,[0.08,0.12,0.155]);}
function handProp(a,bone,group,pos){a.add(bone,group,pos);}

function buildRonin(a){
  const armor=M(0x2b3340,{metalness:.2}),under=M(0x39414e),hakama=M(0x7a2230),obi=M(0xc8a24e,{metalness:.45,emissive:0x2a1c04,emissiveIntensity:.5}),
        skin=M(0xcaa17a),dark=M(0x14171d),steel=M(0xd6dee8,{metalness:.85,roughness:.24,emissive:0x0e1218,emissiveIntensity:.35});
  a.box('spine',0.48,0.46,0.31,armor,[0,0.18,0]);
  a.box('chest',0.50,0.20,0.32,armor,[0,0.07,0]);
  a.box('hips',0.44,0.18,0.32,under,[0,0.06,0]);
  a.box('hips',0.50,0.09,0.36,obi,[0,0.18,0]);
  a.cone('hips',0.36,0.52,hakama,[0,-0.14,0],null,14);
  a.box('head',0.32,0.34,0.32,skin,[0,0.12,0]); eyes(a,dark);
  a.box('head',0.345,0.08,0.345,dark,[0,0.20,0]);
  a.box('head',0.26,0.10,0.16,dark,[0,0.04,0.11]);
  a.cyl('head',0.06,0.085,0.16,dark,[0,0.33,-0.05],null,8);
  baseLimbs(a,under,{legMat:dark,footMat:dark,shoulderMat:armor,handMat:dark});
  a.box('upperarm.l',0.22,0.14,0.24,armor,[0,0.02,0]); a.box('upperarm.r',0.22,0.14,0.24,armor,[0,0.02,0]);
  const kat=new THREE.Group();
  const blade=new THREE.Mesh(new THREE.BoxGeometry(0.025,0.7,0.06),steel);blade.position.y=0.5;blade.castShadow=true;kat.add(blade);
  const tsuba=new THREE.Mesh(new THREE.CylinderGeometry(0.085,0.085,0.02,12),dark);tsuba.position.y=0.13;tsuba.rotation.x=Math.PI/2;kat.add(tsuba);
  const grip=new THREE.Mesh(new THREE.BoxGeometry(0.04,0.2,0.05),dark);grip.position.y=0.02;kat.add(grip);
  handProp(a,'handslot.r',kat);
  a.box('hips',0.045,0.6,0.06,dark,[-0.22,-0.04,-0.07],[0,0,-0.22]);
}
function buildDruid(a){
  const robe=M(0x3c5a34),bark=M(0x5a4326),skin=M(0xc8a47a),leaf=M(0x6fae3a,{emissive:0x163008,emissiveIntensity:.35}),
        dark=M(0x232c1c),horn=M(0xcfc0a0),beard=M(0xc6bb96);
  a.box('spine',0.48,0.48,0.32,robe,[0,0.18,0]);
  a.box('chest',0.46,0.20,0.30,robe,[0,0.06,0]);
  a.box('hips',0.44,0.18,0.32,robe,[0,0.05,0]);
  a.cone('hips',0.38,0.66,robe,[0,-0.20,0],null,12);
  a.box('hips',0.50,0.08,0.36,bark,[0,0.16,0]);
  a.box('chest',0.62,0.12,0.36,leaf,[0,0.17,0]);
  a.box('head',0.32,0.34,0.32,skin,[0,0.12,0]); eyes(a,dark);
  a.box('head',0.42,0.22,0.42,robe,[0,0.20,-0.02]);
  a.box('head',0.12,0.18,0.07,beard,[0,-0.03,0.13]);
  for(const sx of[-1,1]){
    a.cyl('head',0.028,0.04,0.28,horn,[sx*0.13,0.27,0.02],[-0.25,0,sx*0.55],8);
    a.cyl('head',0.02,0.028,0.18,horn,[sx*0.24,0.40,0.02],[-0.15,0,sx*0.95],6);
    a.cyl('head',0.018,0.024,0.14,horn,[sx*0.05,0.42,0.0],[-0.5,0,sx*0.2],6);
  }
  baseLimbs(a,robe,{legMat:bark,footMat:dark,handMat:skin,shoulderMat:leaf});
  const staff=new THREE.Group();
  const shaft=new THREE.Mesh(new THREE.CylinderGeometry(0.032,0.038,1.15,8),bark);shaft.position.y=0.42;shaft.castShadow=true;staff.add(shaft);
  const orb=new THREE.Mesh(new THREE.SphereGeometry(0.11,12,10),EMISS(0x9bf25a,0x4ea020,1.5));orb.position.y=1.02;staff.add(orb);
  addGlow(staff,0x8ef25a,1.7,.95).position.y=1.02;
  handProp(a,'handslot.r',staff);
}
function buildWarlock(a){
  const robe=M(0x1b1726),trim=M(0x4a2c6a,{emissive:0x180a2a,emissiveIntensity:.5}),skin=M(0xcfc6cc),dark=M(0x0c0a12),bookcov=M(0x3a1c1c);
  a.box('spine',0.46,0.50,0.30,robe,[0,0.18,0]);
  a.box('chest',0.44,0.22,0.30,robe,[0,0.06,0]);
  a.cone('hips',0.42,0.98,robe,[0,-0.34,0],null,12);
  a.box('hips',0.46,0.08,0.32,trim,[0,0.14,0]);
  a.box('chest',0.60,0.18,0.30,trim,[0,0.2,-0.02]);
  a.box('head',0.30,0.32,0.30,skin,[0,0.12,0]); eyes(a,EMISS(0x9a5cff,0x5a10c0,1.6));
  a.cone('head',0.30,0.42,robe,[0,0.24,-0.04],null,10);
  a.box('head',0.34,0.22,0.30,robe,[0,0.08,-0.11]);
  baseLimbs(a,robe,{noLegs:true,handMat:skin,shoulderMat:trim});
  const staff=new THREE.Group();
  const shaft=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.034,1.25,8),dark);shaft.position.y=0.44;shaft.castShadow=true;staff.add(shaft);
  const cryst=new THREE.Mesh(new THREE.OctahedronGeometry(0.13),EMISS(0xb070ff,0x6a20c0,1.7));cryst.position.y=1.12;staff.add(cryst);
  addGlow(staff,0xb070ff,1.9,.95).position.y=1.12;
  handProp(a,'handslot.r',staff);
  const book=new THREE.Group();
  const p1=new THREE.Mesh(new THREE.BoxGeometry(0.17,0.022,0.22),bookcov);p1.position.x=-0.095;p1.rotation.z=0.18;book.add(p1);
  const p2=new THREE.Mesh(new THREE.BoxGeometry(0.17,0.022,0.22),bookcov);p2.position.x=0.095;p2.rotation.z=-0.18;book.add(p2);
  const pages=new THREE.Mesh(new THREE.PlaneGeometry(0.32,0.21),EMISS(0xe8dcc0,0x6a4aa0,.6));pages.rotation.x=-Math.PI/2;pages.position.y=0.03;book.add(pages);
  addGlow(book,0xb070ff,0.8,.6).position.y=0.12;
  handProp(a,'handslot.l',book,[0,0.05,0]);
}
function buildSeraphim(a){
  const robe=M(0xeae0c8),gold=M(0xe7c24e,{metalness:.5,roughness:.34,emissive:0x3a2a06,emissiveIntensity:.5}),
        skin=M(0xf0e0cc),feather=M(0xf6f0e2,{emissive:0x2a2a3a,emissiveIntensity:.12}),dark=M(0x2a2436);
  a.box('spine',0.48,0.46,0.30,robe,[0,0.18,0]);
  a.box('chest',0.50,0.22,0.32,gold,[0,0.07,0]);
  a.cone('hips',0.38,0.74,robe,[0,-0.24,0],null,12);
  a.box('hips',0.50,0.08,0.36,gold,[0,0.16,0]);
  a.box('head',0.30,0.32,0.30,skin,[0,0.13,0]); eyes(a,EMISS(0x4aa0d0,0x2a80b0,1.1));
  a.box('head',0.20,0.22,0.20,skin,[-0.27,0.03,0]); a.box('head',0.20,0.22,0.20,skin,[0.27,0.03,0]);
  a.torus('head',0.27,0.03,gold,[0,0.36,0],[Math.PI/2,0,0]);
  a.glow('head',0xffe6a0,2.1,.85,[0,0.36,0]);
  for(const sx of[-1,1]){
    for(let f=0;f<4;f++){
      a.box('chest',0.52-f*0.09,0.11,0.06,feather,[sx*(0.30+f*0.21),0.16+f*0.17,-0.16-f*0.03],[0,0,sx*(0.42+f*0.14)]);
    }
  }
  baseLimbs(a,robe,{legMat:robe,footMat:gold,handMat:skin,shoulderMat:gold});
  const spear=new THREE.Group();
  const shaft=new THREE.Mesh(new THREE.CylinderGeometry(0.026,0.026,1.55,8),gold);shaft.position.y=0.52;shaft.castShadow=true;spear.add(shaft);
  const tip=new THREE.Mesh(new THREE.ConeGeometry(0.065,0.28,10),EMISS(0xfff0c0,0xe7c24e,1.3));tip.position.y=1.38;spear.add(tip);
  addGlow(spear,0x8fe6ff,1.3,.75).position.y=1.38;
  handProp(a,'handslot.r',spear);
}

const BUILDERS={ronin:buildRonin,druid:buildDruid,warlock:buildWarlock,seraphim:buildSeraphim};
const CHAMPS=[
  {key:'ronin',   name:'RONIN',    build:buildRonin,   blurb:'Iaido blade · step-in strike'},
  {key:'druid',   name:'DRUID',    build:buildDruid,   blurb:'Beastform fury · nature staff'},
  {key:'warlock', name:'WARLOCK',  build:buildWarlock, blurb:'Forbidden book · crystal staff'},
  {key:'seraphim',name:'SERAPHIM', build:buildSeraphim,blurb:'Three-headed angel · radiant spear'}
];

function b64buf(b){const bin=atob(b),n=bin.length,u=new Uint8Array(n);for(let i=0;i<n;i++)u[i]=bin.charCodeAt(i);return u.buffer;}

// parse a fresh copy of the rig and build the named champion onto it.
// cb(model, api).  Knight meshes hidden; procedural champion attached.
function makeChampion(loader,EMB,key,cb,err){
  const onGltf=gltf=>{
    const m=gltf.scene;
    m.traverse(o=>{if(o.isMesh){if(/^Knight_/.test(o.name)){o.visible=false;}else{o.castShadow=true;o.receiveShadow=true;}}if(o.frustumCulled!==undefined)o.frustumCulled=false;});
    const api=makeApi(m);(BUILDERS[key]||buildRonin)(api);
    cb(m,api);
  };
  if(EMB)loader.parse(b64buf(EMB.knight),'',onGltf,err);
  else loader.load('assets/Knight.glb',onGltf,undefined,err);
}
// parse a raw KayKit Knight (no hero build) — used for enemy stand-ins; cb(model)
function makeKnight(loader,EMB,cb,err){
  const onGltf=gltf=>{const m=gltf.scene;m.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}if(o.frustumCulled!==undefined)o.frustumCulled=false;});cb(m);};
  if(EMB)loader.parse(b64buf(EMB.knight),'',onGltf,err);
  else loader.load('assets/Knight.glb',onGltf,undefined,err);
}
// load + merge the animation clips once; cb(clips[])
function loadClips(loader,EMB,cb){
  const clips=[],seen={};let n=2;const done=()=>{if(--n<=0)cb(clips);};
  const col=ag=>(ag.animations||[]).forEach(c=>{if(c.name==='T-Pose'||seen[c.name])return;seen[c.name]=1;clips.push(c);});
  if(EMB){loader.parse(b64buf(EMB.anim_general),'',a=>{col(a);done();},done);loader.parse(b64buf(EMB.anim_movement),'',a=>{col(a);done();},done);}
  else{loader.load('assets/anim_general.glb',a=>{col(a);done();},undefined,done);loader.load('assets/anim_movement.glb',a=>{col(a);done();},undefined,done);}
}
// scale a built model so it stands ~targetH tall with feet on y=0; returns the model
function groundModel(model,targetH){
  let bb=new THREE.Box3().setFromObject(model);const h=(bb.max.y-bb.min.y)||2;model.scale.setScalar((targetH||2.0)/h);
  bb=new THREE.Box3().setFromObject(model);model.position.y-=bb.min.y;return model;
}

window.CHAMP={THREE,M,EMISS,addGlow,glowTex,makeApi,baseLimbs,eyes,LEN,BUILDERS,CHAMPS,b64buf,makeChampion,makeKnight,loadClips,groundModel};
})();
