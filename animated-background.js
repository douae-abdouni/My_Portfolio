// Animated Network Background
class NetworkBackground {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.connections = [];
        this.mouse = { x: 0, y: 0 };
        this.animationId = null;
        
        // Configuration - optimized for full page with enhanced visibility
        this.config = {
            particleCount: this.getOptimalParticleCount(),
            maxDistance: 130,
            particleSpeed: 0.4,
            particleSize: 2.5,
            connectionOpacity: 0.25, // Increased for better visibility
            particleOpacity: 0.8, // Increased for better visibility
            mouseRadius: 160,
            colors: {
                particles: '#64ffda',
                connections: '#64ffda',
                mouseConnections: '#ff4d00'
            }
        };
        
        this.init();
    }

    getOptimalParticleCount() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const screenArea = window.innerWidth * window.innerHeight;
        const baseCount = Math.floor(screenArea / 15000); // Adjust density based on screen size

        if (isMobile) {
            return Math.min(baseCount * 0.6, 50); // Reduce for mobile
        }
        return Math.min(baseCount, 120); // Cap at 120 for performance
    }

    init() {
        this.resizeCanvas();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }

    resizeCanvas() {
        // Full viewport size for global background
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        this.particles = [];
        // Recalculate particle count on resize
        this.config.particleCount = this.getOptimalParticleCount();

        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * this.config.particleSpeed,
                vy: (Math.random() - 0.5) * this.config.particleSpeed,
                size: Math.random() * this.config.particleSize + 1
            });
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.createParticles();
        });

        // Use document for full-page mouse tracking
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        document.addEventListener('mouseleave', () => {
            this.mouse.x = -1000;
            this.mouse.y = -1000;
        });
    }
    
    updateParticles() {
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -1;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -1;
            }
            
            // Keep particles within bounds
            particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
        });
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = this.config.colors.particles;
            this.ctx.globalAlpha = this.config.particleOpacity;
            this.ctx.fill();
        });
    }
    
    drawConnections() {
        this.ctx.globalAlpha = this.config.connectionOpacity;
        this.ctx.strokeStyle = this.config.colors.connections;
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.config.maxDistance) {
                    const opacity = (this.config.maxDistance - distance) / this.config.maxDistance;
                    this.ctx.globalAlpha = opacity * this.config.connectionOpacity;
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
    
    drawMouseConnections() {
        if (this.mouse.x < 0 || this.mouse.y < 0) return;
        
        this.ctx.strokeStyle = this.config.colors.mouseConnections;
        this.ctx.lineWidth = 2;
        
        this.particles.forEach(particle => {
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.config.mouseRadius) {
                const opacity = (this.config.mouseRadius - distance) / this.config.mouseRadius;
                this.ctx.globalAlpha = opacity * 0.3;
                
                this.ctx.beginPath();
                this.ctx.moveTo(particle.x, particle.y);
                this.ctx.lineTo(this.mouse.x, this.mouse.y);
                this.ctx.stroke();
            }
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.updateParticles();
        this.drawConnections();
        this.drawParticles();
        this.drawMouseConnections();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        window.removeEventListener('resize', this.resizeCanvas);
    }
}

// Initialize the network background when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const networkCanvas = document.getElementById('networkCanvas');
    if (networkCanvas) {
        new NetworkBackground('networkCanvas');
    }
});

// Performance optimization for mobile devices
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
if (isMobile) {
    // Maintain visibility on mobile while optimizing performance
    document.addEventListener('DOMContentLoaded', () => {
        const style = document.createElement('style');
        style.textContent = `
            .animated-background-global {
                opacity: 0.7; /* Keep more visible on mobile */
            }
        `;
        document.head.appendChild(style);
    });
}
