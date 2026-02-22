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

    // Initialize sidebar functionality
    initSidebar();

    // Initialize social links visibility on scroll
    initSocialLinksScroll();

    // Initialize skills filter
    initSkillsFilter();

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

// Skills now use tech-badges with built-in hover effects
function addSkillIcons() {
    // Tech badges already have shimmer hover effects built-in
    // No additional JavaScript needed for skills section
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

// Initialize sidebar functionality
function initSidebar() {
    const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
    const sections = document.querySelectorAll('section[id]');
    const sidebarMenu = document.querySelector('.sidebar-menu');

    // Handle mobile sidebar scroll - auto-scroll to active link on mobile
    function scrollSidebarMenuIntoView() {
        if (window.innerWidth <= 768 && sidebarMenu) {
            const activeLink = document.querySelector('.sidebar-menu a.active');
            if (activeLink) {
                // Scroll the menu so active link is visible
                const linkLeft = activeLink.offsetLeft;
                const linkWidth = activeLink.offsetWidth;
                const scrollLeft = sidebarMenu.scrollLeft;
                const menuWidth = sidebarMenu.clientWidth;

                // Check if link is outside visible area
                if (linkLeft < scrollLeft) {
                    // Link is to the left, scroll left
                    sidebarMenu.scrollLeft = linkLeft - 20;
                } else if (linkLeft + linkWidth > scrollLeft + menuWidth) {
                    // Link is to the right, scroll right
                    sidebarMenu.scrollLeft = linkLeft + linkWidth - menuWidth + 20;
                }

                // Smooth scroll behavior
                sidebarMenu.style.scrollBehavior = 'smooth';
            }
        }
    }

    // Add smooth scrolling to sidebar links
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 20; // Small offset for better positioning
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update active state based on scroll position
    function updateActiveLink() {
        let current = '';
        const scrollPosition = window.scrollY + 100; // Offset for better detection

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        // Remove active class from all links
        sidebarLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to current section link
        if (current) {
            const activeLink = document.querySelector(`.sidebar-menu a[href="#${current}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
                // Scroll sidebar menu on mobile to show active link
                scrollSidebarMenuIntoView();
            }
        }
    }

    // Listen for scroll events
    window.addEventListener('scroll', updateActiveLink);

    // Handle window resize to update sidebar behavior
    window.addEventListener('resize', () => {
        updateActiveLink();
    });

    // Set initial active state
    updateActiveLink();
}

// Contact form handling: client-side validation and POST to backend
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const status = document.getElementById('contactStatus');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const data = {
            name: form.name.value.trim(),
            email: form.email.value.trim(),
            subject: form.subject.value.trim(),
            message: form.message.value.trim()
        };

        // Basic client-side validation
        if (!data.name || !data.email || !data.message) {
            status.textContent = 'Please fill in required fields.';
            return;
        }

        status.textContent = 'Sending...';
        try {
            const resp = await fetch('https://187dac84-fe0f-4061-ac8c-892e108e3c72-00-g9doyuytljc.spock.replit.dev/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (resp.ok) {
                status.textContent = 'Message sent — thank you!';
                form.reset();
            } else {
                const err = await resp.json().catch(() => ({}));
                status.textContent = err.error || 'Failed to send message.';
            }
        } catch (err) {
            status.textContent = 'Network error — try again later.';
        }
    });
});
// ===== THEME TOGGLE FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
    const themeToggleCheckbox = document.getElementById('themeToggle');
    const body = document.body;

    // Check for saved theme preference or default to dark mode
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    // Apply saved theme on page load
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        themeToggleCheckbox.checked = false;  // Unchecked = light mode (sun visible)
    } else {
        body.classList.remove('light-mode');
        themeToggleCheckbox.checked = true;   // Checked = dark mode (moon visible)
    }

    // Toggle theme on checkbox change
    themeToggleCheckbox.addEventListener('change', function(e) {
        // Toggle light mode class
        body.classList.toggle('light-mode');
        
        // Determine current theme
        const isLightMode = body.classList.contains('light-mode');
        
        // Save preference to localStorage
        localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
    });
});

// ===== LANGUAGE SWITCHING FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
    const langToggle = document.getElementById('langToggle');
    const langDropdown = document.getElementById('langDropdown');
    const langOptions = document.querySelectorAll('.lang-option');
    const html = document.documentElement;
    
    // Set language from localStorage or default to 'en'
    const savedLang = localStorage.getItem('language') || 'en';
    html.lang = savedLang;
    
    // Update toggle button text
    const langMap = { 'en': 'US', 'fr': 'FR', 'es': 'ES', 'ar': 'MA' };
    langToggle.textContent = langMap[savedLang] || 'US';
    
    // Set RTL for Arabic
    if (savedLang === 'ar') {
        html.dir = 'rtl';
        document.body.dir = 'rtl';
    } else {
        html.dir = 'ltr';
        document.body.dir = 'ltr';
    }
    
    // Toggle dropdown on button click
    langToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        langDropdown.style.display = langDropdown.style.display === 'none' ? 'block' : 'none';
    });
    
    // Handle language option selection
    langOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            const newLang = this.getAttribute('data-value');
            localStorage.setItem('language', newLang);
            html.lang = newLang;
            
            // Update toggle button text
            langToggle.textContent = langMap[newLang] || newLang.toUpperCase();
            
            // Set text direction for RTL languages
            if (newLang === 'ar') {
                html.dir = 'rtl';
                document.body.dir = 'rtl';
            } else {
                html.dir = 'ltr';
                document.body.dir = 'ltr';
            }
            
            // Close dropdown
            langDropdown.style.display = 'none';
            
            // Update page text with new language
            updatePageLanguage(newLang);
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.lang-dropdown-wrapper')) {
            langDropdown.style.display = 'none';
        }
    });
    
    // Initialize page with saved language
    updatePageLanguage(savedLang);
});

// Function to update ALL translatable content on the page
function updatePageLanguage(lang) {
    if (typeof translations === 'undefined') return;
    
    const trans = translations[lang] || translations['en'];
    
    // Update ALL elements with data-i18n-html (preferred) and data-i18n
    document.querySelectorAll('[data-i18n-html]').forEach(element => {
        const key = element.getAttribute('data-i18n-html');
        if (trans[key]) {
            element.innerHTML = trans[key];
        }
    });

    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (trans[key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = trans[key];
            } else {
                element.textContent = trans[key];
            }
        }
    });
    
    // Update sidebar menu titles
    document.querySelector('a[href="#hero"]')?.setAttribute('title', trans.home);
    document.querySelector('a[href="#about"]')?.setAttribute('title', trans.about);
    document.querySelector('a[href="#skills"]')?.setAttribute('title', trans.skills);
    document.querySelector('a[href="#projects"]')?.setAttribute('title', trans.projects);
    document.querySelector('a[href="#certifications"]')?.setAttribute('title', trans.certifications);
    document.querySelector('a[href="#cv-download"]')?.setAttribute('title', trans.resume);
    document.querySelector('a[href="#contact"]')?.setAttribute('title', trans.contact);
    
    // STATIC TEXT TRANSLATIONS
    // Hero Section
    const heroTitle = document.querySelector('#hero h1');
    if (heroTitle) heroTitle.innerHTML = trans.heroTitle;
    
    const viewProjectsBtn = document.querySelector('#hero .cta-button');
    if (viewProjectsBtn) viewProjectsBtn.innerHTML = '<i class="fas fa-code"></i> ' + trans.viewProject;
    
    // About Section - Keep custom heading, don't override
    // const aboutHeading = document.querySelector('#about h2');
    // if (aboutHeading) aboutHeading.textContent = trans.aboutHeading;
    
    const aboutLine = document.querySelector('#about .about-animated:nth-of-type(2)');
    if (aboutLine) aboutLine.innerHTML = trans.aboutLine1;
    
    // Skills Section
    const skillsHeading = document.querySelector('#skills h2');
    if (skillsHeading) skillsHeading.textContent = trans.skillsHeading;
    
    // Languages Section
    const langHeading = document.querySelector('#languages h2');
    if (langHeading) langHeading.textContent = trans.languageProf;
    
    // Projects Section
    const projectsHeading = document.querySelector('#projects h2');
    if (projectsHeading) projectsHeading.innerHTML = trans.projectsHeading;
    
    // Certifications Section
    const certsHeading = document.querySelector('#certifications h2');
    if (certsHeading) certsHeading.textContent = trans.certsHeading;
    
    // CV Section
    const cvHeading = document.querySelector('#cv-download h2');
    if (cvHeading) cvHeading.textContent = trans.cvHeading;
    
    const cvDescription = document.querySelector('#cv-download p');
    if (cvDescription) cvDescription.textContent = trans.cvDescription;
    
    // Contact Section
    const contactHeading = document.querySelector('#contact h2');
    if (contactHeading) contactHeading.textContent = trans.contactHeading;
    
    const nameLabel = document.querySelector('label[for="name"]');
    if (nameLabel) nameLabel.textContent = trans.contactName;
    
    const emailLabel = document.querySelector('label[for="email"]');
    if (emailLabel) emailLabel.textContent = trans.contactEmail;
    
    const subjectLabel = document.querySelector('label[for="subject"]');
    if (subjectLabel) subjectLabel.textContent = trans.contactSubject;
    
    const messageLabel = document.querySelector('label[for="message"]');
    if (messageLabel) messageLabel.textContent = trans.contactMessage;
    
    const nameInput = document.getElementById('name');
    if (nameInput) nameInput.placeholder = trans.contactPlaceholder;
    
    const emailInput = document.getElementById('email');
    if (emailInput) emailInput.placeholder = trans.contactEmailPlaceholder;
    
    const subjectInput = document.getElementById('subject');
    if (subjectInput) subjectInput.placeholder = trans.contactSubjectPlaceholder;
    
    const messageInput = document.getElementById('message');
    if (messageInput) messageInput.placeholder = trans.contactMessagePlaceholder;
    
    const submitBtn = document.getElementById('contactSubmit');
    if (submitBtn) submitBtn.textContent = trans.sendMessage;
    
    // Footer
    const footer = document.querySelector('footer p');
    if (footer) footer.textContent = trans.copyright;
}

// Initialize social links visibility on hero section
function initSocialLinksScroll() {
    const socialLinks = document.querySelector('.social-links-hero');
    const heroSection = document.querySelector('#hero');
    
    if (!socialLinks || !heroSection) return;
    
    window.addEventListener('scroll', function() {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        const currentScroll = window.scrollY;
        
        // Show social links only while in hero section
        if (currentScroll < heroBottom - 50) {
            socialLinks.classList.remove('hidden');
        } else {
            socialLinks.classList.add('hidden');
        }
    });
}

// Initialize Skills Filter
function initSkillsFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const skillsCategories = document.querySelectorAll('.skills-category');
    
    if (!filterButtons.length) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter and animate skills categories
            skillsCategories.forEach(category => {
                const categoryValue = category.getAttribute('data-category');
                
                if (filterValue === 'all' || categoryValue === filterValue) {
                    // Show category with animation
                    category.style.display = 'block';
                    setTimeout(() => {
                        category.classList.add('show');
                    }, 10);
                } else {
                    // Hide category with animation
                    category.classList.remove('show');
                    setTimeout(() => {
                        category.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Show all on initial load
    skillsCategories.forEach(category => {
        category.classList.add('show');
    });
    
    // Trigger initial state
    window.dispatchEvent(new Event('scroll'));
}