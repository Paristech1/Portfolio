// Initialize AOS Animation Library
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 800,
        easing: 'ease',
        once: true,
        mirror: false
    });

    // Initialize 3D Globe
    initGlobe();

    // Initialize Particles Background
    initParticles();

    // Mobile Navigation
    initMobileNav();

    // Get the "Explore My Solutions" button and add click event
    const exploreButton = document.querySelector('.about-text .cta-button');
    if (exploreButton) {
        exploreButton.addEventListener('click', () => {
            // Scroll to contact section since solutions was removed
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        });
    }
});

// 3D Globe with Three.js
function initGlobe() {
    const container = document.getElementById('globe');
    
    // Create scene
    const scene = new THREE.Scene();
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 1.7;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Create Earth sphere
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    
    // Earth texture loader
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load('https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg');
    const bumpMap = textureLoader.load('https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png');
    
    // Create material with glow effect
    const material = new THREE.MeshPhongMaterial({
        map: earthTexture,
        bumpMap: bumpMap,
        bumpScale: 0.1,
        shininess: 0.5
    });
    
    // Create Earth mesh
    const earth = new THREE.Mesh(geometry, material);
    scene.add(earth);
    
    // Create ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);
    
    // Create directional light (sunlight effect)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);
    
    // Add subtle glow effect
    const glowGeometry = new THREE.SphereGeometry(1.01, 64, 64);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.03
    });
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glowMesh);
    
    // Add orbit controls for interactivity
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.rotateSpeed = 0.3;
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Auto-rotate when not interacting
        if (!controls.autoRotate) {
            earth.rotation.y += 0.001;
            glowMesh.rotation.y += 0.001;
        }
        
        controls.update();
        renderer.render(scene, camera);
    }
    
    animate();
}

// Particles.js Background
function initParticles() {
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: ['#00ffff', '#9d00ff']
            },
            shape: {
                type: 'circle',
            },
            opacity: {
                value: 0.5,
                random: true,
                anim: {
                    enable: true,
                    speed: 0.5,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: true,
                    speed: 2,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#00ffff',
                opacity: 0.2,
                width: 1
            },
            move: {
                enable: true,
                speed: 1,
                direction: 'none',
                random: true,
                straight: false,
                out_mode: 'out',
                bounce: false,
                attract: {
                    enable: false,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'grab'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 140,
                    line_linked: {
                        opacity: 0.4
                    }
                },
                push: {
                    particles_nb: 3
                },
            }
        },
        retina_detect: true
    });
}

// Mobile Navigation
function initMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a nav link
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
}

// Add 3D tilt effect to feature cards
document.addEventListener('mousemove', e => {
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        // Only apply the effect if the card is being hovered
        if (card.matches(':hover')) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate tilt based on mouse position
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const tiltX = (y - centerY) / 15;
            const tiltY = (centerX - x) / 15;
            
            // Apply transform with perspective
            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        }
    });
});

// Reset the 3D tilt when mouse leaves card
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseleave', () => {
        // Remove the transform effect but keep the oscillating border
        card.style.transform = '';
        setTimeout(() => {
            card.style.transition = '';
        }, 300);
    });
    
    card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.2s ease';
    });
}); 