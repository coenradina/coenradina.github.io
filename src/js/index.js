document.addEventListener('DOMContentLoaded', function() {
    const scrollDownArrow = document.getElementById('scroll-down-arrow');
    const nextSection = document.getElementById('about');

    scrollDownArrow.addEventListener('click', function() {
        const navHeight = document.querySelector('nav').offsetHeight;
        const targetPosition = nextSection.offsetTop - navHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    });

    initNavAnimation();
    initGlassmorphism();
    initColorSwitcher();

    // Trigger the default color
    const defaultColor = document.querySelector('.color-option.active');
    if (defaultColor) {
        defaultColor.click();
    }

    // Update the form submission handler
    const contactForm = document.getElementById('contactForm');
    const emailConfirmModal = document.getElementById('emailConfirmModal');
    const confirmEmailBtn = document.getElementById('confirmEmail');
    const cancelEmailBtn = document.getElementById('cancelEmail');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            emailConfirmModal.classList.remove('hidden');
        });

        confirmEmailBtn.addEventListener('click', function() {
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Construct email body
            const mailtoLink = `mailto:inquiries.astridcoenrad@gmail.com?subject=Portfolio Contact: ${encodeURIComponent(name)}&body=${encodeURIComponent(
                `Hello, I'm ${name}\nYou can reach me at ${email}\n\nI'm reaching out regarding:\n${message}`
            )}`;
            
            // Open default email client
            window.location.href = mailtoLink;
            
            // Clear form and hide modal
            contactForm.reset();
            emailConfirmModal.classList.add('hidden');
        });

        cancelEmailBtn.addEventListener('click', function() {
            emailConfirmModal.classList.add('hidden');
        });

        // Close modal when clicking outside
        emailConfirmModal.addEventListener('click', function(e) {
            if (e.target === emailConfirmModal) {
                emailConfirmModal.classList.add('hidden');
            }
        });
    }
});

function initNavAnimation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('mousemove', (e) => {
            const rect = link.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate distance from center
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Magnetic effect
            const deltaX = (x - centerX) * 0.2;
            const deltaY = (y - centerY) * 0.2;
            
            link.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            
            // Update gradient position
            const gradientX = (x / rect.width) * 100;
            link.style.setProperty('--x', `${gradientX}%`);
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.transform = 'translate(0, 0)';
        });
    });
}

function initGlassmorphism() {
    const glassContainers = document.querySelectorAll('.glass-container');
    const glassBlur = document.querySelector('.glass-blur');

    document.addEventListener('mousemove', (e) => {
        requestAnimationFrame(() => {
            if (glassBlur) {
                const x = (e.clientX / window.innerWidth) * 100;
                const y = (e.clientY / window.innerHeight) * 100;
                
                glassBlur.style.setProperty('--mouse-x', `${x}%`);
                glassBlur.style.setProperty('--mouse-y', `${y}%`);
            }

            glassContainers.forEach(container => {
                const rect = container.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Smooth the movement with lerp (linear interpolation)
                const currentX = parseFloat(container.style.getPropertyValue('--mouse-x')) || x;
                const currentY = parseFloat(container.style.getPropertyValue('--mouse-y')) || y;
                
                const newX = currentX + (x - currentX) * 0.1;
                const newY = currentY + (y - currentY) * 0.1;
                
                container.style.setProperty('--mouse-x', `${newX}px`);
                container.style.setProperty('--mouse-y', `${newY}px`);
            });
        });
    });

    // Add hover effect for touch devices
    glassContainers.forEach(container => {
        container.addEventListener('touchstart', () => {
            container.classList.add('hover');
        });
        
        container.addEventListener('touchend', () => {
            container.classList.remove('hover');
        });
    });
}

