// Dark Mode Toggle with Smooth Transitions
const darkModeToggle = document.getElementById('darkModeToggle');
const html = document.documentElement;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    html.classList.add('dark');
}

// Toggle dark mode with smooth transition
darkModeToggle.addEventListener('click', () => {
    // Add transition class before toggling
    html.classList.add('theme-transition-enabled');
    
    // Toggle dark mode
    html.classList.toggle('dark');
    const isDark = html.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Update particle colors with smooth transition
    if (window.backgroundAnimation) {
        window.backgroundAnimation.updateTheme(isDark);
    }

    // Remove transition class after animation completes
    setTimeout(() => {
        html.classList.remove('theme-transition-enabled');
    }, 500);
});

// Enhanced Three.js Background Animation
class BackgroundAnimation {
    constructor() {
        this.init();
        window.backgroundAnimation = this;
    }

    init() {
        try {
            // Scene setup
            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
            this.renderer = new THREE.WebGLRenderer({ 
                antialias: true,
                alpha: true 
            });
            
            // Set renderer properties
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            
            // Add renderer to DOM
            const container = document.getElementById('hero-background');
            if (container) {
                container.appendChild(this.renderer.domElement);
            }

            // Particle setup
            this.particles = [];
            this.particleCount = 500;
            this.mouseX = 0;
            this.mouseY = 0;
            this.targetX = 0;
            this.targetY = 0;
            this.windowHalfX = window.innerWidth / 2;
            this.windowHalfY = window.innerHeight / 2;

            // Create particles with custom geometry
            this.createParticles();

            // Position camera
            this.camera.position.z = 1000;

            // Add event listeners
            document.addEventListener('mousemove', this.onDocumentMouseMove.bind(this));
            window.addEventListener('resize', this.onWindowResize.bind(this));

            // Start animation
            this.animate();
        } catch (error) {
            console.error('Error initializing background animation:', error);
        }
    }

