/* ============================================
   GẠO THƠM LỘC KHANG - JavaScript
   ============================================ */

// iOS viewport height fix
function setVH() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}
setVH();
window.addEventListener('resize', setVH);
window.addEventListener('orientationchange', () => setTimeout(setVH, 100));

document.addEventListener('DOMContentLoaded', () => {
    initStyleSwitcher();
    initNavigation();
    initScrollEffects();
    initProductFilter();
    initScrollAnimations();
    initProductDetails();
    initMobileUX();
});

/* ============ STYLE SWITCHER ============ */
function initStyleSwitcher() {
    const toggle = document.getElementById('styleSwitcherToggle');
    const panel = document.getElementById('styleSwitcherPanel');
    const options = document.querySelectorAll('.style-option');
    const body = document.body;

    // Load saved style
    const savedStyle = localStorage.getItem('lockhang-style');
    if (savedStyle) {
        body.setAttribute('data-style', savedStyle);
        options.forEach(opt => {
            opt.classList.toggle('active', opt.dataset.style === savedStyle);
        });
    }

    // Toggle panel
    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        panel.classList.toggle('open');
    });

    // Select style
    options.forEach(option => {
        option.addEventListener('click', () => {
            const style = option.dataset.style;
            body.setAttribute('data-style', style);
            localStorage.setItem('lockhang-style', style);

            options.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');

            // Add a quick transition animation
            body.style.transition = 'all 0.6s ease';
            setTimeout(() => {
                body.style.transition = '';
            }, 700);

            panel.classList.remove('open');
        });
    });

    // Close panel on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.style-switcher')) {
            panel.classList.remove('open');
        }
    });
}

/* ============ NAVIGATION ============ */
function initNavigation() {
    const header = document.getElementById('header');
    const hamburger = document.getElementById('navHamburger');
    const menu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav__link');

    // Hamburger toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        menu.classList.toggle('open');
    });

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            menu.classList.remove('open');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (menu.classList.contains('open') &&
            !e.target.closest('#navMenu') &&
            !e.target.closest('#navHamburger')) {
            hamburger.classList.remove('active');
            menu.classList.remove('open');
        }
    });

    // Header scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

/* ============ SCROLL EFFECTS ============ */
function initScrollEffects() {
    const backToTop = document.getElementById('backToTop');

    // Back to top visibility
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    // Back to top click
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

/* ============ PRODUCT FILTER ============ */
function initProductFilter() {
    const filterBtns = document.querySelectorAll('.products__filter-btn');
    const products = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;

            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter products with animation
            products.forEach((product, index) => {
                const category = product.dataset.category;

                if (filter === 'all' || category === filter) {
                    product.classList.remove('hidden');
                    product.style.animation = 'none';
                    product.offsetHeight; // Trigger reflow
                    product.style.animation = `fadeInUp 0.5s ease ${index * 0.05}s forwards`;
                } else {
                    product.classList.add('hidden');
                }
            });
        });
    });
}

/* ============ SCROLL ANIMATIONS ============ */
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Add animation classes to elements
    const animateElements = document.querySelectorAll(
        '.section-header, .process-card, .about__feature, .cooking-step, .contact__card, .products__gift-cta'
    );

    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

/* ============ PRODUCT DETAILS MODAL ============ */
function initProductDetails() {
    const productsCards = document.querySelectorAll('.product-card');
    productsCards.forEach(card => {
        const orderBtn = card.querySelector('.product-card__overlay .btn');
        if (orderBtn) {
            orderBtn.innerHTML = "Xem Chi Tiết";
            orderBtn.removeAttribute('onclick'); // Xóa onclick cũ
            orderBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                openProductDetail(card);
            });
        }
        
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            if(!e.target.closest('button')) {
                openProductDetail(card);
            }
        });
    });
}

function openProductDetail(card) {
    const name = card.querySelector('.product-card__name').textContent;
    const desc = card.querySelector('.product-card__desc').textContent;
    const price = card.querySelector('.product-card__price').textContent;
    const weight = card.querySelector('.product-card__weight').textContent;
    const category = card.querySelector('.product-card__category').textContent;
    const imgSrc = card.querySelector('.product-card__image img').src;
    const badge = card.querySelector('.product-card__badge');

    document.getElementById('detailTitle').textContent = name;
    document.getElementById('detailDesc').textContent = desc;
    document.getElementById('detailPrice').textContent = price;
    document.getElementById('detailWeight').textContent = weight;
    document.getElementById('detailCategory').textContent = category;
    document.getElementById('detailImage').src = imgSrc;
    
    const detailBadge = document.getElementById('detailBadge');
    if (badge) {
        detailBadge.textContent = badge.textContent;
        detailBadge.className = badge.className; // copy styles like VIP, New
        detailBadge.style.display = 'block';
    } else {
        detailBadge.style.display = 'none';
    }

    document.getElementById('detailOrderBtn').onclick = () => {
        closeProductDetailModal();
        orderProduct(name);
    };

    const modal = document.getElementById('productDetailModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProductDetailModal() {
    document.getElementById('productDetailModal').classList.remove('active');
    document.body.style.overflow = '';
}

/* ============ ORDER PRODUCT ============ */
function orderProduct(productName) {
    const modal = document.getElementById('orderModal');
    const modalProduct = document.getElementById('modalProduct');
    modalProduct.textContent = productName;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('orderModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Close modal on Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        closeProductDetailModal();
    }
});

/* ============ CONTACT FORM ============ */
function handleContactForm(e) {
    e.preventDefault();

    const form = e.target;
    const name = form.querySelector('#contactName').value;
    const phone = form.querySelector('#contactPhone').value;

    // Simple form handling — show success message
    const formWrap = form.parentElement;
    formWrap.innerHTML = `
        <div style="text-align: center; padding: 48px 24px;">
            <div style="font-size: 3rem; margin-bottom: 16px;">✅</div>
            <h3 style="font-family: var(--font-heading); font-size: 1.4rem; color: var(--text-primary); margin-bottom: 12px;">
                Cảm ơn ${name}!
            </h3>
            <p style="color: var(--text-secondary); margin-bottom: 24px;">
                Chúng tôi đã nhận được yêu cầu của bạn và sẽ liên hệ qua số <strong>${phone}</strong> trong thời gian sớm nhất.
            </p>
            <a href="tel:0910926839" class="btn btn--primary">
                📞 Gọi Ngay: 0910 926 839
            </a>
        </div>
    `;
}
/* ============ MOBILE UX ============ */
function initMobileUX() {
    // Swipe down to close modals (bottom-sheet style on mobile)
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        const content = modal.querySelector('.modal__content');
        if (!content) return;

        let startY = 0;
        let isDragging = false;

        content.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
            isDragging = true;
        }, { passive: true });

        content.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const deltaY = e.touches[0].clientY - startY;
            if (deltaY > 0 && content.scrollTop === 0) {
                content.style.transform = `translateY(${Math.min(deltaY * 0.5, 80)}px)`;
                content.style.transition = 'none';
            }
        }, { passive: true });

        content.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;
            const deltaY = e.changedTouches[0].clientY - startY;
            content.style.transform = '';
            content.style.transition = '';

            if (deltaY > 80) {
                // Close the modal
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Prevent body scroll when modal is open
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.target.classList.contains('modal')) {
                if (mutation.target.classList.contains('active')) {
                    document.body.style.overflow = 'hidden';
                }
            }
        });
    });

    modals.forEach(modal => {
        observer.observe(modal, { attributes: true, attributeFilter: ['class'] });
    });
}