function initColorSwitcher() {
    const colorOptions = document.querySelectorAll('.color-option');
    
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            colorOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            const newColor = this.dataset.color;
            const newColorRGB = hexToRGB(newColor);
            
            // Create darker text color by mixing with black
            const darkerColor = createDarkerColor(newColorRGB, 0.7);
            const slightlyDarkerColor = createDarkerColor(newColorRGB, 0.4);
            
            // Create dynamic styles for the entire site
            const styleSheet = document.createElement('style');
            styleSheet.textContent = `
                :root {
                    --theme-primary: ${newColor};
                    --theme-primary-rgb: ${newColorRGB.r}, ${newColorRGB.g}, ${newColorRGB.b};
                }
                
                .text-primary {
                    color: ${newColor} !important;
                }
                
                .text-secondary {
                    color: ${slightlyDarkerColor} !important;
                }
                
                .border-primary {
                    border-color: ${newColor} !important;
                }
                
                .section-title {
                    color: ${slightlyDarkerColor} !important;
                }
                
                .card-base {
                    border-color: ${newColor} !important;
                    background-color: rgba(var(--theme-primary-rgb), 0.03);
                }
                
                .card-base:hover {
                    border-color: ${newColor} !important;
                    background-color: rgba(var(--theme-primary-rgb), 0.08);
                    box-shadow: 0 8px 32px rgba(var(--theme-primary-rgb), 0.15);
                }
                
                .glass-container {
                    border-color: rgba(var(--theme-primary-rgb), 0.2);
                }
                
                .glass-container:hover {
                    border-color: rgba(var(--theme-primary-rgb), 0.4);
                }
                
                .glass-container svg {
                    color: ${newColor} !important;
                }
                
                .nav-link:hover {
                    color: ${newColor} !important;
                }
                
                .nav-link.active {
                    color: ${newColor} !important;
                }
                
                .nav-link::before {
                    background: linear-gradient(
                        90deg,
                        rgba(var(--theme-primary-rgb), 0) 0%,
                        rgba(var(--theme-primary-rgb), 0.8) 50%,
                        rgba(var(--theme-primary-rgb), 0) 100%
                    ) !important;
                }
                
                .explore-link {
                    background-color: ${newColor};
                    border-color: ${newColor};
                }
                
                .explore-link:hover {
                    background-color: transparent;
                    border-color: ${newColor};
                    color: ${darkerColor};
                }
                
                .explore-link:hover svg {
                    color: ${darkerColor};
                }
                
                .bg-background-dark {
                    background-color: ${createDarkerColor(newColorRGB, 0.55)} !important;
                }

                .bg-background-normal {
                    background-color: rgba(var(--theme-primary-rgb), 0.1);
                }
                
                footer a:hover {
                    color: ${newColor} !important;
                }
                
                h3 {
                    color: ${darkerColor};
                }
                
                p {
                    color: ${darkerColor};
                }
                
                .glass-blur {
                    background: radial-gradient(
                        circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
                        rgba(var(--theme-primary-rgb), 0.2),
                        rgba(var(--theme-primary-rgb), 0.2),
                        transparent 70%
                    );
                }
                
                /* Update specific text elements */
                .typing-text, .typing-text::after {
                    color: ${createDarkerColor(newColorRGB, 0.6)} !important;
                }
                
                /* Project section text */
                .card-base h3 {
                    color: ${createDarkerColor(newColorRGB, 0.7)} !important;
                }
                
                .card-base p {
                    color: ${createDarkerColor(newColorRGB, 0.8)} !important;
                }
                
                /* Keep footer text light for contrast */
                footer p, 
                footer .text-text,
                footer a {
                    color: rgba(255, 255, 255, 0.9) !important;
                }
                
                /* Contact Form Styles */
                input:focus, textarea:focus {
                    border-color: ${newColor} !important;
                    box-shadow: 0 0 15px rgba(var(--theme-primary-rgb), 0.1) !important;
                }
                
                form button {
                    background-color: ${newColor} !important;
                }
                
                form button:hover {
                    background-color: ${createDarkerColor(newColorRGB, 0.2)} !important;
                }
            `;
            
            // Remove any previous color switcher styles
            const existingStyles = document.querySelectorAll('style[data-color-switcher]');
            existingStyles.forEach(style => style.remove());
            
            // Add the new styles
            styleSheet.setAttribute('data-color-switcher', '');
            document.head.appendChild(styleSheet);
            
            // Add liquid transition effect to all cards
            const cards = document.querySelectorAll('.card-base');
            cards.forEach(card => {
                card.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    card.style.transform = 'scale(1)';
                }, 200);
            });
        });
    });
}

// Helper function to convert hex to RGB
function hexToRGB(hex) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return { r, g, b };
}

// Update the helper function to create better darker colors
function createDarkerColor(rgb, darknessFactor) {
    // Mix the color with black, but preserve some color saturation
    const r = Math.round(rgb.r * (1 - darknessFactor));
    const g = Math.round(rgb.g * (1 - darknessFactor));
    const b = Math.round(rgb.b * (1 - darknessFactor));
    return `rgb(${r}, ${g}, ${b})`;
}