    createParticles() {
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const colors = [];
        const sizes = [];

        const color = new THREE.Color();
        this.colorOptions = {
            light: [
                0x3b82f6, // Blue
                0x8b5cf6, // Purple
                0xec4899, // Pink
                0xffffff  // White
            ],
            dark: [
                0x60a5fa, // Light Blue
                0xa78bfa, // Light Purple
                0xf472b6, // Light Pink
                0xf3f4f6, // Light Gray
                0x818cf8, // Indigo
                0x93c5fd  // Sky Blue
            ]
        };

        const isDark = document.documentElement.classList.contains('dark');
        const currentColors = isDark ? this.colorOptions.dark : this.colorOptions.light;

        for (let i = 0; i < this.particleCount; i++) {
            // Create a sphere of particles
            const radius = 800;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            
            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);

            vertices.push(x, y, z);

            // Add color
            const colorIndex = Math.floor(Math.random() * currentColors.length);
            color.setHex(currentColors[colorIndex]);
            colors.push(color.r, color.g, color.b);

            // Add size variation
            sizes.push(Math.random() * 4 + 2);
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

        // Create custom shader material
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                pointTexture: { value: new THREE.TextureLoader().load('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QUM2OEZDQTQ4RTU0MTFFMTlBNkQ5OTNEM0FFQjM5QzQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QUM2OEZDQTU4RTU0MTFFMTlBNkQ5OTNEM0FFQjM5QzQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBQzY4RkNBMjhFNTQxMUUxOUE2RDk5M0QzQUVCMzlDNCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBQzY4RkNBMzhFNTQxMUUxOUE2RDk5M0QzQUVCMzlDNCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PvXJ8OMAAAAmSURBVHjaYvz//z8DMYAFxjh16hQjAwMDI4wBYzAyMjLAGDAXIwABBgD5OAL5t6n1zwAAAABJRU5ErkJggg==') }
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                uniform float time;
                
                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform sampler2D pointTexture;
                varying vec3 vColor;
                
                void main() {
                    gl_FragColor = vec4(vColor, 1.0) * texture2D(pointTexture, gl_PointCoord);
                }
            `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        this.particleSystem = new THREE.Points(geometry, material);
        this.scene.add(this.particleSystem);
    }

    updateTheme(isDark) {
        const colors = isDark ? this.colorOptions.dark : this.colorOptions.light;
        const colorArray = this.particleSystem.geometry.attributes.color.array;
        
        // Smoothly transition colors
        const startColors = [...colorArray];
        const endColors = [];
        
        for (let i = 0; i < colorArray.length; i += 3) {
            const colorIndex = Math.floor(Math.random() * colors.length);
            const color = new THREE.Color(colors[colorIndex]);
            endColors.push(color.r, color.g, color.b);
        }

        // Animate color transition
        const duration = 500; // 500ms
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            for (let i = 0; i < colorArray.length; i++) {
                colorArray[i] = startColors[i] + (endColors[i] - startColors[i]) * progress;
            }
            
            this.particleSystem.geometry.attributes.color.needsUpdate = true;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }

    onDocumentMouseMove(event) {
        try {
            this.mouseX = (event.clientX - this.windowHalfX) * 0.5;
            this.mouseY = (event.clientY - this.windowHalfY) * 0.5;
        } catch (error) {
            console.error('Error in mouse move handler:', error);
        }
    }

    onWindowResize() {
        try {
            this.windowHalfX = window.innerWidth / 2;
            this.windowHalfY = window.innerHeight / 2;
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        } catch (error) {
            console.error('Error in window resize handler:', error);
        }
    }

    animate() {
        try {
            requestAnimationFrame(this.animate.bind(this));

            // Update time uniform for shader
            this.particleSystem.material.uniforms.time.value += 0.01;

            // Smooth mouse movement
            this.targetX = this.mouseX * 0.001;
            this.targetY = this.mouseY * 0.001;

            // Rotate particle system
            this.particleSystem.rotation.y += 0.0005;
            this.particleSystem.rotation.x += 0.0005;

            // Add mouse interaction
            this.particleSystem.rotation.y += (this.targetX - this.particleSystem.rotation.y) * 0.05;
            this.particleSystem.rotation.x += (this.targetY - this.particleSystem.rotation.x) * 0.05;

            // Add wave motion to particles
            const positions = this.particleSystem.geometry.attributes.position.array;
            const time = Date.now() * 0.001;

            for (let i = 0; i < positions.length; i += 3) {
                const x = positions[i];
                const y = positions[i + 1];
                const z = positions[i + 2];

                // Add wave motion
                positions[i + 1] = y + Math.sin(time + x * 0.001) * 0.5;
                positions[i + 2] = z + Math.cos(time + x * 0.001) * 0.5;
            }

            this.particleSystem.geometry.attributes.position.needsUpdate = true;

            this.renderer.render(this.scene, this.camera);
        } catch (error) {
            console.error('Error in animation loop:', error);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Initialize background animation
        const backgroundAnimation = new BackgroundAnimation();

        // Initialize mobile menu
        const mobileMenuButton = document.querySelector('.mobile-menu-button');
        const mobileMenu = document.querySelector('.mobile-menu');

        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }

        // Initialize contact form
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                // Add your form submission logic here
                console.log('Form submitted');
            });
        }

        // Initialize portfolio filters
        const filterButtons = document.querySelectorAll('.portfolio-filter button');
        const portfolioItems = document.querySelectorAll('.portfolio-item');

        if (filterButtons.length && portfolioItems.length) {
            filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const filter = button.getAttribute('data-filter');
                    
                    // Update active button
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');

                    // Filter items
                    portfolioItems.forEach(item => {
                        if (filter === 'all' || item.getAttribute('data-category') === filter) {
                            item.style.display = 'block';
                        } else {
                            item.style.display = 'none';
                        }
                    });
                });
            });
        }
    } catch (error) {
        console.error('Error initializing main functionality:', error);
    }
});

// Preloader
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    preloader.style.opacity = '0';
    setTimeout(() => {
        preloader.style.display = 'none';
    }, 500);
});

// Mobile Menu
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    if (!mobileMenu.classList.contains('hidden')) {
        mobileMenu.style.transform = 'translateX(0)';
    } else {
        mobileMenu.style.transform = 'translateX(-100%)';
    }
});

// Close mobile menu when clicking a link
document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenu.style.transform = 'translateX(-100%)';
    });
});

// Scroll Animations
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.service-card, .feature-card, .portfolio-item');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.classList.add('animate-fadeInUp');
        }
    });
};

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Hero Section Animations
const heroTitle = document.getElementById('hero-title');
const heroSubtitle = document.getElementById('hero-subtitle');
const heroCta = document.getElementById('hero-cta');

setTimeout(() => {
    heroTitle.style.opacity = '1';
    heroTitle.style.transform = 'translateY(0)';
}, 500);

setTimeout(() => {
    heroSubtitle.style.opacity = '1';
    heroSubtitle.style.transform = 'translateY(0)';
}, 800);

setTimeout(() => {
    heroCta.style.opacity = '1';
    heroCta.style.transform = 'translateY(0)';
}, 1100);

// Portfolio Gallery
const portfolioItems = [
    {
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        category: 'Wedding',
        title: 'Elegant Wedding Ceremony'
    },
    {
        image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        category: 'Portrait',
        title: 'Family Portrait'
    },
    {
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        category: 'Event',
        title: 'Corporate Event'
    },
    {
        image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        category: 'Wedding',
        title: 'Beach Wedding'
    },
    {
        image: 'https://images.unsplash.com/photo-1504439904031-93ded9f93e4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        category: 'Portrait',
        title: 'Professional Headshot'
    },
    {
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        category: 'Event',
        title: 'Birthday Party'
    },
    {
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        category: 'Wedding',
        title: 'Garden Wedding'
    },
    {
        image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        category: 'Portrait',
        title: 'Couple Session'
    }
];

const portfolioGrid = document.querySelector('#portfolio .grid');

const loadPortfolioItems = () => {
    portfolioItems.forEach(item => {
        const portfolioItem = document.createElement('div');
        portfolioItem.className = 'relative overflow-hidden rounded-lg group';
        portfolioItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
            <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div class="text-white text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 class="text-xl font-semibold mb-2">${item.title}</h3>
                    <p class="text-sm">${item.category}</p>
                </div>
            </div>
        `;
        portfolioGrid.appendChild(portfolioItem);
    });
};

