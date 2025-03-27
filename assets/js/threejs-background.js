// Interactive 3D Background
class DynamicBackground {
    constructor() {
        this.canvas = document.getElementById('dynamic-bg');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true
        });
        
        this.particles = null;
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.init();
        this.animate();
    }
    
    init() {
        // Set renderer size
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Camera position
        this.camera.position.z = 30;
        
        // Create particles
        const particleCount = 1500;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        
        const colorPalette = [
            new THREE.Color(0x0071e3), // Apple Blue
            new THREE.Color(0x7b64ff), // Purple
            new THREE.Color(0x34c759), // Green
            new THREE.Color(0xff375f), // Pink
            new THREE.Color(0xffffff)  // White
        ];
        
        for (let i = 0; i < particleCount; i++) {
            // Positions
            positions[i * 3] = (Math.random() - 0.5) * 200;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
            
            // Colors
            const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
            
            // Sizes
            sizes[i] = Math.random() * 2;
        }
        
        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        // Particle material
        const particleMaterial = new THREE.PointsMaterial({
            size: 1,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });
        
        this.particles = new THREE.Points(particles, particleMaterial);
        this.scene.add(this.particles);
        
        // Mouse move event
        window.addEventListener('mousemove', (event) => {
            this.mouseX = (event.clientX - window.innerWidth / 2) * 0.0005;
            this.mouseY = (event.clientY - window.innerHeight / 2) * 0.0005;
        });
        
        // Window resize event
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Rotate particles
        if (this.particles) {
            this.particles.rotation.x += 0.0005 + this.mouseY;
            this.particles.rotation.y += 0.001 + this.mouseX;
        }
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('dynamic-bg')) {
        new DynamicBackground();
    }
});