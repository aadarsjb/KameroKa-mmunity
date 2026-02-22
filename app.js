/* app.js refinements */
gsap.registerPlugin(ScrollTrigger);

window.addEventListener("load", () => {
  // 1. IMPROVED LOADER
  const loaderTl = gsap.timeline();
  loaderTl
    .to(".progress-bar", { width: "100%", duration: 1 })
    .to(".loader-logo", { letterSpacing: "2em", opacity: 0, duration: 0.8 })
    .to(".loader", {
      clipPath: "circle(0% at 50% 50%)", // Cool circular wipe exit
      duration: 1.2,
      ease: "expo.inOut",
      onComplete: () => {
        document.querySelector(".loader").style.display = "none";
      },
    });

  // 2. STABLE ENGINE (No changes to structure)
  let sections = gsap.utils.toArray(".panel");
  let container = document.querySelector(".horizontal-scroll");

  let scrollTween = gsap.to(sections, {
    xPercent: -100 * (sections.length - 1),
    ease: "none",
    scrollTrigger: {
      trigger: ".main-container",
      pin: true,
      scrub: 1,
      end: () => "+=" + (container.offsetWidth - window.innerWidth),
      onUpdate: (self) => {
        let p = Math.round(self.progress * (sections.length - 1)) + 1;
        document.querySelector(".nav-idx").innerText = `0${p} / 04`;
      },
    },
  });

  // 3. ENHANCED REVEALS (Staggered character reveal)
  sections.forEach((section) => {
    let revealText = section.querySelector(".reveal");
    if (revealText) {
      gsap.from(revealText, {
        y: 150,
        rotate: 5,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: revealText,
          containerAnimation: scrollTween,
          start: "left 80%",
          toggleActions: "play none none reverse",
        },
      });
    }
  });

  // 4. MAGNETIC CURSOR & HOVER EFFECTS
  const cursor = document.getElementById("cursor");
  window.addEventListener("mousemove", (e) => {
    gsap.to(cursor, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.15,
      ease: "power2.out",
    });
  });

  // Add growth to cursor on specific elements
  const interactives = document.querySelectorAll(
    ".nav-idx, .big-type, .lorem, .brand",
  );
  interactives.forEach((el) => {
    el.addEventListener("mouseenter", () =>
      cursor.classList.add("cursor-grow"),
    );
    el.addEventListener("mouseleave", () =>
      cursor.classList.remove("cursor-grow"),
    );
  });

  // 5. PREMIUM THREE.JS (Frosted Glass Look)
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("three-canvas").appendChild(renderer.domElement);

  // Better Geometry: TorusKnot
  const geo = new THREE.TorusKnotGeometry(10, 3, 150, 20);
  const mat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.1,
    roughness: 0.05,
    transmission: 0.9, // Glass effect
    thickness: 0.5,
    transparent: true,
    wireframe: true,
  });
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);

  // Add Lighting for Physical Material
  const light = new THREE.PointLight(0xffffff, 1);
  light.position.set(20, 20, 20);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));

  camera.position.z = 35;

  function animate() {
    requestAnimationFrame(animate);
    mesh.rotation.y += 0.003;
    mesh.rotation.z += 0.002;
    renderer.render(scene, camera);
  }
  animate();
});
