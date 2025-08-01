// Global variables
let isScrolling = false;
let ticking = false;

// Skills data
const skillsData = [
  { name: "Python", level: 95, category: "Programming" },
  { name: "SQL", level: 92, category: "Frontend" },
  { name: "Power BI", level: 88, category: "Backend" },
  { name: "Excel", level: 85, category: "Backend" },
  { name: "AWS/Azure", level: 82, category: "Cloud" },
  { name: "Docker/Kubernetes", level: 78, category: "DevOps" },
  { name: "PostgreSQL/MongoDB", level: 85, category: "Database" },
  { name: "GraphQL/REST APIs", level: 90, category: "APIs" }
];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

// Initialize App
function initializeApp() {
  initializeLoadingScreen();
  initializeTheme();
  initializeNavigation();
  initializeScrollEffects();
  initializeAnimations();
  initializeSkills();
  initializeContactForm();
  initializeParallax();
  initializeCounters();
}

// Loading Screen
function initializeLoadingScreen() {
  window.addEventListener('load', function() {
    setTimeout(() => {
      const loadingScreen = document.getElementById('loading-screen');
      if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        
        setTimeout(() => {
          loadingScreen.style.display = 'none';
        }, 250);
      }
    }, 1500);
  });
}

// Theme Management
function initializeTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle?.querySelector('.theme-toggle__icon');
  
  if (!themeToggle || !themeIcon) return;
  
  // Get saved theme or default to light
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  
  // Apply theme
  document.documentElement.setAttribute('data-color-scheme', currentTheme);
  updateThemeIcon(currentTheme, themeIcon);
  
  // Theme toggle event
  themeToggle.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const currentTheme = document.documentElement.getAttribute('data-color-scheme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-color-scheme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme, themeIcon);
    
    // Add transition class for smooth theme change
    document.body.classList.add('theme-transition');
    setTimeout(() => {
      document.body.classList.remove('theme-transition');
    }, 300);
  });
}

function updateThemeIcon(theme, iconElement) {
  if (!iconElement) return;
  iconElement.textContent = theme === 'dark' ? '☀️' : '🌙';
  iconElement.style.transform = 'rotate(360deg)';
  setTimeout(() => {
    iconElement.style.transform = 'rotate(0deg)';
  }, 300);
}

// Navigation
function initializeNavigation() {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav__link');
  const header = document.getElementById('header');
  
  if (!header) return;
  
  let lastScrollY = window.scrollY;
  
  // Mobile menu toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function(e) {
      e.preventDefault();
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  }
  
  // Close mobile menu when clicking on a link
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      if (navToggle && navMenu) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  });
  
  // Smooth scrolling for navigation links
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        const headerHeight = header.offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight;
        
        // Use smooth scrolling
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Header hide/show on scroll
  window.addEventListener('scroll', function() {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      header.classList.add('hidden');
    } else {
      header.classList.remove('hidden');
    }
    
    lastScrollY = currentScrollY;
  });
  
  // Active navigation link highlighting
  window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');
  const scrollY = window.scrollY;
  const header = document.getElementById('header');
  const headerHeight = header ? header.offsetHeight : 70;
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop - headerHeight - 50;
    const sectionBottom = sectionTop + section.offsetHeight;
    const sectionId = section.getAttribute('id');
    
    if (scrollY >= sectionTop && scrollY < sectionBottom) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

// Scroll Effects
function initializeScrollEffects() {
  const scrollToTopBtn = document.getElementById('scroll-to-top');
  
  if (!scrollToTopBtn) return;
  
  // Scroll to top button visibility
  window.addEventListener('scroll', function() {
    if (window.scrollY > 500) {
      scrollToTopBtn.classList.add('visible');
    } else {
      scrollToTopBtn.classList.remove('visible');
    }
  });
  
  // Scroll to top functionality
  scrollToTopBtn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  // Smooth scrolling for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      
      if (target) {
        const header = document.getElementById('header');
        const headerHeight = header ? header.offsetHeight : 70;
        const targetPosition = target.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Intersection Observer for Animations
function initializeAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // Trigger specific animations
        if (entry.target.id === 'skills') {
          setTimeout(() => animateSkillBars(), 500);
        } else if (entry.target.classList.contains('about')) {
          setTimeout(() => animateCounters(), 300);
        }
      }
    });
  }, observerOptions);
  
  // Observe sections for animations
  const animatedElements = document.querySelectorAll('.section, .timeline__item, .project-card, .skill-item, .stat');
  animatedElements.forEach(el => {
    el.classList.add('animate-in');
    observer.observe(el);
  });
}