// Testimonials
const testimonials = [
    {
        name: 'Sarah Johnson',
        role: 'Bride',
        text: 'Dream Photography captured our wedding day perfectly! The photos are absolutely stunning and we couldn\'t be happier with the results.'
    },
    {
        name: 'Michael Chen',
        role: 'Corporate Client',
        text: 'Professional, punctual, and incredibly talented. The team at Dream Photography exceeded our expectations for our company event.'
    },
    {
        name: 'Emily Davis',
        role: 'Family Portrait Client',
        text: 'Our family photos turned out beautiful! The photographer made us all feel comfortable and captured our personalities perfectly.'
    }
];

const testimonialSlider = document.querySelector('.testimonial-slider');

const loadTestimonials = () => {
    testimonials.forEach(testimonial => {
        const testimonialCard = document.createElement('div');
        testimonialCard.className = 'bg-white p-8 rounded-xl shadow-lg transform hover:-translate-y-2 transition-all duration-300';
        testimonialCard.innerHTML = `
            <p class="text-gray-600 mb-6">${testimonial.text}</p>
            <div class="flex items-center">
                <div>
                    <h4 class="font-semibold text-gray-800">${testimonial.name}</h4>
                    <p class="text-sm text-gray-500">${testimonial.role}</p>
                </div>
            </div>
        `;
        testimonialSlider.appendChild(testimonialCard);
    });
};

// Initialize components
document.addEventListener('DOMContentLoaded', () => {
    loadPortfolioItems();
    loadTestimonials();
}); 