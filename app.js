gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

if (history.scrollRestoration) {
  history.scrollRestoration = "manual";
}
window.scrollTo(0, 0);

const initExperience = () => {
  const panels = gsap.utils.toArray(".panel");
  const container = document.querySelector(".horizontal-scroll");
  const cursor = document.getElementById("cursor");
  const navIndex = document.querySelector(".nav-idx");

  gsap.set(container, { z: 0.01, force3D: true });

  /**
   * 1. LOADER
   */
  const masterTl = gsap.timeline();
  masterTl
    .to(".progress-bar", { width: "100%", duration: 0.8 })
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
   * 2. CORE ENGINE
   */
  let scrollTween = gsap.to(panels, {
    xPercent: -100 * (panels.length - 1),
    ease: "none",
    scrollTrigger: {
      trigger: ".main-container",
      pin: true,
      scrub: 0.5,
      end: () => "+=" + container.offsetWidth,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const currentSection =
          Math.round(self.progress * (panels.length - 1)) + 1;
        navIndex.innerText = `0${currentSection} / 05`;
      },
    },
  });

  /**
   * 3. BACK TO TOP & NAV GLIDE (RE-ENGINEERED)
   */
  const glideTo = (position) => {
    gsap.to(window, {
      scrollTo: { y: position }, // Explicit vertical axis
      duration: 2,
      ease: "expo.inOut",
      overwrite: true,
    });
  };

  // Improved Top Button Selector
  const topBtn = document.querySelector(".cell-top");
  if (topBtn) {
    // Add pointer-events style via JS to ensure it's clickable
    topBtn.style.pointerEvents = "auto";
    topBtn.style.cursor = "none"; // Keeps your custom cursor look

    topBtn.addEventListener("click", (e) => {
      console.log("Back to Top Clicked"); // Debug check
      glideTo(0);
    });
  }

  // Navigation links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const index = parseInt(link.getAttribute("data-index"));
      const totalScroll = container.offsetWidth;
      const sectionWidth = totalScroll / (panels.length - 1);
      const targetScroll =
        scrollTween.scrollTrigger.start + index * sectionWidth;
      glideTo(targetScroll);
    });
  });

  /**
   * 4. REVEALS
   */
  panels.forEach((section) => {
    const revealElements = section.querySelectorAll(".reveal");
    if (revealElements.length > 0) {
      gsap.from(revealElements, {
        y: 80,
        opacity: 0,
        rotate: 3,
        duration: 1.2,
        stagger: 0.15,
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
   * 5. CURSOR
   */
  window.addEventListener("mousemove", (e) => {
    gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
  });

  const interactiveSelectors =
    ".hero-title, .nav-idx, .big-type, .lorem, .brand, .submit-btn, input, label, .nav-link, .cell-top, .bento-item a";
  document.querySelectorAll(interactiveSelectors).forEach((target) => {
    target.addEventListener("mouseenter", () =>
      cursor.classList.add("cursor-grow"),
    );
    target.addEventListener("mouseleave", () =>
      cursor.classList.remove("cursor-grow"),
    );
  });

  /**
   * 6. THREE.JS (SMART RENDER)
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
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setPixelRatio(1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasContainer.appendChild(renderer.domElement);
    const geo = new THREE.TorusKnotGeometry(10, 3, 80, 12);
    const mat = new THREE.MeshBasicMaterial({
      color: 0x333333,
      wireframe: true,
    });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);
    camera.position.z = 40;
    const animate = () => {
      if (window.scrollY < 500) {
        mesh.rotation.y += 0.005;
        renderer.render(scene, camera);
      }
      requestAnimationFrame(animate);
    };
    animate();
  };
  initThree();
};

window.addEventListener("load", initExperience);
