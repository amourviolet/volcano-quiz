/* ============================================================
   volcano3d.js — Three.js 3D 火山喷发场景模块
   依赖：three.min.js, OrbitControls.js（UMD 全局 THREE）
   暴露：window.VolcanoScene
   ============================================================ */

(function () {
  'use strict';

  // ---------- 简化的 2D Simplex Noise（GLSL 内嵌用） ----------
  const NOISE_GLSL = `
    vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
    vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
    vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
    float snoise(vec2 v){
      const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
      vec2 i=floor(v+dot(v,C.yy));
      vec2 x0=v-i+dot(i,C.xx);
      vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
      vec4 x12=x0.xyxy+C.xxzz;
      x12.xy-=i1;
      i=mod289(i);
      vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
      vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
      m=m*m;m=m*m;
      vec3 x=2.0*fract(p*C.www)-1.0;
      vec3 h=abs(x)-0.5;
      vec3 ox=floor(x+0.5);
      vec3 a0=x-ox;
      m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
      vec3 g;
      g.x=a0.x*x0.x+h.x*x0.y;
      g.yz=a0.yz*x12.xz+h.yz*x12.yw;
      return 130.0*dot(m,g);
    }
  `;

  // ---------- VolcanoScene 类 ----------
  class VolcanoScene {
    constructor(container, options) {
      this.container = container;
      options = options || {};
      this.small = !!options.small;
      this.running = false;
      this._clock = new THREE.Clock();
      this._rafId = null;
      this._eruptionPhase = 0; // 喷发周期相位 0-1
      this._init();
    }

    _init() {
      const w = this.container.clientWidth || 600;
      const h = this.small ? 360 : 460;
      this.container.style.height = h + 'px';

      // 场景
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x1a0500);
      this.scene.fog = new THREE.FogExp2(0x2a0a05, 0.04);

      // 相机
      this.camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 200);
      this.camera.position.set(6, 4.5, 8);
      this.camera.lookAt(0, 1, 0);

      // 渲染器
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.setSize(w, h);
      this.renderer.outputEncoding = THREE.sRGBEncoding;
      this.container.appendChild(this.renderer.domElement);

      // 控制器
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.08;
      this.controls.minDistance = 5;
      this.controls.maxDistance = 18;
      this.controls.minPolarAngle = 0.25;
      this.controls.maxPolarAngle = 1.45;
      this.controls.target.set(0, 1, 0);
      this.controls.autoRotate = true;
      this.controls.autoRotateSpeed = 0.6;
      this.controls.update();

      // 光照
      this.scene.add(new THREE.AmbientLight(0x331100, 0.45));
      this.craterLight = new THREE.PointLight(0xff6a00, 4, 12, 1.5);
      this.craterLight.position.set(0, 2.2, 0);
      this.scene.add(this.craterLight);
      const side = new THREE.DirectionalLight(0x886644, 0.5);
      side.position.set(5, 8, 4);
      this.scene.add(side);
      const rim = new THREE.DirectionalLight(0x442211, 0.3);
      rim.position.set(-4, 3, -5);
      this.scene.add(rim);

      // 地面
      this._buildGround();
      // 火山体
      this._buildVolcano();
      // 熔岩湖
      this._buildLavaLake();
      // 粒子系统
      this._buildParticles();

      // 停止自转：用户交互时
      this.controls.addEventListener('start', () => { this.controls.autoRotate = false; });
    }

    // ---------- 地面 ----------
    _buildGround() {
      const geo = new THREE.CircleGeometry(14, 64);
      geo.rotateX(-Math.PI / 2);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x1a0e08,
        roughness: 1.0,
        metalness: 0.0
      });
      const ground = new THREE.Mesh(geo, mat);
      ground.position.y = -0.01;
      this.scene.add(ground);
    }

    // ---------- 火山体 ----------
    _buildVolcano() {
      const radius = 2.2;
      const height = 3.0;
      const geo = new THREE.ConeGeometry(radius, height, 80, 40, true);
      // 顶点变形：表面凹凸 + 顶部截断成火山口
      const pos = geo.attributes.position;
      const v = new THREE.Vector3();
      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        // 顶部截断：y 接近顶部的拉下来形成开口
        if (v.y > height / 2 - 0.35) {
          v.y = height / 2 - 0.35;
        }
        // 表面噪声变形（径向）
        const angle = Math.atan2(v.z, v.x);
        const noiseVal = (Math.sin(angle * 7 + v.y * 3) * 0.5 +
                          Math.cos(angle * 11 - v.y * 2) * 0.3 +
                          Math.sin(angle * 17 + v.y * 5) * 0.2) * 0.18;
        const r = Math.sqrt(v.x * v.x + v.z * v.z);
        if (r > 0.01) {
          const scale = 1 + noiseVal / Math.max(r, 0.3);
          v.x *= scale;
          v.z *= scale;
        }
        pos.setXYZ(i, v.x, v.y, v.z);
      }
      geo.computeVertexNormals();

      const mat = new THREE.MeshStandardMaterial({
        color: 0x3e2723,
        roughness: 0.95,
        metalness: 0.05,
        flatShading: true
      });
      this.volcano = new THREE.Mesh(geo, mat);
      this.volcano.position.y = height / 2;
      this.scene.add(this.volcano);

      // 火山口内壁（深色圆台）
      const craterGeo = new THREE.CylinderGeometry(0.55, 0.7, 0.5, 32, 1, true);
      const craterMat = new THREE.MeshStandardMaterial({
        color: 0x1a0a05,
        roughness: 1.0,
        side: THREE.DoubleSide
      });
      const crater = new THREE.Mesh(craterGeo, craterMat);
      crater.position.y = height - 0.35;
      this.scene.add(crater);
    }

    // ---------- 熔岩湖（火山口顶部，shader 流动） ----------
    _buildLavaLake() {
      const geo = new THREE.CircleGeometry(0.55, 48);
      geo.rotateX(-Math.PI / 2);
      const mat = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uEruption: { value: 0 }
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uTime;
          uniform float uEruption;
          varying vec2 vUv;
          ${NOISE_GLSL}
          void main() {
            vec2 uv = vUv * 2.0 - 1.0;
            float n1 = snoise(uv * 3.0 + vec2(uTime * 0.18, -uTime * 0.12));
            float n2 = snoise(uv * 7.0 - vec2(uTime * 0.10, uTime * 0.15));
            float n3 = snoise(uv * 15.0 + uTime * 0.05);
            float heat = n1 * 0.55 + n2 * 0.30 + n3 * 0.15;
            heat += uEruption * 0.4;
            vec3 cold = vec3(0.45, 0.04, 0.0);
            vec3 mid  = vec3(1.0, 0.35, 0.0);
            vec3 hot  = vec3(1.0, 0.95, 0.45);
            vec3 color = mix(cold, mid, smoothstep(-0.35, 0.25, heat));
            color = mix(color, hot, smoothstep(0.15, 0.7, heat));
            // 中心更亮
            float d = length(uv);
            color += smoothstep(0.9, 0.0, d) * 0.25 * (0.6 + uEruption);
            // 边缘冷化
            float edge = smoothstep(0.85, 1.0, d);
            color = mix(color, cold * 0.6, edge);
            gl_FragColor = vec4(color, 1.0);
          }
        `,
        side: THREE.DoubleSide
      });
      this.lava = new THREE.Mesh(geo, mat);
      this.lava.position.y = 2.62;
      this.scene.add(this.lava);
    }

    // ---------- 粒子系统 ----------
    _buildParticles() {
      // 1. 岩浆碎屑（红橙发光，受重力）
      this.debris = this._createParticleSystem({
        count: 220,
        size: 0.12,
        colorHot: new THREE.Color(0xffeb3b),
        colorCold: new THREE.Color(0xff4500),
        gravity: 5.5,
        speedMin: 3.5, speedMax: 6.5,
        lifeMin: 1.5, lifeMax: 2.8,
        startY: 2.7,
        spread: 0.4,
        glow: true
      });
      // 2. 火山灰烟柱（深灰半透明，上升扩散）
      this.smoke = this._createParticleSystem({
        count: 320,
        size: 0.55,
        colorHot: new THREE.Color(0x555555),
        colorCold: new THREE.Color(0x1a1a1a),
        gravity: -1.2, // 上升
        speedMin: 1.0, speedMax: 2.2,
        lifeMin: 3.0, lifeMax: 5.0,
        startY: 2.8,
        spread: 0.25,
        growRate: 1.8,
        alphaFade: true
      });
      // 3. 火星飞溅（亮黄小点，高速短命）
      this.sparks = this._createParticleSystem({
        count: 140,
        size: 0.06,
        colorHot: new THREE.Color(0xffff88),
        colorCold: new THREE.Color(0xffaa00),
        gravity: 7.0,
        speedMin: 5.0, speedMax: 9.0,
        lifeMin: 0.6, lifeMax: 1.4,
        startY: 2.75,
        spread: 0.3,
        glow: true
      });
    }

    _createParticleSystem(cfg) {
      const count = cfg.count;
      const positions = new Float32Array(count * 3);
      const velocities = new Float32Array(count * 3);
      const lives = new Float32Array(count);
      const maxLives = new Float32Array(count);
      const sizes = new Float32Array(count);
      const seeds = new Float32Array(count);

      for (let i = 0; i < count; i++) {
        this._resetParticle(i, positions, velocities, lives, maxLives, sizes, cfg, Math.random() * (cfg.lifeMax || 2));
        seeds[i] = Math.random();
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
      geo.setAttribute('aLife', new THREE.BufferAttribute(lives, 1));
      geo.setAttribute('aMaxLife', new THREE.BufferAttribute(maxLives, 1));
      geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));

      const mat = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uPixelRatio: { value: this.renderer.getPixelRatio() },
          uColorHot: { value: cfg.colorHot },
          uColorCold: { value: cfg.colorCold },
          uGlow: { value: cfg.glow ? 1.0 : 0.0 },
          uAlphaFade: { value: cfg.alphaFade ? 1.0 : 0.0 },
          uGrowRate: { value: cfg.growRate || 0.0 }
        },
        vertexShader: `
          attribute float aSize;
          attribute float aLife;
          attribute float aMaxLife;
          attribute float aSeed;
          uniform float uPixelRatio;
          uniform float uGrowRate;
          varying float vLifeRatio;
          varying float vSeed;
          void main() {
            vLifeRatio = aMaxLife > 0.0 ? aLife / aMaxLife : 0.0;
            vSeed = aSeed;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            float grow = 1.0 + uGrowRate * (1.0 - vLifeRatio);
            gl_PointSize = aSize * 100.0 * uPixelRatio * grow / -mvPosition.z;
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          uniform vec3 uColorHot;
          uniform vec3 uColorCold;
          uniform float uGlow;
          uniform float uAlphaFade;
          varying float vLifeRatio;
          varying float vSeed;
          void main() {
            vec2 c = gl_PointCoord - 0.5;
            float d = length(c);
            if (d > 0.5) discard;
            // 颜色随生命变化（年轻=热色，老化=冷色）
            vec3 color = mix(uColorCold, uColorHot, vLifeRatio);
            // 软圆形
            float alpha = smoothstep(0.5, 0.1, d);
            // 发光增强中心
            if (uGlow > 0.5) {
              alpha *= 0.5 + 0.5 * vLifeRatio;
              color += vec3(0.3) * smoothstep(0.4, 0.0, d) * vLifeRatio;
            }
            // 渐隐
            if (uAlphaFade > 0.5) {
              alpha *= smoothstep(0.0, 0.3, vLifeRatio) * 0.7;
            } else {
              alpha *= smoothstep(0.0, 0.15, vLifeRatio);
            }
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: cfg.glow ? THREE.AdditiveBlending : THREE.NormalBlending
      });

      const points = new THREE.Points(geo, mat);
      this.scene.add(points);

      return {
        points, geo, mat, cfg,
        positions, velocities, lives, maxLives, sizes
      };
    }

    _resetParticle(i, positions, velocities, lives, maxLives, sizes, cfg, initialLife) {
      const i3 = i * 3;
      // 起始位置：火山口附近随机散布
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * cfg.spread;
      positions[i3] = Math.cos(angle) * r;
      positions[i3 + 1] = cfg.startY + Math.random() * 0.15;
      positions[i3 + 2] = Math.sin(angle) * r;

      // 速度：向上为主 + 水平散开
      const speed = cfg.speedMin + Math.random() * (cfg.speedMax - cfg.speedMin);
      const elevAngle = Math.random() * 0.4 + 0.1; // 仰角 0.1-0.5 弧度
      const dirAngle = Math.random() * Math.PI * 2;
      velocities[i3] = Math.cos(dirAngle) * Math.cos(elevAngle) * speed;
      velocities[i3 + 1] = Math.sin(elevAngle) * speed + (cfg.gravity < 0 ? 1.5 : 0);
      velocities[i3 + 2] = Math.sin(dirAngle) * Math.cos(elevAngle) * speed;

      // 生命
      const life = initialLife != null ? initialLife : (cfg.lifeMin + Math.random() * (cfg.lifeMax - cfg.lifeMin));
      lives[i] = life;
      maxLives[i] = life;
      sizes[i] = cfg.size * (0.6 + Math.random() * 0.8);
    }

    _updateParticles(sys, dt, eruptionBoost) {
      const { cfg, positions, velocities, lives, maxLives, sizes } = sys;
      const count = positions.length / 3;
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        lives[i] -= dt;
        if (lives[i] <= 0) {
          this._resetParticle(i, positions, velocities, lives, maxLives, sizes, cfg, null);
          continue;
        }
        // 位置更新
        positions[i3] += velocities[i3] * dt;
        positions[i3 + 1] += velocities[i3 + 1] * dt;
        positions[i3 + 2] += velocities[i3 + 2] * dt;
        // 重力（烟柱 gravity<0 表示上升加速度）
        velocities[i3 + 1] += cfg.gravity * dt;
        // 阻力（烟柱减速扩散）
        if (cfg.gravity < 0) {
          velocities[i3] *= (1 - 0.4 * dt);
          velocities[i3 + 2] *= (1 - 0.4 * dt);
        }
        // 喷发加速
        if (eruptionBoost > 0) {
          velocities[i3 + 1] += eruptionBoost * dt * 8;
        }
        // 地面碰撞（碎屑落地后停留并快速消亡）
        if (positions[i3 + 1] < 0.05 && cfg.gravity > 0) {
          lives[i] = Math.min(lives[i], 0.2);
          velocities[i3] *= 0.3;
          velocities[i3 + 2] *= 0.3;
          velocities[i3 + 1] = 0;
        }
      }
      sys.geo.attributes.position.needsUpdate = true;
      sys.geo.attributes.aLife.array = lives;
      sys.geo.attributes.aLife.needsUpdate = true;
    }

    // ---------- 动画循环 ----------
    _animate = () => {
      if (!this.running) return;
      this._rafId = requestAnimationFrame(this._animate);
      const dt = Math.min(this._clock.getDelta(), 0.05);
      const t = this._clock.elapsedTime;

      // 喷发周期：6秒一周期，前1.2秒为爆发期
      const cycleLen = 6.0;
      const phase = (t % cycleLen) / cycleLen;
      let eruptionBoost = 0;
      let eruptionIntensity = 0; // 0-1，用于熔岩亮度
      if (phase < 0.2) {
        const ep = phase / 0.2;
        eruptionBoost = Math.sin(ep * Math.PI) * 1.5;
        eruptionIntensity = Math.sin(ep * Math.PI);
      }

      // 更新熔岩 shader
      this.lava.material.uniforms.uTime.value = t;
      this.lava.material.uniforms.uEruption.value = eruptionIntensity;
      // 熔岩湖随喷发略升高
      this.lava.position.y = 2.62 + eruptionIntensity * 0.08;

      // 火山口光源脉动
      this.craterLight.intensity = 3.5 + eruptionIntensity * 4 + Math.sin(t * 8) * 0.3;

      // 更新粒子
      this._updateParticles(this.debris, dt, eruptionBoost);
      this._updateParticles(this.smoke, dt, eruptionBoost * 0.3);
      this._updateParticles(this.sparks, dt, eruptionBoost * 1.2);

      // 粒子 shader 时间
      this.debris.mat.uniforms.uTime.value = t;
      this.smoke.mat.uniforms.uTime.value = t;
      this.sparks.mat.uniforms.uTime.value = t;

      // 控制器
      this.controls.update();

      this.renderer.render(this.scene, this.camera);
    };

    start() {
      if (this.running) return;
      this.running = true;
      this._clock.start();
      this._rafId = requestAnimationFrame(this._animate);
    }

    stop() {
      this.running = false;
      if (this._rafId) {
        cancelAnimationFrame(this._rafId);
        this._rafId = null;
      }
    }

    resize() {
      if (!this.container) return;
      const w = this.container.clientWidth || 600;
      const h = this.small ? 360 : 460;
      this.container.style.height = h + 'px';
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    }

    dispose() {
      this.stop();
      this.scene.traverse(obj => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
          else obj.material.dispose();
        }
      });
      this.renderer.dispose();
      if (this.renderer.domElement && this.renderer.domElement.parentNode === this.container) {
        this.container.removeChild(this.renderer.domElement);
      }
    }
  }

  window.VolcanoScene = VolcanoScene;
})();
