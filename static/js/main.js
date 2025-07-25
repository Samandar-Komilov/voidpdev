// static/js/main.js

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Animate hamburger menu
            const bars = navToggle.querySelectorAll('.bar');
            bars.forEach((bar, index) => {
                if (navMenu.classList.contains('active')) {
                    if (index === 0) bar.style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                    if (index === 1) bar.style.opacity = '0';
                    if (index === 2) bar.style.transform = 'rotate(45deg) translate(-5px, -6px)';
                } else {
                    bar.style.transform = 'none';
                    bar.style.opacity = '1';
                }
            });
        });

        // Close mobile menu when clicking on links
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const bars = navToggle.querySelectorAll('.bar');
                bars.forEach(bar => {
                    bar.style.transform = 'none';
                    bar.style.opacity = '1';
                });
            });
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add scroll effect to navbar
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // Add fade-in animation for elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.skill-card, .project-card, .blog-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Search functionality enhancements
    const searchInput = document.querySelector('input[name="search"]');
    if (searchInput) {
        // Add search icon
        const searchContainer = searchInput.parentElement;
        searchContainer.style.position = 'relative';
        
        const searchIcon = document.createElement('div');
        searchIcon.innerHTML = '🔍';
        searchIcon.style.position = 'absolute';
        searchIcon.style.right = '12px';
        searchIcon.style.top = '50%';
        searchIcon.style.transform = 'translateY(-50%)';
        searchIcon.style.pointerEvents = 'none';
        searchIcon.style.color = '#64748b';
        searchContainer.appendChild(searchIcon);

        searchInput.style.paddingRight = '40px';

        // Clear search functionality
        const clearButton = document.createElement('button');
        clearButton.innerHTML = '✕';
        clearButton.style.position = 'absolute';
        clearButton.style.right = '40px';
        clearButton.style.top = '50%';
        clearButton.style.transform = 'translateY(-50%)';
        clearButton.style.border = 'none';
        clearButton.style.background = 'none';
        clearButton.style.cursor = 'pointer';
        clearButton.style.display = 'none';
        clearButton.style.color = '#64748b';
        clearButton.style.fontSize = '16px';

        clearButton.addEventListener('click', function() {
            searchInput.value = '';
            clearButton.style.display = 'none';
            searchInput.dispatchEvent(new Event('keyup'));
        });

        searchInput.addEventListener('input', function() {
            if (this.value.length > 0) {
                clearButton.style.display = 'block';
                searchIcon.style.display = 'none';
            } else {
                clearButton.style.display = 'none';
                searchIcon.style.display = 'block';
            }
        });

        searchContainer.appendChild(clearButton);
    }

    // Enhanced project filtering
    const techFilter = document.getElementById('tech-filter');
    if (techFilter) {
        // Add loading state for filter changes
        techFilter.addEventListener('change', function() {
            const projectsContainer = document.getElementById('projects-container');
            if (projectsContainer) {
                projectsContainer.style.opacity = '0.6';
                projectsContainer.style.pointerEvents = 'none';
            }
        });

        // Listen for HTMX afterSwap to restore normal state
        document.body.addEventListener('htmx:afterSwap', function(event) {
            if (event.target.id === 'projects-container') {
                event.target.style.opacity = '1';
                event.target.style.pointerEvents = 'auto';
                
                // Re-apply animations to new elements
                const newElements = event.target.querySelectorAll('.project-card');
                newElements.forEach(el => {
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(20px)';
                    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    
                    setTimeout(() => {
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                    }, 100);
                });
            }
        });
    }

    // Blog search with debouncing
    let searchTimeout;
    const blogSearchInput = document.querySelector('.blog-controls input[name="search"]');
    if (blogSearchInput) {
        blogSearchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const blogContent = document.getElementById('blog-content');
            
            searchTimeout = setTimeout(() => {
                if (blogContent) {
                    blogContent.style.opacity = '0.6';
                }
            }, 100);
        });

        // Restore opacity after HTMX swap
        document.body.addEventListener('htmx:afterSwap', function(event) {
            if (event.target.id === 'blog-content') {
                event.target.style.opacity = '1';
                
                // Re-apply animations
                const newCards = event.target.querySelectorAll('.blog-card');
                newCards.forEach((card, index) => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
        });
    }

    // Copy code functionality for code blocks
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach(codeBlock => {
        const pre = codeBlock.parentElement;
        pre.style.position = 'relative';
        
        const copyButton = document.createElement('button');
        copyButton.innerHTML = 'Copy';
        copyButton.className = 'copy-code-btn';
        copyButton.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            padding: 5px 10px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 4px;
            color: #fff;
            font-size: 12px;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        copyButton.addEventListener('click', async function() {
            try {
                await navigator.clipboard.writeText(codeBlock.textContent);
                copyButton.innerHTML = 'Copied!';
                copyButton.style.background = 'rgba(34, 197, 94, 0.2)';
                
                setTimeout(() => {
                    copyButton.innerHTML = 'Copy';
                    copyButton.style.background = 'rgba(255, 255, 255, 0.1)';
                }, 2000);
            } catch (err) {
                copyButton.innerHTML = 'Failed';
                setTimeout(() => {
                    copyButton.innerHTML = 'Copy';
                }, 2000);
            }
        });

        pre.addEventListener('mouseenter', () => {
            copyButton.style.opacity = '1';
        });

        pre.addEventListener('mouseleave', () => {
            copyButton.style.opacity = '0';
        });

        pre.appendChild(copyButton);
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('input[name="search"]');
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        }

        // Escape to clear search
        if (e.key === 'Escape') {
            const searchInput = document.querySelector('input[name="search"]');
            if (searchInput && document.activeElement === searchInput) {
                searchInput.blur();
                if (searchInput.value) {
                    searchInput.value = '';
                    searchInput.dispatchEvent(new Event('keyup'));
                }
            }
        }
    });

    // Back to top button
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '↑';
    backToTopButton.className = 'back-to-top';
    backToTopButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--primary-color);
        color: white;
        border: none;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: var(--shadow-lg);
    `;

    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    document.body.appendChild(backToTopButton);

    // Show/hide back to top button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.style.opacity = '1';
            backToTopButton.style.visibility = 'visible';
        } else {
            backToTopButton.style.opacity = '0';
            backToTopButton.style.visibility = 'hidden';
        }
    });

    // Lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // Reading progress bar for blog posts
    if (document.querySelector('.blog-post')) {
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: var(--primary-color);
            z-index: 1001;
            transition: width 0.3s ease;
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', function() {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }

    // Enhanced form interactions
    const formInputs = document.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
        // Add focus/blur effects
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            if (this.value) {
                this.parentElement.classList.add('has-value');
            } else {
                this.parentElement.classList.remove('has-value');
            }
        });

        // Initialize state
        if (input.value) {
            input.parentElement.classList.add('has-value');
        }
    });

    // Theme preference detection and persistence
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme');
    
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
    }

    // Auto-save form data (for admin forms)
    const autoSaveForms = document.querySelectorAll('form[data-autosave]');
    autoSaveForms.forEach(form => {
        const formId = form.id || 'unnamed-form';
        
        // Load saved data
        const savedData = localStorage.getItem(`form-${formId}`);
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                Object.keys(data).forEach(key => {
                    const input = form.querySelector(`[name="${key}"]`);
                    if (input && input.type !== 'file') {
                        input.value = data[key];
                    }
                });
            } catch (e) {
                console.warn('Could not restore form data:', e);
            }
        }

        // Save data on change
        form.addEventListener('input', function() {
            const formData = new FormData(form);
            const data = {};
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            localStorage.setItem(`form-${formId}`, JSON.stringify(data));
        });

        // Clear saved data on successful submit
        form.addEventListener('submit', function() {
            setTimeout(() => {
                if (!form.querySelector('.error')) {
                    localStorage.removeItem(`form-${formId}`);
                }
            }, 1000);
        });
    });

    // Performance monitoring
    if (window.performance) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                
                // Log performance (in development)
                if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                    console.log(`Page load time: ${pageLoadTime}ms`);
                }
                
                // Send to analytics if needed
                // analytics.track('page_load_time', { duration: pageLoadTime });
            }, 0);
        });
    }

    // Error handling for HTMX requests
    document.body.addEventListener('htmx:responseError', function(event) {
        console.error('HTMX Error:', event.detail);
        
        // Show user-friendly error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ef4444;
            color: white;
            padding: 1rem;
            border-radius: 8px;
            z-index: 1002;
            max-width: 300px;
            box-shadow: var(--shadow-lg);
        `;
        errorDiv.textContent = 'Something went wrong. Please try again.';
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    });

    // Success message handling for HTMX
    document.body.addEventListener('htmx:afterSwap', function(event) {
        // Check if the response contains a success message
        const successElement = event.target.querySelector('.success-message');
        if (successElement) {
            successElement.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #22c55e;
                color: white;
                padding: 1rem;
                border-radius: 8px;
                z-index: 1002;
                max-width: 300px;
                box-shadow: var(--shadow-lg);
                animation: slideInRight 0.3s ease;
            `;
            
            setTimeout(() => {
                successElement.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => successElement.remove(), 300);
            }, 3000);
        }
    });

    console.log('Portfolio JavaScript initialized');
});

// CSS animations for messages
const messageStyles = document.createElement('style');
messageStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(messageStyles);