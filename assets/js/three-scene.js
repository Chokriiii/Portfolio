(() => {
  const canvas = document.getElementById("heroScene");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!canvas || reducedMotion) return;

  function init() {
    if (!window.THREE) return;

    const THREE = window.THREE;
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0.2, 8);

    const particleCount = window.innerWidth < 760 ? 440 : 860;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const radius = 1.8 + Math.random() * 7.4;
      const angle = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(angle) * radius + 2.1;
      positions[i * 3 + 1] = -2.55 + Math.random() * 4.7;
      positions[i * 3 + 2] = Math.sin(angle) * radius * 0.26 - Math.random() * 3.2;
    }

    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(
      particlesGeo,
      new THREE.PointsMaterial({
        color: 0xf7c66b,
        size: 0.022,
        transparent: true,
        opacity: 0.72
      })
    );
    scene.add(particles);

    const ringGroup = new THREE.Group();
    scene.add(ringGroup);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xf7c66b,
      transparent: true,
      opacity: 0.22
    });

    for (let i = 0; i < 3; i++) {
      const curve = new THREE.EllipseCurve(0, 0, 1.8 + i * 0.58, 0.52 + i * 0.18, 0, Math.PI * 2, false, 0);
      const points = curve.getPoints(128).map((p) => new THREE.Vector3(p.x + 2.15, p.y - 1.05, -1.6 - i * 0.12));
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.LineLoop(geometry, lineMaterial);
      line.rotation.x = 1.08;
      line.rotation.z = -0.12 - i * 0.05;
      ringGroup.add(line);
    }

    const ambient = new THREE.AmbientLight(0xffe2a7, 0.35);
    const glow = new THREE.PointLight(0xf7c66b, 9, 13);
    glow.position.set(2.6, 1.4, 3.2);
    scene.add(ambient, glow);

    const pointer = { x: 0, y: 0 };
    window.addEventListener("pointermove", (event) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    resize();
    window.addEventListener("resize", resize, { passive: true });

    let frame = 0;
    function animate() {
      frame += 0.01;
      particles.rotation.y = frame * 0.04 + pointer.x * 0.018;
      particles.rotation.x = pointer.y * 0.014;
      ringGroup.rotation.y = frame * 0.018 + pointer.x * 0.025;
      ringGroup.rotation.x = pointer.y * 0.018;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    animate();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
