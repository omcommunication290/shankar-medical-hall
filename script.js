/* ==========================================================================
   SHANKAR MEDICAL HALL - INTERACTIVE ACTIONS JS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- DOM ELEMENTS ---
    const header = document.querySelector('.header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const copyButtons = document.querySelectorAll('.btn-copy');
    const toastContainer = document.getElementById('toast-container');
    const inquiryForm = document.getElementById('inquiry-form');
    const formBtn = document.getElementById('form-btn');
    const formStatus = document.getElementById('form-status-message');

    // --- 1. HERO SECTION ENTRANCE ANIMATIONS ---
    const heroElements = document.querySelectorAll('.fade-in-element');
    setTimeout(() => {
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('visible');
            }, index * 120);
        });
    }, 150);

    // --- 2. SCROLL REVEAL (INTERSECTION OBSERVER) ---
    const revealSections = document.querySelectorAll('.scroll-reveal');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // Once animate is done, stop tracking
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealSections.forEach(section => {
            revealObserver.observe(section);
        });
    } else {
        // Fallback for older browsers
        revealSections.forEach(section => {
            section.classList.add('revealed');
        });
    }

    // --- 3. DYNAMIC STICKY NAV HEADER ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- 4. MOBILE HAMBURGER MENU TOGGLE ---
    navToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.contains('open');
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    function openMobileMenu() {
        navMenu.classList.add('open');
        header.classList.add('nav-open');
        document.body.style.overflow = 'hidden'; // Lock background scroll
    }

    function closeMobileMenu() {
        navMenu.classList.remove('open');
        header.classList.remove('nav-open');
        document.body.style.overflow = ''; // Restore background scroll
    }

    // Close menu when a navigation item is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    // --- 5. ACTIVE NAV MENU TRACKING ON SCROLL ---
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 120; // Offset for header height

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // --- 6. CLICK-TO-COPY & TOAST COMPONENT ---
    copyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Avoid triggering parent anchors
            
            const textToCopy = btn.getAttribute('data-copy');
            const tooltip = btn.querySelector('.copy-tooltip');
            
            if (navigator.clipboard) {
                navigator.clipboard.writeText(textToCopy)
                    .then(() => {
                        triggerCopyFeedback(btn, tooltip, 'Copied!');
                        showToast(`Successfully copied: "${textToCopy}"`);
                    })
                    .catch(() => {
                        fallbackCopy(textToCopy, btn, tooltip);
                    });
            } else {
                fallbackCopy(textToCopy, btn, tooltip);
            }
        });
    });

    function fallbackCopy(text, btn, tooltip) {
        // Fallback text selection area
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed'; // Avoid page scrolling
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            triggerCopyFeedback(btn, tooltip, 'Copied!');
            showToast(`Successfully copied: "${text}"`);
        } catch (err) {
            triggerCopyFeedback(btn, tooltip, 'Failed');
        }
        document.body.removeChild(textArea);
    }

    function triggerCopyFeedback(btn, tooltip, text) {
        if (tooltip) {
            const originalText = tooltip.textContent;
            tooltip.textContent = text;
            btn.classList.add('active');
            
            setTimeout(() => {
                tooltip.textContent = originalText;
                btn.classList.remove('active');
            }, 2000);
        }
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        
        // Custom SVG icon for toast
        toast.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="color: #14B8A6; flex-shrink: 0;">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        
        // Trigger transition slide-up
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Clear toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 400);
        }, 3000);
    }

    // --- 7. INQUIRY FORM SUBMISSION SIMULATION ---
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get values
            const name = document.getElementById('form-name').value.trim();
            const phone = document.getElementById('form-phone').value.trim();
            const details = document.getElementById('form-message').value.trim();

            if (!name || !phone || !details) {
                showFormStatus('Please complete all required fields.', 'error');
                return;
            }

            // Set loading state on button
            const originalBtnHTML = formBtn.innerHTML;
            formBtn.disabled = true;
            formBtn.innerHTML = `
                <span>Sending Inquiry...</span>
                <svg class="spinner-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;">
                    <line x1="12" y1="2" x2="12" y2="6"></line>
                    <line x1="12" y1="18" x2="12" y2="22"></line>
                    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                    <line x1="2" y1="12" x2="6" y2="12"></line>
                    <line x1="18" y1="12" x2="22" y2="12"></line>
                    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                </svg>
            `;

            // Simulate server network response
            setTimeout(() => {
                inquiryForm.reset();
                formBtn.disabled = false;
                formBtn.innerHTML = originalBtnHTML;
                
                showFormStatus(`Thank you, ${name}! Your inquiry has been sent. Owner Divya Prakash will call you shortly.`, 'success');
                showToast("Inquiry message dispatched successfully!");
            }, 1500);
        });
    }

    function showFormStatus(msg, statusType) {
        formStatus.textContent = msg;
        formStatus.className = `form-status ${statusType}`;
        
        // Auto scroll to status message on mobile
        if (window.innerWidth < 768) {
            formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        
        // Clear error messages after 5 seconds, leave success visible
        if (statusType === 'error') {
            setTimeout(() => {
                formStatus.style.display = 'none';
                formStatus.className = 'form-status';
            }, 5000);
        } else {
            formStatus.style.display = 'block';
        }
    }

    // --- 8. B2B PORTAL TABS & CRM COPY UTILITY ---
    const tabButtons = document.querySelectorAll('.crm-tab-btn');
    const tabContents = document.querySelectorAll('.crm-tab-content');
    const copyTemplateButtons = document.querySelectorAll('.btn-copy-template');

    // Tab Switching
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            // Remove active classes
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active classes
            btn.classList.add('active');
            const activeContent = document.getElementById(`tab-${targetTab}`);
            if (activeContent) {
                activeContent.classList.add('active');
            }
        });
    });

    // CRM Copy buttons
    copyTemplateButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const textEl = document.getElementById(targetId);
            if (!textEl) return;

            const textToCopy = textEl.textContent || textEl.innerText;

            if (navigator.clipboard) {
                navigator.clipboard.writeText(textToCopy)
                    .then(() => {
                        triggerTemplateFeedback(btn, 'Copied!');
                    })
                    .catch(() => {
                        fallbackTemplateCopy(textToCopy, btn);
                    });
            } else {
                fallbackTemplateCopy(textToCopy, btn);
            }
        });
    });

    function fallbackTemplateCopy(text, btn) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            triggerTemplateFeedback(btn, 'Copied!');
        } catch (err) {
            triggerTemplateFeedback(btn, 'Failed');
        }
        document.body.removeChild(textArea);
    }

    function triggerTemplateFeedback(btn, statusText) {
        const originalBtnHTML = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="color: #ffffff; margin-right: 4px;">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>${statusText}</span>
        `;
        showToast("Template copied to clipboard!");

        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = originalBtnHTML;
        }, 2000);
    }
});

// CSS spin animation helper added dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    .spinner-svg {
        width: 16px;
        height: 16px;
    }
`;
document.head.appendChild(style);
