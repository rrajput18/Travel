document.addEventListener('DOMContentLoaded', () => {
    // --- SCROLL ACTION & STICKY HEADER ---
    const header = document.querySelector('header');
    const scrollBtn = document.createElement('div');
    scrollBtn.className = 'scroll-progress-btn';
    scrollBtn.innerHTML = `
        <svg>
            <circle class="bg-circle" cx="25" cy="25" r="21"></circle>
            <circle class="progress-circle" cx="25" cy="25" r="21"></circle>
        </svg>
        <i class="fa-solid fa-arrow-up"></i>
    `;
    document.body.appendChild(scrollBtn);

    const progressCircle = scrollBtn.querySelector('.progress-circle');
    let pathLength = 0;
    
    if (progressCircle) {
        pathLength = progressCircle.getTotalLength();
        progressCircle.style.strokeDasharray = `${pathLength} ${pathLength}`;
        progressCircle.style.strokeDashoffset = pathLength;
    }

    const handleScroll = () => {
        // Sticky Header Toggle
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('sticky');
            } else {
                header.classList.remove('sticky');
            }
        }

        // Scroll Progress Bar Update
        const scroll = window.scrollY;
        const height = document.documentElement.scrollHeight - window.innerHeight;
        
        if (height > 0) {
            if (progressCircle) {
                const progress = pathLength - (scroll * pathLength / height);
                progressCircle.style.strokeDashoffset = progress;
            }
            
            if (scroll > 300) {
                scrollBtn.classList.add('active');
            } else {
                scrollBtn.classList.remove('active');
            }
        } else {
            scrollBtn.classList.remove('active');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run once in case page loads scrolled

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- MOBILE NAVBAR TOGGLE ---
    const menuIcon = document.getElementById('menu-icon');
    const navbar = document.querySelector('.navbar');

    if (menuIcon && navbar) {
        menuIcon.addEventListener('click', () => {
            navbar.classList.toggle('active');
            menuIcon.classList.toggle('bx-x');
        });

        // Close navbar on clicking outside
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target) && !menuIcon.contains(e.target)) {
                navbar.classList.remove('active');
                menuIcon.classList.remove('bx-x');
            }
        });

        // Close navbar on link click
        navbar.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navbar.classList.remove('active');
                menuIcon.classList.remove('bx-x');
            });
        });
    }

    // --- TOAST NOTIFICATIONS ---
    window.showToast = (message, type = 'success') => {
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        const iconClass = type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-info';
        toast.innerHTML = `<i class="${iconClass}"></i><span>${message}</span>`;
        toastContainer.appendChild(toast);

        // Animate Slide In
        setTimeout(() => toast.classList.add('active'), 10);

        // Remove Toast
        setTimeout(() => {
            toast.classList.remove('active');
            setTimeout(() => toast.remove(), 400);
        }, 3500);
    };

    // --- DESTINATION INFO API INTEGRATION ---
    const destModalOverlay = document.getElementById('dest-modal-overlay');
    const destModalTitle = document.getElementById('dest-modal-title');
    const destModalSubtitle = document.getElementById('dest-modal-subtitle');
    const destModalDesc = document.getElementById('dest-modal-desc');
    const factCapital = document.getElementById('fact-capital');
    const factLanguages = document.getElementById('fact-languages');
    const factCurrency = document.getElementById('fact-currency');
    const factPopulation = document.getElementById('fact-population');
    const weatherLoading = document.getElementById('weather-loading');
    const weatherInfo = document.getElementById('weather-info');
    const weatherTemp = document.getElementById('weather-temp');
    const weatherWind = document.getElementById('weather-wind');

    const destData = {
        "bali": { country: "indonesia", lat: -8.4095, lon: 115.1889, desc: "Bali is a world-renowned tropical paradise in Indonesia, famous for its scenic volcanic mountains, iconic rice terraces, beaches, and rich cultural heritage." },
        "machipicchu": { country: "peru", lat: -13.1631, lon: -72.5450, desc: "Machu Picchu is a 15th-century Inca citadel located in the Eastern Cordillera of southern Peru, set high on a mountain ridge above the Sacred Valley." },
        "switzerland": { country: "switzerland", lat: 46.8182, lon: 8.2275, desc: "Switzerland is a mountainous Central European country, home to numerous lakes, villages and the high peaks of the Alps." },
        "maldives": { country: "maldives", lat: 3.2028, lon: 73.2207, desc: "The Maldives is a tropical nation in the Indian Ocean composed of 26 ring-shaped atolls, which are made up of more than 1,000 coral islands." },
        "dubai": { country: "united arab emirates", lat: 25.2048, lon: 55.2708, desc: "Dubai is a luxury destination in the United Arab Emirates, globally famous for its ultra-modern architecture, towering Burj Khalifa, and vibrant shopping festivals." },
        "hawaii": { country: "united states", lat: 20.7967, lon: -156.3319, desc: "Hawaii is a stunning volcanic archipelago in the Central Pacific, famous for its surf beaches, lush rainforests, and welcoming Aloha spirit." },
        "lasvegas": { country: "united states", lat: 36.1716, lon: -115.1398, desc: "Las Vegas is a world-famous resort city in Nevada, renowned for its vibrant 24-hour casinos, world-class entertainment, and luxury dining." },
        "japan": { country: "japan", lat: 35.6762, lon: 139.6503, desc: "Japan is an island nation in East Asia, offering a rich blend of ancient imperial palaces, historic temples, and cutting-edge modern skyscraper districts." },
        "greece": { country: "greece", lat: 37.9838, lon: 23.7275, desc: "Greece is a beautiful Mediterranean nation with thousands of picturesque islands, historic ruins, and a major role in ancient world history." }
    };

    const fetchDestinationDetails = async (name) => {
        const destKey = name.toLowerCase().replace(/[\s-()]/g, '');
        let key = Object.keys(destData).find(k => k === destKey);
        
        if (!key) {
            // Try partial match
            key = Object.keys(destData).find(k => destKey.includes(k) || k.includes(destKey));
        }
        if (!key) return;

        const info = destData[key];
        
        // Setup initial UI
        if (destModalTitle) destModalTitle.innerText = name;
        if (destModalSubtitle) destModalSubtitle.innerText = `Explore ${info.country.toUpperCase()}`;
        if (destModalDesc) destModalDesc.innerText = info.desc;
        if (weatherLoading) {
            weatherLoading.style.display = 'block';
            weatherLoading.innerText = 'Fetching live weather...';
        }
        if (weatherInfo) weatherInfo.style.display = 'none';

        // Open modal
        if (destModalOverlay) {
            destModalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        // 1. Fetch Country Facts from RestCountries API
        try {
            const countryRes = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(info.country)}`);
            if (countryRes.ok) {
                const countryData = await countryRes.json();
                const country = countryData[0];
                
                if (factCapital) factCapital.innerText = country.capital ? country.capital[0] : 'N/A';
                if (factLanguages) factLanguages.innerText = country.languages ? Object.values(country.languages).join(', ') : 'N/A';
                
                if (factCurrency) {
                    if (country.currencies) {
                        const cur = Object.values(country.currencies)[0];
                        factCurrency.innerText = `${cur.name} (${cur.symbol || ''})`;
                    } else {
                        factCurrency.innerText = 'N/A';
                    }
                }
                
                if (factPopulation) factPopulation.innerText = country.population ? country.population.toLocaleString() : 'N/A';
            } else {
                throw new Error('Country data error');
            }
        } catch (err) {
            console.error('Failed to fetch country details:', err);
            if (factCapital) factCapital.innerText = 'N/A';
            if (factLanguages) factLanguages.innerText = 'N/A';
            if (factCurrency) factCurrency.innerText = 'N/A';
            if (factPopulation) factPopulation.innerText = 'N/A';
        }

        // 2. Fetch Weather Info from Open-Meteo Weather API
        try {
            const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${info.lat}&longitude=${info.lon}&current_weather=true`);
            if (weatherRes.ok) {
                const wData = await weatherRes.json();
                const temp = wData.current_weather.temperature;
                const wind = wData.current_weather.windspeed;
                
                if (weatherTemp) weatherTemp.innerText = `${temp}°C`;
                if (weatherWind) weatherWind.innerText = `${wind} km/h`;
                
                if (weatherLoading) weatherLoading.style.display = 'none';
                if (weatherInfo) weatherInfo.style.display = 'block';
            } else {
                throw new Error('Weather data error');
            }
        } catch (err) {
            console.error('Failed to fetch weather details:', err);
            if (weatherLoading) weatherLoading.innerText = 'Live weather currently unavailable.';
        }
    };

    const closeDestModal = () => {
        if (!destModalOverlay) return;
        destModalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    // --- DYNAMIC BOOKING SYSTEM MODAL ---
    let currentBasePrice = 0;
    let currentGuests = 1;
    const modalOverlay = document.getElementById('booking-modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    const summaryBasePrice = document.getElementById('summary-base-price');
    const summaryGuestsCount = document.getElementById('summary-guests-count');
    const summaryTotalPrice = document.getElementById('summary-total-price');
    const guestsVal = document.getElementById('guests-val');
    const bookDateInput = document.getElementById('book-date');
    const bookingForm = document.getElementById('booking-form');

    // Date validator: cannot choose prior dates
    if (bookDateInput) {
        const today = new Date().toISOString().split('T')[0];
        bookDateInput.min = today;
    }

    const openBookingModal = (destination, price) => {
        if (!modalOverlay) return;
        currentBasePrice = price;
        currentGuests = 1;

        if (modalTitle) modalTitle.innerText = `Book Tour to ${destination}`;
        if (guestsVal) guestsVal.innerText = currentGuests;
        
        updateBookingSummary();
        
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeBookingModal = () => {
        if (!modalOverlay) return;
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        if (bookingForm) bookingForm.reset();
    };

    const updateBookingSummary = () => {
        if (summaryBasePrice) summaryBasePrice.innerText = `$${currentBasePrice}`;
        if (summaryGuestsCount) summaryGuestsCount.innerText = `x ${currentGuests}`;
        if (summaryTotalPrice) summaryTotalPrice.innerText = `$${currentBasePrice * currentGuests}`;
    };

    // Global click listener for dynamic features (Book buttons, Destination Cards & Modal elements)
    document.addEventListener('click', (e) => {
        // Book Now Buttons Click
        const bookBtn = e.target.closest('.book-btn');
        if (bookBtn) {
            const card = bookBtn.closest('.box');
            const destName = card.querySelector('.loc h4').innerText;
            const priceText = card.querySelector('h3').innerText;
            const price = parseInt(priceText.replace(/[^0-9]/g, ''));
            openBookingModal(destName, price);
            return;
        }

        // Destination Cards Click (API Integration)
        const destCard = e.target.closest('.col-con');
        if (destCard) {
            const titleElement = destCard.querySelector('h5');
            if (titleElement) {
                const destName = titleElement.innerText;
                fetchDestinationDetails(destName);
            }
            return;
        }

        // Modal Guests Control
        if (e.target.id === 'increase-guests') {
            currentGuests++;
            if (guestsVal) guestsVal.innerText = currentGuests;
            updateBookingSummary();
        } else if (e.target.id === 'decrease-guests') {
            if (currentGuests > 1) {
                currentGuests--;
                if (guestsVal) guestsVal.innerText = currentGuests;
                updateBookingSummary();
            }
        }

        // Close triggers for Booking Modal
        if (e.target.id === 'close-modal-btn' || e.target === modalOverlay) {
            closeBookingModal();
        }

        // Close triggers for Destination Details Modal
        if (e.target.id === 'close-dest-modal-btn' || e.target === destModalOverlay) {
            closeDestModal();
        }
    });

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('book-name').value;
            const destination = (modalTitle ? modalTitle.innerText : 'Tour').replace('Book Tour to ', '');
            
            const submitBtn = bookingForm.querySelector('.confirm-booking-btn');
            const originalBtnText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Confirming Reservation...`;
            
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                closeBookingModal();
                window.showToast(`Success, ${name}! Your reservation for ${destination} has been confirmed.`, 'success');
            }, 1000);
        });
    }


    // --- FAQ ACCORDION ---
    document.addEventListener('click', (e) => {
        const questionBtn = e.target.closest('.faq-question');
        if (questionBtn) {
            const faqItem = questionBtn.closest('.faq-item');
            const faqAccordion = faqItem.closest('.faq-accordion');
            
            // Close other items
            faqAccordion.querySelectorAll('.faq-item.active').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                    const ans = item.querySelector('.faq-answer');
                    if (ans) ans.style.maxHeight = null;
                }
            });

            faqItem.classList.toggle('active');
            const answer = faqItem.querySelector('.faq-answer');
            if (answer) {
                if (faqItem.classList.contains('active')) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    answer.style.maxHeight = null;
                }
            }
        }
    });

    // --- NEWSLETTER FORM SUBMIT ---
    const contactForm = document.querySelector('.send');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('name');
            const name = nameInput ? nameInput.value : 'Traveler';
            window.showToast(`Thanks for subscribing, ${name}! Checked inbox soon.`, 'success');
            contactForm.reset();
        });
    }

    // --- SCROLL REVEAL ANIMATION (INTERSECTION OBSERVER) ---
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    revealObserver.unobserve(entry.target); // Reveal only once
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }
});