// Skills Management
function initializeSkills() {
  renderSkills('all');
  
  const categoryButtons = document.querySelectorAll('.skills__category-btn');
  categoryButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const category = this.getAttribute('data-category');
      
      // Update active button
      categoryButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // Filter and render skills
      renderSkills(category);
      
      // Re-animate skill bars after a short delay
      setTimeout(() => animateSkillBars(), 200);
    });
  });
}

function renderSkills(category) {
  const skillsGrid = document.getElementById('skills-grid');
  if (!skillsGrid) return;
  
  const filteredSkills = category === 'all' ? skillsData : skillsData.filter(skill => skill.category === category);
  
  skillsGrid.innerHTML = '';
  
  filteredSkills.forEach((skill, index) => {
    const skillElement = document.createElement('div');
    skillElement.className = 'skill-item animate-in';
    skillElement.style.animationDelay = `${index * 0.1}s`;
    
    skillElement.innerHTML = `
      <div class="skill-item__header">
        <span class="skill-item__name">${skill.name}</span>
        <span class="skill-item__level">${skill.level}%</span>
      </div>
      <div class="skill-item__bar">
        <div class="skill-item__progress" data-level="${skill.level}"></div>
      </div>
    `;
    
    skillsGrid.appendChild(skillElement);
  });
  
  // Trigger animation after a short delay
  setTimeout(() => {
    skillsGrid.querySelectorAll('.skill-item').forEach(item => {
      item.classList.add('visible');
    });
  }, 100);
}

function animateSkillBars() {
  const progressBars = document.querySelectorAll('.skill-item__progress');
  progressBars.forEach((bar, index) => {
    setTimeout(() => {
      const level = bar.getAttribute('data-level');
      bar.style.width = `${level}%`;
    }, index * 100);
  });
}

// Counter Animation
function initializeCounters() {
  // This will be called when the about section comes into view
}

function animateCounters() {
  const counters = document.querySelectorAll('.stat__number');
  
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    const updateCounter = () => {
      current += increment;
      if (current < target) {
        counter.textContent = Math.floor(current).toLocaleString();
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target.toLocaleString();
      }
    };
    
    updateCounter();
  });
}

// Parallax Effects
function initializeParallax() {
  const parallaxElements = document.querySelectorAll('.hero__parallax-layer');
  
  if (parallaxElements.length === 0) return;
  
  function updateParallax() {
    const scrollTop = window.pageYOffset;
    
    parallaxElements.forEach(element => {
      const speed = parseFloat(element.getAttribute('data-speed')) || 0.5;
      const yPos = -(scrollTop * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });
    
    ticking = false;
  }
  
  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  });
}

// Contact Form
function initializeContactForm() {
  const form = document.getElementById('contact-form');
  
  if (!form) return;
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(form);
    const formObject = {};
    
    formData.forEach((value, key) => {
      formObject[key] = value;
    });
    
    // Validate form
    if (validateForm(formObject)) {
      // Simulate form submission
      submitForm(formObject);
    }
  });
}

function validateForm(data) {
  const errors = [];
  
  if (!data.name || data.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }
  
  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Please enter a valid email address');
  }
  
  if (!data.subject || data.subject.trim().length < 5) {
    errors.push('Subject must be at least 5 characters long');
  }
  
  if (!data.message || data.message.trim().length < 10) {
    errors.push('Message must be at least 10 characters long');
  }
  
  if (errors.length > 0) {
    showFormErrors(errors);
    return false;
  }
  
  return true;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showFormErrors(errors) {
  // Remove existing error messages
  const existingErrors = document.querySelectorAll('.form-error');
  existingErrors.forEach(error => error.remove());
  
  // Create error container
  const errorContainer = document.createElement('div');
  errorContainer.className = 'form-error';
  errorContainer.style.cssText = `
    background: rgba(var(--color-error-rgb), 0.1);
    border: 1px solid rgba(var(--color-error-rgb), 0.3);
    color: var(--color-error);
    padding: var(--space-12);
    border-radius: var(--radius-base);
    margin-bottom: var(--space-16);
    font-size: var(--font-size-sm);
  `;
  
  const errorList = document.createElement('ul');
  errorList.style.cssText = 'margin: 0; padding-left: var(--space-16);';
  
  errors.forEach(error => {
    const errorItem = document.createElement('li');
    errorItem.textContent = error;
    errorList.appendChild(errorItem);
  });
  
  errorContainer.appendChild(errorList);
  
  const form = document.getElementById('contact-form');
  form.insertBefore(errorContainer, form.firstChild);
  
  // Auto-remove errors after 5 seconds
  setTimeout(() => {
    errorContainer.remove();
  }, 5000);
}

