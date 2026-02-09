// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');

mobileMenuToggle.addEventListener('click', () => {
    mobileMenuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu when clicking on a link
mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close mobile menu when clicking outside
mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
        mobileMenuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Header scroll effect
let lastScroll = 0;
const header = document.querySelector('.main-header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.feature-card, .stat-card, .gallery-item, .info-card').forEach(el => {
    observer.observe(el);
});

// Form submission
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = contactForm.querySelector('input[type="text"]').value;
        const phone = contactForm.querySelector('input[type="tel"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const classSelected = contactForm.querySelector('select').value;
        const message = contactForm.querySelector('textarea').value;
        
        // WhatsApp message
        const whatsappMessage = `ନମସ୍କାର! 
        
ନାମ: ${name}
ମୋବାଇଲ୍: ${phone}
${email ? `ଇମେଲ୍: ${email}` : ''}
ଶ୍ରେଣୀ: ${classSelected}
${message ? `ମେସେଜ୍: ${message}` : ''}`;
        
        // Encode message for WhatsApp
        const encodedMessage = encodeURIComponent(whatsappMessage);
        const whatsappURL = `https://wa.me/7377311806?text=${encodedMessage}`;
        
        // Open WhatsApp
        window.open(whatsappURL, '_blank');
        
        // Reset form
        contactForm.reset();
        
        // Show success message (optional)
        alert('ଆପଣଙ୍କ ମେସେଜ୍ ପଠାଯାଇଛି! ଆମେ ଶୀଘ୍ର ଯୋଗାଯୋଗ କରିବୁ।');
    });
}

// Pause admission notice animation on hover
const noticeContent = document.querySelector('.notice-content');
if (noticeContent) {
    noticeContent.addEventListener('mouseenter', () => {
        noticeContent.style.animationPlayState = 'paused';
    });
    
    noticeContent.addEventListener('mouseleave', () => {
        noticeContent.style.animationPlayState = 'running';
    });
}

// Add active state to navigation based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.main-nav a, .mobile-menu a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add click to call functionality for all phone numbers
document.querySelectorAll('a[href^="tel:"]').forEach(tel => {
    tel.addEventListener('click', (e) => {
        // Analytics or tracking can be added here
        // console.log('Phone call initiated:', tel.href);
    });
});

// Prevent right-click on images (optional, for protection)
document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.3s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Gallery Tabs Functionality
const galleryTabs = document.querySelectorAll('.gallery-tab');
const galleryItems = document.querySelectorAll('.gallery-item');

galleryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs
        galleryTabs.forEach(t => t.classList.remove('active'));
        // Add active class to clicked tab
        tab.classList.add('active');
        
        const category = tab.getAttribute('data-category');
        
        // Filter gallery items
        galleryItems.forEach(item => {
            if (category === 'all' || item.getAttribute('data-category') === category) {
                item.classList.remove('hidden');
                // Add fade in animation
                item.style.animation = 'fadeIn 0.5s ease';
            } else {
                item.classList.add('hidden');
            }
        });
    });
});

// Teachers Section Scroll
const teachersGrid = document.querySelector('.teachers-grid');
const scrollLeftBtn = document.querySelector('.scroll-left');
const scrollRightBtn = document.querySelector('.scroll-right');

if (scrollLeftBtn && teachersGrid) {
    scrollLeftBtn.addEventListener('click', () => {
        teachersGrid.scrollBy({
            left: -300,
            behavior: 'smooth'
        });
    });
}

if (scrollRightBtn && teachersGrid) {
    scrollRightBtn.addEventListener('click', () => {
        teachersGrid.scrollBy({
            left: 300,
            behavior: 'smooth'
        });
    });
}

// Videos Section Scroll
const videosGrid = document.querySelector('.videos-grid');
const scrollLeftVideoBtn = document.querySelector('.scroll-left-video');
const scrollRightVideoBtn = document.querySelector('.scroll-right-video');

if (scrollLeftVideoBtn && videosGrid) {
    scrollLeftVideoBtn.addEventListener('click', () => {
        videosGrid.scrollBy({
            left: -300,
            behavior: 'smooth'
        });
    });
}

if (scrollRightVideoBtn && videosGrid) {
    scrollRightVideoBtn.addEventListener('click', () => {
        videosGrid.scrollBy({
            left: 300,
            behavior: 'smooth'
        });
    });
}

// Auto-hide/show scroll buttons based on scroll position
function updateScrollButtons(container, leftBtn, rightBtn) {
    if (!container || !leftBtn || !rightBtn) return;
    
    const scrollLeft = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;
    
    leftBtn.style.opacity = scrollLeft > 0 ? '1' : '0.3';
    leftBtn.style.pointerEvents = scrollLeft > 0 ? 'auto' : 'none';
    
    rightBtn.style.opacity = scrollLeft < maxScroll - 10 ? '1' : '0.3';
    rightBtn.style.pointerEvents = scrollLeft < maxScroll - 10 ? 'auto' : 'none';
}

if (teachersGrid) {
    teachersGrid.addEventListener('scroll', () => {
        updateScrollButtons(teachersGrid, scrollLeftBtn, scrollRightBtn);
    });
    updateScrollButtons(teachersGrid, scrollLeftBtn, scrollRightBtn);
}

if (videosGrid) {
    videosGrid.addEventListener('scroll', () => {
        updateScrollButtons(videosGrid, scrollLeftVideoBtn, scrollRightVideoBtn);
    });
    updateScrollButtons(videosGrid, scrollLeftVideoBtn, scrollRightVideoBtn);
}

// console.log('🎓 Ambition Residential School website loaded successfully!');
// console.log('✅ YouTube videos are now embedded and playable!');


const stickyButtons = document.getElementById('stickyButtons');
const heroSection = document.querySelector('.hero');

if (stickyButtons && heroSection) {
    window.addEventListener('scroll', () => {
        const heroHeight = heroSection.offsetHeight;
        const scrollPosition = window.pageYOffset;
        
        // Show buttons when user scrolls past hero section
        if (scrollPosition > heroHeight) {
            stickyButtons.classList.add('show');
        } else {
            stickyButtons.classList.remove('show');
        }
    });
}