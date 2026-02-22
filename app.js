gsap.registerPlugin(ScrollTrigger);

// 1. GLOBAL INITIALIZATION
if (history.scrollRestoration) {
  history.scrollRestoration = "manual";
}
window.scrollTo(0, 0);

const initExperience = () => {
  const panels = gsap.utils.toArray(".panel");
  const container = document.querySelector(".horizontal-scroll");
  const cursor = document.getElementById("cursor");
  const navIndex = document.querySelector(".nav-idx");

  /**
   * 2. LOADER MODULE
   * Handles the intro sequence and circular wipe exit.
   */
  const masterTl = gsap.timeline();
  masterTl
    .to(".progress-bar", { width: "100%", duration: 0.8, ease: "power2.inOut" })
    .to(".loader-logo", { y: -20, opacity: 0, duration: 0.5 })
    .to(".loader", {
      clipPath: "circle(0% at 50% 50%)",
      duration: 1.2,
      ease: "expo.inOut",
      onComplete: () => {
        document.querySelector(".loader").style.display = "none";
      },
    });

  /**
   * 3. CORE SCROLL ENGINE
   * Maps vertical scroll to the 5 horizontal panels.
   */
  const scrollTween = gsap.to(panels, {
    xPercent: -100 * (panels.length - 1),
    ease: "none",
    scrollTrigger: {
      trigger: ".main-container",
      pin: true,
      scrub: 1,
      end: () => "+=" + (container.offsetWidth - window.innerWidth),
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const currentSection =
          Math.round(self.progress * (panels.length - 1)) + 1;
        navIndex.innerText = `0${currentSection} / 05`;
      },
    },
  });

  /**
   * 4. ANIMATION REVEALS
   * Triggered as each section enters the horizontal viewport.
   */
  panels.forEach((section) => {
    const revealElements = section.querySelectorAll(".reveal");
    if (revealElements.length > 0) {
      gsap.from(revealElements, {
        y: 100,
        rotate: 5,
        opacity: 0,
        stagger: 0.1,
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: section,
          containerAnimation: scrollTween,
          start: "left 80%",
          toggleActions: "play none none reverse",
        },
      });
    }
  });

  /**
   * 5. INTERACTIVE & CURSOR MODULE
   * Manages smooth cursor following and hover scaling.
   */
  window.addEventListener("mousemove", (e) => {
    gsap.to(cursor, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.15,
      ease: "power2.out",
    });
  });

  const interactiveSelectors =
    ".hero-title, .nav-idx, .big-type, .lorem, .brand, .submit-btn, input, label, .bento-item a, .cell-top";
  document.querySelectorAll(interactiveSelectors).forEach((target) => {
    target.addEventListener("mouseenter", () =>
      cursor.classList.add("cursor-grow"),
    );
    target.addEventListener("mouseleave", () =>
      cursor.classList.remove("cursor-grow"),
    );
  });

  /**
   * 6. FORM & MAGNETIC INTERACTIONS
   * Tactile feedback for the application section.
   */
  const setupMagnetic = (btn) => {
    if (!btn) return;
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.4;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.4;
      gsap.to(btn, { x, y, duration: 0.3 });
    });
    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
    });
  };
  setupMagnetic(document.querySelector(".submit-btn"));

  /**
   * 7. THREE.JS (WEBGL) MODULE
   * Renders the glass-style TorusKnot background.
   */
  const initThree = () => {
    const canvasContainer = document.getElementById("three-canvas");
    if (!canvasContainer) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasContainer.appendChild(renderer.domElement);

    const geo = new THREE.TorusKnotGeometry(10, 3, 160, 20);
    const mat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.2,
      roughness: 0.1,
      transmission: 1.0,
      thickness: 1,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });

    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    const pointLight = new THREE.PointLight(0xffffff, 1.5);
    pointLight.position.set(20, 30, 40);
    scene.add(pointLight, new THREE.AmbientLight(0xffffff, 0.4));

    camera.position.z = 40;

    const animate = () => {
      requestAnimationFrame(animate);
      mesh.rotation.y += 0.002;
      mesh.rotation.x += 0.001;
      renderer.render(scene, camera);
    };
    animate();

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  };
  initThree();
};

// 8. FINAL EXECUTION
window.addEventListener("load", initExperience);
