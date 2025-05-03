// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add reveal classes to elements
    addRevealClasses();

    // Initialize scroll reveal
    initScrollReveal();

    // Add icons to skills
    addSkillIcons();

    // Initialize typing effect
    initTypingEffect();

    // Optional: Initialize particle background
    // initParticles();
});

// Add reveal classes to elements for animation
function addRevealClasses() {
    // About section
    document.querySelector('#about .about-text').classList.add('reveal', 'fade-left');
    document.querySelector('#about .profile-img').classList.add('reveal', 'fade-right');

    // Skills section
    document.querySelectorAll('.skills-category').forEach(category => {
        category.classList.add('reveal', 'fade-bottom');
    });

    // Projects
    document.querySelectorAll('.project-item').forEach(project => {
        project.classList.add('reveal');
    });

    // Certifications
    document.querySelectorAll('.certification').forEach(cert => {
        cert.classList.add('reveal', 'fade-bottom');
    });

    // CV Download section
    document.querySelector('#cv-download').classList.add('reveal', 'fade-bottom');

    // Contact section
    document.querySelector('#contact').classList.add('reveal', 'fade-bottom');
}

// Initialize scroll reveal functionality
function initScrollReveal() {
    // Scroll reveal
    window.addEventListener('scroll', reveal);

    // Initial call to reveal elements that are already visible
    reveal();

    function reveal() {
        var reveals = document.querySelectorAll('.reveal');

        for(var i = 0; i < reveals.length; i++) {
            var windowHeight = window.innerHeight;
            var revealTop = reveals[i].getBoundingClientRect().top;
            var revealPoint = 150;

            if(revealTop < windowHeight - revealPoint) {
                reveals[i].classList.add('active');
            }
        }

        // Activate skills categories
        var skillsCategories = document.querySelectorAll('.skills-category');
        for(var i = 0; i < skillsCategories.length; i++) {
            var windowHeight = window.innerHeight;
            var elementTop = skillsCategories[i].getBoundingClientRect().top;
            var elementVisible = 150;

            if(elementTop < windowHeight - elementVisible) {
                skillsCategories[i].classList.add('active');
            }
        }

        // Activate projects with staggered delay
        var projects = document.querySelectorAll('.project-item');
        for(var i = 0; i < projects.length; i++) {
            var windowHeight = window.innerHeight;
            var elementTop = projects[i].getBoundingClientRect().top;
            var elementVisible = 150;

            if(elementTop < windowHeight - elementVisible) {
                setTimeout(function(index) {
                    projects[index].classList.add('active');
                }, i * 300, i);
            }
        }
    }
}

// Add hover effect to skills
function addSkillIcons() {
    // Add hover effect to skills
    const skills = document.querySelectorAll('.skill');

    skills.forEach(skill => {
        skill.addEventListener('mouseenter', function() {
            // Remove active class from all skills
            skills.forEach(s => s.classList.remove('active'));
            // Add active class to hovered skill
            this.classList.add('active');
        });

        skill.addEventListener('mouseleave', function() {
            // Keep JavaScript active by default, remove active from others
            if (!this.querySelector('.skill-name').textContent.includes('JavaScript')) {
                this.classList.remove('active');
            }
        });
    });

    // Make sure JavaScript skill is active by default
    const jsSkill = Array.from(skills).find(skill =>
        skill.querySelector('.skill-name').textContent.includes('JavaScript')
    );

    if (jsSkill) {
        jsSkill.classList.add('active');
    }
}

// Initialize typing effect in hero section
function initTypingEffect() {
    const typedTextSpan = document.querySelector(".typed-text");
    const cursorSpan = document.querySelector(".cursor");

    const textArray = [
        "Software Engineer",
        "Problem Solver",
        "Creative Thinker",
        "Tech Enthusiast"
    ];

    const typingDelay = 100;
    const erasingDelay = 50;
    const newTextDelay = 2000; // Delay between current and next text
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        }
        else {
            cursorSpan.classList.remove("typing");
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex-1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        }
        else {
            cursorSpan.classList.remove("typing");
            textArrayIndex++;
            if(textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingDelay + 1100);
        }
    }

    if(textArray.length) setTimeout(type, newTextDelay + 250);
}

// Particle background effect (optional - can be enabled if desired)
function initParticles() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particles';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none';

    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');

    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Particle properties
    const particles = [];
    const particleCount = 50;

    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 1,
            color: '#64ffda',
            speedX: Math.random() * 0.5 - 0.25,
            speedY: Math.random() * 0.5 - 0.25
        });
    }

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw particles
        for (let i = 0; i < particleCount; i++) {
            const p = particles[i];

            // Move particles
            p.x += p.speedX;
            p.y += p.speedY;

            // Wrap around edges
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = 0.3;
            ctx.fill();

            // Connect particles
            connectParticles(p, particles);
        }
    }

    // Connect particles with lines
    function connectParticles(p, particles) {
        for (let i = 0; i < particles.length; i++) {
            const p2 = particles[i];
            const distance = Math.sqrt(
                Math.pow(p.x - p2.x, 2) +
                Math.pow(p.y - p2.y, 2)
            );

            if (distance < 100) {
                ctx.beginPath();
                ctx.strokeStyle = '#64ffda';
                ctx.globalAlpha = 0.1 * (1 - distance / 100);
                ctx.lineWidth = 0.5;
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        }
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // Start animation
    animate();
}
