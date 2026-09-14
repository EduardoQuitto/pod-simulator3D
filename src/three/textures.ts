import * as THREE from 'three';

function createCanvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;
  return [c, ctx];
}

export function createFloorTexture(): THREE.CanvasTexture {
  const [c, ctx] = createCanvas(512, 512);
  for (let x = 0; x < 8; x++) {
    for (let z = 0; z < 8; z++) {
      const dark = (x + z) % 2 === 0;
      const base = dark ? 58 : 68;
      ctx.fillStyle = `rgb(${base + Math.random() * 6 - 3},${base + Math.random() * 4 - 2},${base + Math.random() * 4 - 2})`;
      ctx.fillRect(x * 64, z * 64, 64, 64);
      ctx.strokeStyle = `rgba(0,0,0,0.15)`;
      ctx.lineWidth = 1;
      ctx.strokeRect(x * 64 + 0.5, z * 64 + 0.5, 63, 63);
      for (let i = 0; i < 20; i++) {
        const px = x * 64 + Math.random() * 64;
        const py = z * 64 + Math.random() * 64;
        const a = Math.random() * 0.08;
        ctx.fillStyle = `rgba(0,0,0,${a})`;
        ctx.fillRect(px, py, Math.random() * 3 + 1, Math.random() * 3 + 1);
      }
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(8, 10);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createFloorBumpTexture(): THREE.CanvasTexture {
  const [c, ctx] = createCanvas(512, 512);
  for (let x = 0; x < 8; x++) {
    for (let z = 0; z < 8; z++) {
      const v = (x + z) % 2 === 0 ? 100 : 140;
      ctx.fillStyle = `rgb(${v},${v},${v})`;
      ctx.fillRect(x * 64, z * 64, 64, 64);
      ctx.strokeStyle = `rgba(255,255,255,0.3)`;
      ctx.lineWidth = 1;
      ctx.strokeRect(x * 64 + 0.5, z * 64 + 0.5, 63, 63);
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(8, 10);
  return tex;
}

export function createWallTexture(): THREE.CanvasTexture {
  const [c, ctx] = createCanvas(256, 256);
  const base = 228;
  ctx.fillStyle = `rgb(${base},${base - 4},${base - 8})`;
  ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 500; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const v = Math.random() * 15 - 7;
    ctx.fillStyle = `rgba(${128 + v},${128 + v},${128 + v},0.08)`;
    ctx.fillRect(x, y, Math.random() * 8 + 2, Math.random() * 2 + 0.5);
  }
  for (let y = 0; y < 256; y += 64) {
    ctx.fillStyle = 'rgba(0,0,0,0.04)';
    ctx.fillRect(0, y, 256, 1);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createWallBumpTexture(): THREE.CanvasTexture {
  const [c, ctx] = createCanvas(256, 256);
  ctx.fillStyle = 'rgb(128,128,128)';
  ctx.fillRect(0, 0, 256, 256);
  for (let y = 0; y < 256; y += 64) {
    ctx.fillStyle = 'rgb(160,160,160)';
    ctx.fillRect(0, y - 1, 256, 2);
  }
  for (let i = 0; i < 300; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const v = 128 + Math.random() * 30 - 15;
    ctx.fillStyle = `rgb(${v},${v},${v})`;
    ctx.fillRect(x, y, Math.random() * 4 + 1, Math.random() * 4 + 1);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  return tex;
}

export function createWoodTexture(): THREE.CanvasTexture {
  const [c, ctx] = createCanvas(256, 256);
  const baseR = 110, baseG = 75, baseB = 35;
  for (let y = 0; y < 256; y++) {
    const v = Math.sin(y * 0.3) * 8 + Math.sin(y * 0.7) * 4;
    ctx.fillStyle = `rgb(${baseR + v + Math.random() * 4},${baseG + v * 0.6 + Math.random() * 3},${baseB + v * 0.3 + Math.random() * 2})`;
    ctx.fillRect(0, y, 256, 1);
  }
  for (let i = 0; i < 60; i++) {
    const y = Math.random() * 256;
    const w = Math.random() * 80 + 20;
    const x = Math.random() * 256;
    ctx.strokeStyle = `rgba(60,35,15,${Math.random() * 0.15 + 0.05})`;
    ctx.lineWidth = Math.random() * 2 + 0.5;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x + w * 0.3, y + Math.random() * 6 - 3, x + w * 0.7, y + Math.random() * 6 - 3, x + w, y + Math.random() * 4 - 2);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createMetalTexture(): THREE.CanvasTexture {
  const [c, ctx] = createCanvas(128, 128);
  ctx.fillStyle = '#707880';
  ctx.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * 128;
    const y = Math.random() * 128;
    const v = Math.random() * 20 + 100;
    ctx.fillStyle = `rgba(${v},${v + 5},${v + 10},0.15)`;
    ctx.fillRect(x, y, Math.random() * 6 + 1, 0.5);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createBlackboardTexture(): THREE.CanvasTexture {
  const [c, ctx] = createCanvas(512, 256);
  ctx.fillStyle = '#1a3a15';
  ctx.fillRect(0, 0, 512, 256);
  for (let i = 0; i < 800; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 256;
    const v = Math.random() * 12;
    ctx.fillStyle = `rgba(${20 + v},${50 + v},${18 + v},0.3)`;
    ctx.fillRect(x, y, Math.random() * 4 + 1, Math.random() * 2 + 0.5);
  }
  ctx.strokeStyle = 'rgba(200,200,200,0.12)';
  ctx.lineWidth = 1;
  for (let x = 10; x < 512; x += 30) {
    ctx.beginPath();
    ctx.moveTo(x, 20);
    ctx.lineTo(x, 236);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createCeilingTexture(): THREE.CanvasTexture {
  const [c, ctx] = createCanvas(256, 256);
  ctx.fillStyle = '#e8e4e0';
  ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    ctx.fillStyle = `rgba(200,195,190,${Math.random() * 0.15})`;
    ctx.fillRect(x, y, Math.random() * 6 + 1, Math.random() * 2 + 0.5);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(6, 8);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