function submitForm(data) {
  const submitButton = document.querySelector('#contact-form button[type="submit"]');
  if (!submitButton) return;
  
  const originalText = submitButton.textContent;
  
  // Show loading state
  submitButton.textContent = 'Sending...';
  submitButton.disabled = true;
  
  // Simulate API call
  setTimeout(() => {
    // Show success message
    showFormSuccess();
    
    // Reset form
    document.getElementById('contact-form').reset();
    
    // Reset button
    submitButton.textContent = originalText;
    submitButton.disabled = false;
  }, 2000);
}

function showFormSuccess() {
  // Remove existing messages
  const existingMessages = document.querySelectorAll('.form-success, .form-error');
  existingMessages.forEach(msg => msg.remove());
  
  const successContainer = document.createElement('div');
  successContainer.className = 'form-success';
  successContainer.style.cssText = `
    background: rgba(var(--color-success-rgb), 0.1);
    border: 1px solid rgba(var(--color-success-rgb), 0.3);
    color: var(--color-success);
    padding: var(--space-12);
    border-radius: var(--radius-base);
    margin-bottom: var(--space-16);
    font-size: var(--font-size-sm);
    text-align: center;
  `;
  
  successContainer.textContent = 'Thank you! Your message has been sent successfully. I\'ll get back to you soon.';
  
  const form = document.getElementById('contact-form');
  form.insertBefore(successContainer, form.firstChild);
  
  // Auto-remove success message after 5 seconds
  setTimeout(() => {
    successContainer.remove();
  }, 5000);
}

// Enhanced Experience Section with Hover Details
function initializeExperienceHover() {
  const timelineItems = document.querySelectorAll('.timeline__item');
  
  timelineItems.forEach(item => {
    const content = item.querySelector('.timeline__content');
    const achievements = item.querySelector('.timeline__achievements');
    
    if (content && achievements) {
      // Initially hide achievements
      achievements.style.maxHeight = '0';
      achievements.style.overflow = 'hidden';
      achievements.style.transition = 'max-height 0.3s ease-out';
      
      item.addEventListener('mouseenter', function() {
        achievements.style.maxHeight = achievements.scrollHeight + 'px';
        content.style.transform = 'scale(1.02)';
      });
      
      item.addEventListener('mouseleave', function() {
        achievements.style.maxHeight = '0';
        content.style.transform = 'scale(1)';
      });
    }
  });
}

// Enhanced Project Cards
function initializeProjectCards() {
  const projectCards = document.querySelectorAll('.project-card');
  
  projectCards.forEach(card => {
    card.addEventListener('click', function(e) {
      // Don't trigger on button clicks
      if (e.target.tagName === 'A' || e.target.closest('a')) {
        return;
      }
      
      // Add a subtle animation
      card.style.transform = 'scale(0.98)';
      setTimeout(() => {
        card.style.transform = '';
      }, 150);
    });
  });
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    initializeExperienceHover();
    initializeProjectCards();
  }, 1000);
});

// Utility Functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Accessibility improvements
document.addEventListener('keydown', function(e) {
  // Close mobile menu on Escape key
  if (e.key === 'Escape') {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu && navMenu.classList.contains('active')) {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
    }
  }
});

// Respect user's motion preferences
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
  // Disable animations for users who prefer reduced motion
  document.documentElement.style.setProperty('--duration-fast', '0ms');
  document.documentElement.style.setProperty('--duration-normal', '0ms');
}

// Error handling for intersection observer
if (!('IntersectionObserver' in window)) {
  // Fallback for browsers that don't support Intersection Observer
  console.warn('Intersection Observer not supported');
  
  // Add visible class to all animated elements immediately
  document.querySelectorAll('.animate-in').forEach(el => {
    el.classList.add('visible');
  });
}

// Console easter egg
console.log(`
  ┌─────────────────────────────────────┐
  │                                     │
  │  👋 Hello there, fellow developer!  │
  │                                     │
  │  Thanks for checking out the code.  │
  │  This portfolio was built with:     │
  │                                     │
  │  ▸ Vanilla JavaScript (ES6+)       │
  │  ▸ Modern CSS (Grid, Flexbox)      │
  │  ▸ Intersection Observer API       │
  │  ▸ CSS Custom Properties           │
  │  ▸ Responsive Design               │
  │                                     │
  │  Want to connect? Let's chat! 🚀    │
  │                                     │
  └─────────────────────────────────────┘
`);

// Initialize animations after DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Add a small delay to ensure all resources are loaded
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 100);
});