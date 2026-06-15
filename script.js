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

    // --- 9. B2B CRM MANUAL CSV GENERATOR ---
    const csvForm = document.getElementById('csv-form');
    const csvTbody = document.getElementById('csv-tbody');
    const csvPreviewTitle = document.getElementById('csv-preview-title');
    const btnExportCsv = document.getElementById('btn-export-csv');
    const btnClearCsv = document.getElementById('btn-clear-csv');

    let productsList = [];

    if (csvForm) {
        csvForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Read input values
            const name = document.getElementById('csv-name').value.trim();
            const composition = document.getElementById('csv-composition').value.trim();
            const batch = document.getElementById('csv-batch').value.trim();
            const expiry = document.getElementById('csv-expiry').value.trim();
            const hsn = document.getElementById('csv-hsn').value.trim();
            const mrp = parseFloat(document.getElementById('csv-mrp').value).toFixed(2);
            const stock = parseInt(document.getElementById('csv-stock').value, 10);

            // Generate Product ID: SMH-101, SMH-102 etc.
            const productId = `SMH-${100 + productsList.length + 1}`;

            // Create product object
            const newProduct = {
                id: productId,
                name: name,
                composition: composition,
                batch: batch,
                expiry: expiry,
                hsn: hsn,
                mrp: mrp,
                stock: stock
            };

            // Push to list
            productsList.push(newProduct);

            // Update preview table
            updateCsvTable();

            // Reset form fields
            csvForm.reset();

            showToast(`Product "${name}" added to list!`);
        });
    }

    if (btnClearCsv) {
        btnClearCsv.addEventListener('click', () => {
            productsList = [];
            updateCsvTable();
            showToast("Product list cleared.");
        });
    }

    if (btnExportCsv) {
        btnExportCsv.addEventListener('click', () => {
            if (productsList.length === 0) return;

            // Generate CSV content
            let csvContent = "Product ID,Medicine Name,Composition/Molecule,Batch Number,Expiry Date,HSN Code,MRP,Stock Quantity\n";
            
            productsList.forEach(p => {
                // Escape values with commas if necessary
                const nameEscaped = p.name.includes(',') ? `"${p.name}"` : p.name;
                const compEscaped = p.composition.includes(',') ? `"${p.composition}"` : p.composition;
                csvContent += `${p.id},${nameEscaped},${compEscaped},${p.batch},${p.expiry},${p.hsn},${p.mrp},${p.stock}\n`;
            });

            // Create Blob and download
            try {
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.setAttribute("href", url);
                link.setAttribute("download", `pharma_inventory_${new Date().toISOString().slice(0,10)}.csv`);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                showToast("CSV file exported successfully!");
            } catch (err) {
                showToast("Export failed. Please try again.");
            }
        });
    }

    function updateCsvTable() {
        // Clear tbody
        csvTbody.innerHTML = '';

        if (productsList.length === 0) {
            csvTbody.innerHTML = '<tr class="empty-row"><td colspan="8">No products added yet.</td></tr>';
            btnExportCsv.disabled = true;
            csvPreviewTitle.textContent = "Products List (0)";
            return;
        }

        // Enable Export
        btnExportCsv.disabled = false;
        csvPreviewTitle.textContent = `Products List (${productsList.length})`;

        // Append rows
        productsList.forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${p.id}</strong></td>
                <td>${p.name}</td>
                <td>${p.composition}</td>
                <td>${p.batch}</td>
                <td>${p.expiry}</td>
                <td>${p.hsn}</td>
                <td>₹${p.mrp}</td>
                <td>${p.stock}</td>
            `;
            csvTbody.appendChild(tr);
        });
    }

    // --- 10. B2B CRM PRICE CALCULATOR ---
    const priceForm = document.getElementById('price-form');
    const priceTbody = document.getElementById('price-tbody');
    const pricePreviewTitle = document.getElementById('price-preview-title');
    const btnExportPrices = document.getElementById('btn-export-prices');
    const btnClearPrices = document.getElementById('btn-clear-prices');

    let pricesList = [];

    if (priceForm) {
        priceForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Read values
            const name = document.getElementById('price-name').value.trim();
            const beforeMrp = parseFloat(document.getElementById('price-before').value).toFixed(2);
            const afterMrp = parseFloat(document.getElementById('price-after').value);
            const retailMargin = parseFloat(document.getElementById('price-retail-margin').value) / 100;
            const stockistMargin = parseFloat(document.getElementById('price-stockist-margin').value) / 100;
            const gstRate = parseFloat(document.getElementById('price-gst').value) / 100;

            // Calculate PTS and GST
            // Formula: PTS (incl. GST) = After MRP / (1 + Retailer Margin) / (1 + Stockist Margin)
            const ptsInclGstValue = afterMrp / (1 + retailMargin) / (1 + stockistMargin);
            const ptsInclGst = ptsInclGstValue.toFixed(2);

            // Net PTS (excl. GST) = PTS (incl. GST) / (1 + GST Rate)
            const netPtsExclGstValue = ptsInclGstValue / (1 + gstRate);
            const netPtsExclGst = netPtsExclGstValue.toFixed(2);

            // GST Amount = PTS (incl. GST) - Net PTS (excl. GST)
            const gstAmt = (ptsInclGstValue - netPtsExclGstValue).toFixed(2);

            // Create price record object
            const newPriceRecord = {
                name: name,
                beforeMrp: beforeMrp,
                afterMrp: afterMrp.toFixed(2),
                netPts: netPtsExclGst,
                gstAmt: gstAmt,
                ptsInclGst: ptsInclGst
            };

            // Push to array
            pricesList.push(newPriceRecord);

            // Update preview table
            updatePricesTable();

            // Reset name, before and after inputs (keep default margins/gst)
            document.getElementById('price-name').value = '';
            document.getElementById('price-before').value = '';
            document.getElementById('price-after').value = '';

            showToast(`Calculated prices for "${name}"!`);
        });
    }

    if (btnClearPrices) {
        btnClearPrices.addEventListener('click', () => {
            pricesList = [];
            updatePricesTable();
            showToast("Prices list cleared.");
        });
    }

    if (btnExportPrices) {
        btnExportPrices.addEventListener('click', () => {
            if (pricesList.length === 0) return;

            // Generate CSV
            let csvContent = "Medicine Name,Before MRP,After MRP,Net PTS (Excl. GST),GST Amount,PTS (Incl. GST)\n";
            pricesList.forEach(p => {
                const nameEscaped = p.name.includes(',') ? `"${p.name}"` : p.name;
                csvContent += `${nameEscaped},${p.beforeMrp},${p.afterMrp},${p.netPts},${p.gstAmt},${p.ptsInclGst}\n`;
            });

            // Trigger download
            try {
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.setAttribute("href", url);
                link.setAttribute("download", `pharma_price_list_${new Date().toISOString().slice(0,10)}.csv`);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                showToast("Prices CSV exported successfully!");
            } catch (err) {
                showToast("Prices CSV export failed.");
            }
        });
    }

    function updatePricesTable() {
        priceTbody.innerHTML = '';

        if (pricesList.length === 0) {
            priceTbody.innerHTML = '<tr class="empty-row"><td colspan="6">No calculations added yet.</td></tr>';
            btnExportPrices.disabled = true;
            pricePreviewTitle.textContent = "Updated Prices List (0)";
            return;
        }

        // Enable Export
        btnExportPrices.disabled = false;
        pricePreviewTitle.textContent = `Updated Prices List (${pricesList.length})`;

        // Append rows
        pricesList.forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${p.name}</strong></td>
                <td>₹${p.beforeMrp}</td>
                <td>₹${p.afterMrp}</td>
                <td>₹${p.netPts}</td>
                <td>₹${p.gstAmt}</td>
                <td>₹${p.ptsInclGst}</td>
            `;
            priceTbody.appendChild(tr);
        });
    }

    // --- 11. B2B CRM TEMPLATE SELECTION ---
    const selectWhatsappType = document.getElementById('select-whatsapp-type');
    const selectEmailType = document.getElementById('select-email-type');
    const textWhatsapp = document.getElementById('text-whatsapp');
    const textEmail = document.getElementById('text-email');

    const messageTemplates = {
        whatsapp: {
            followup: `📢 *URGENT: Stock Refill & Exclusive Bulk Offers!* 📢\n\nDear Partner,\n\nWe noticed you haven't placed an order with us in the last 15 days. We want to ensure your pharmacy shelves remain fully stocked with the highest-selling molecules.\n\n📦 *New Stock Arrival:* Fresh batches of critical prescription medicines, daily wellness supplements, and baby care essentials have just arrived in our inventory.\n\n⚡ *Special Bulk Offers (Valid till this week only):*\n• *Flat 5% Extra Discount* on orders above ₹15,000.\n• *Buy 10 get 1 Free* on high-demand OTC & Wellness molecules.\n• *Priority Shipping* with zero transport delays.\n\n⚠️ _Please note: Stock allocation is on a first-come, first-served basis._\n\n📲 *Place order now:* Reply to this message or call +91 9110053474.\n\nBest regards,\n*Shankar Medical Hall* (Owner: Divya Prakash)`,
            'price-revision': `⚠️ *URGENT: Price Revision & Pre-Book Offer!* ⚠️\n\nDear Partner,\n\nPlease be informed that due to a significant rise in raw material (API) costs, there will be a *5% price revision* on our top-selling medicines. This revision will take effect from next week.\n\n📋 *New Rate List:* You can review the updated prices here:\nhttps://omcommunication290.github.io/shankar-medical-hall/\n\n💡 *Save on Your Next Batch:* You can still book your stock at the *current (old) rates* if you place your order *TODAY*.\n\n📲 *Place your booking now:* Reply to this message or call +91 9110053474 immediately to secure your pricing.\n\nBest regards,\n*Shankar Medical Hall* (Owner: Divya Prakash)`
        },
        email: {
            followup: `Subject: Urgent: Refill Your Stock | Fresh Inventory & Limited-Time Bulk Discounts\n\nDear Partner,\n\nWe noticed that it has been over 15 days since your last order. To ensure you don't face any stock-outs on fast-moving medicines, we are reaching out with an important inventory update.\n\n1. New Stock Now Available:\nWe have just received fresh, certified batches of our core pharmaceutical formulations, daily wellness supplements, and baby care range.\n\n2. Exclusive Bulk Offers (Active for 48 Hours):\n• Flat 5% extra discount on orders exceeding ₹15,000.\n• Buy 10, get 1 free on top-selling OTC and immunity-boosting brands.\n• Guaranteed priority dispatch within 24 hours.\n\nPlease reply to this email or call us directly at +91 9110053474 to lock in your rates and ensure priority dispatch.\n\nSincerely,\nDivya Prakash (Owner)\nShankar Medical Hall`,
            'price-revision': `Subject: URGENT: Price Revision Notice & Opportunity to Pre-Book at Old Rates\n\nDear Partner,\n\nWe are writing to notify you about an upcoming adjustment in our price list.\n\nDue to a substantial increase in raw material (API) and manufacturing costs, we are implementing a 5% price revision on our top-selling pharmaceutical products. This new pricing structure will be effective from next week.\n\nYou can review the new rate list on our B2B portal here: \nhttps://omcommunication290.github.io/shankar-medical-hall/\n\nPre-Book at Current Rates Today:\nWe highly value our relationship and want to help you minimize the impact of this change. You can book your stock at the current (lower) rates for all orders placed before today 9:00 PM.\n\nPlease review your inventory needs and reply to this email or contact our B2B desk directly at +91 9110053474 to lock in your rates.\n\nSincerely,\nDivya Prakash (Owner)\nShankar Medical Hall`
        }
    };

    if (selectWhatsappType && textWhatsapp) {
        selectWhatsappType.addEventListener('change', (e) => {
            const selectedType = e.target.value;
            textWhatsapp.textContent = messageTemplates.whatsapp[selectedType];
        });
    }

    if (selectEmailType && textEmail) {
        selectEmailType.addEventListener('change', (e) => {
            const selectedType = e.target.value;
            textEmail.textContent = messageTemplates.email[selectedType];
        });
    }

    // --- 12. B2B LIVE MASTER CATALOG & SEARCH ---
    const masterCatalog = [
        { id: "MED-001", name: "Calpol 650mg / Dolo 650", composition: "Paracetamol 650mg", category: "Fever & Pain", unit: "15 Tablets", mrp: "30.00", gst: "12%", ptr: "22.32", pts: "20.29" },
        { id: "MED-002", name: "Pan-D / Pantocid D", composition: "Pantoprazole 40mg + Domperidone", category: "Antacid / Gas", unit: "15 Capsules", mrp: "150.00", gst: "12%", ptr: "111.61", pts: "101.46" },
        { id: "MED-003", name: "Amoxyclav 625 / Augmentin", composition: "Amoxicillin + Clavulanic Acid", category: "Antibiotic", unit: "10 Tablets", mrp: "200.00", gst: "12%", ptr: "148.81", pts: "135.28" },
        { id: "MED-004", name: "Alerid / Cetzip", composition: "Cetirizine 10mg", category: "Allergy / Cold", unit: "10 Tablets", mrp: "45.00", gst: "12%", ptr: "33.48", pts: "30.44" },
        { id: "MED-005", name: "Montair-LC", composition: "Montelukast + Levocetirizine", category: "Cough & Allergy", unit: "10 Tablets", mrp: "170.00", gst: "12%", ptr: "126.49", pts: "114.99" },
        { id: "MED-006", name: "Combiflam", composition: "Ibuprofen + Paracetamol", category: "Painkiller", unit: "20 Tablets", mrp: "40.00", gst: "12%", ptr: "29.76", pts: "27.05" },
        { id: "MED-007", name: "Azithral 500 / Azee 500", composition: "Azithromycin 500mg", category: "Antibiotic", unit: "5 Tablets", mrp: "120.00", gst: "12%", ptr: "89.29", pts: "81.17" },
        { id: "MED-008", name: "Aciloc 150 / Rantac", composition: "Ranitidine 150mg", category: "Acidity", unit: "30 Tablets", mrp: "45.00", gst: "12%", ptr: "33.48", pts: "30.44" },
        { id: "MED-009", name: "Orofer XT", composition: "Ferrous Ascorbate + Folic Acid", category: "Iron Supplement", unit: "10 Tablets", mrp: "180.00", gst: "12%", ptr: "133.93", pts: "121.75" },
        { id: "MED-010", name: "Becosules", composition: "B-Complex + Vitamin C", category: "Multivitamin", unit: "20 Capsules", mrp: "55.00", gst: "12%", ptr: "40.92", pts: "37.20" },
        { id: "MED-011", name: "Limcee 500mg", composition: "Vitamin C (Chewable)", category: "Immunity", unit: "15 Tablets", mrp: "30.00", gst: "12%", ptr: "22.32", pts: "20.29" },
        { id: "MED-012", name: "Digene / Gelusil (Mint)", composition: "Antacid Gel (Liquid)", category: "Acidity Syrup", unit: "200ml Bottle", mrp: "130.00", gst: "12%", ptr: "96.73", pts: "87.94" }
    ];

    const catalogTbody = document.getElementById('catalog-tbody');
    const catalogSearch = document.getElementById('catalog-search');

    function renderCatalog(filterText = '') {
        if (!catalogTbody) return;
        catalogTbody.innerHTML = '';
        
        const lowerFilter = filterText.toLowerCase().trim();
        const filtered = masterCatalog.filter(item => 
            item.name.toLowerCase().includes(lowerFilter) || 
            item.composition.toLowerCase().includes(lowerFilter) ||
            item.id.toLowerCase().includes(lowerFilter) ||
            item.category.toLowerCase().includes(lowerFilter)
        );

        if (filtered.length === 0) {
            catalogTbody.innerHTML = '<tr class="empty-row"><td colspan="9" style="text-align:center; padding:30px 0; color:rgba(255,255,255,0.3);">No matching B2B products found.</td></tr>';
            return;
        }

        filtered.forEach(p => {
            const tr = document.createElement('tr');
            tr.style.borderBottom = '1px solid rgba(255, 255, 255, 0.05)';
            tr.innerHTML = `
                <td style="padding: 12px 16px; color: rgba(255,255,255,0.5); font-family: monospace;">${p.id}</td>
                <td style="padding: 12px 16px;"><strong>${p.name}</strong></td>
                <td style="padding: 12px 16px; color: rgba(255,255,255,0.7); font-style: italic;">${p.composition}</td>
                <td style="padding: 12px 16px;"><span style="background-color: rgba(255,255,255,0.06); padding: 3px 8px; border-radius: 4px; font-size: 11px; color: rgba(255,255,255,0.8);">${p.category}</span></td>
                <td style="padding: 12px 16px; color: rgba(255,255,255,0.6);">${p.unit}</td>
                <td style="padding: 12px 16px; text-align: right; font-weight: 500;">₹${p.mrp}</td>
                <td style="padding: 12px 16px; text-align: center; color: rgba(255,255,255,0.6);">${p.gst}</td>
                <td style="padding: 12px 16px; text-align: right; font-weight: 600; color: var(--color-secondary, #14B8A6);">₹${p.ptr}</td>
                <td style="padding: 12px 16px; text-align: right; font-weight: 600; color: #38BDF8;">₹${p.pts}</td>
            `;
            catalogTbody.appendChild(tr);
        });
    }

    if (catalogSearch) {
        catalogSearch.addEventListener('input', (e) => {
            renderCatalog(e.target.value);
        });
    }

    // Run on startup
    renderCatalog();
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
