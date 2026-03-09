// =====================
// HOMEPAGE INTERACTIONS
// =====================

// Navbar scroll effect
const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
    });
}

// Mobile menu toggle
const mobileToggle = document.getElementById('mobileToggle');
if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        const navLinks = document.querySelector('.nav-links');
        const navActions = document.querySelector('.nav-actions');
        if (navLinks) navLinks.classList.toggle('show');
        if (navActions) navActions.classList.toggle('show');
    });
}

// Animate feature cards on scroll
const featureCards = document.querySelectorAll('.feature-card');
if (featureCards.length > 0) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                entry.target.style.animation = `fadeInUp 0.6s ease-out ${i * 0.1}s both`;
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    featureCards.forEach(card => observer.observe(card));
}

// Create floating particles on left panel
const heroLeft = document.querySelector('.hero-left');
if (heroLeft) {
    function createParticle() {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 6 + 3}px;
            height: ${Math.random() * 6 + 3}px;
            background: rgba(86, 171, 145, ${Math.random() * 0.15 + 0.05});
            border-radius: 50%;
            pointer-events: none;
            left: ${Math.random() * 100}%;
            bottom: -10px;
            z-index: 0;
            animation: particleRise ${Math.random() * 6 + 6}s linear forwards;
        `;
        heroLeft.appendChild(particle);
        setTimeout(() => particle.remove(), 12000);
    }

    // Add particle keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes particleRise {
            0% { transform: translateY(0) translateX(0); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(-100vh) translateX(${Math.random() * 60 - 30}px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // Spawn particles periodically
    setInterval(createParticle, 2000);
    // Create a few initial particles
    for (let i = 0; i < 3; i++) {
        setTimeout(createParticle, i * 600);
    }
}


// =====================
// STRESS FORM
// =====================

let stressForm = document.getElementById("stressForm")

if (stressForm) {

    stressForm.addEventListener("submit", function (e) {

        e.preventDefault()

        let q1 = parseInt(document.querySelector('[name="q1"]').value)
        let q2 = parseInt(document.querySelector('[name="q2"]').value)
        let q3 = parseInt(document.querySelector('[name="q3"]').value)

        let score = q1 + q2 + q3

        let result = ""

        if (score <= 5) {
            result = "Low Stress 🙂"
        }
        else if (score <= 10) {
            result = "Moderate Stress 😐"
        }
        else {
            result = "High Stress ⚠️ Consider relaxation or support."
        }

        document.getElementById("result").innerText =
            "Your Stress Level: " + result

    })

}


// =====================
// LOGIN
// =====================

let loginForm = document.getElementById("loginForm")

if (loginForm) {

    loginForm.addEventListener("submit", function (e) {

        e.preventDefault()

        let email = document.getElementById("email").value
        let password = document.getElementById("password").value

        // Show loading state
        const btn = document.getElementById("loginBtn");
        if (btn) {
            btn.innerHTML = '<span>Signing in...</span>';
            btn.disabled = true;
        }

        fetch("http://localhost:3000/login", {

            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({ email, password })

        })
            .then(res => res.json())
            .then(data => {

                const resultEl = document.getElementById("loginResult");
                if (resultEl) {
                    resultEl.innerText = data.message;
                    resultEl.style.color = data.success ? '#3d9b7a' : '#e74c3c';
                }

                if (data.success) {
                    window.location.href = "index.html"
                }

                // Reset button
                if (btn) {
                    btn.innerHTML = '<span>Sign In</span><svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" fill="currentColor"/></svg>';
                    btn.disabled = false;
                }

            })
            .catch(err => {
                const resultEl = document.getElementById("loginResult");
                if (resultEl) {
                    resultEl.innerText = "Connection error. Please try again.";
                    resultEl.style.color = '#e74c3c';
                }
                if (btn) {
                    btn.innerHTML = '<span>Sign In</span><svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" fill="currentColor"/></svg>';
                    btn.disabled = false;
                }
            })

    })

}


// =====================
// REGISTER
// =====================

let registerForm = document.getElementById("registerForm")

if (registerForm) {

    registerForm.addEventListener("submit", function (e) {

        e.preventDefault()

        let name = document.getElementById("name").value
        let email = document.getElementById("regEmail").value
        let password = document.getElementById("regPassword").value

        fetch("http://localhost:3000/register", {

            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({ name, email, password })

        })
            .then(res => res.json())
            .then(data => {

                document.getElementById("registerResult").innerText = data.message

            })

    })

}