// Form switching functionality
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const switchToRegister = document.getElementById('switchToRegister');
    const switchToLogin = document.getElementById('switchToLogin');
    const logoContainers = document.querySelectorAll('.logo-container');

    // Fix variables for gradient in words
    document.documentElement.style.setProperty('--bg-color', '#2c3e50');
    
    // Tab switching functionality (if tabs are used in the UI)
    const tabBtns = document.querySelectorAll('.tab-btn');
    const forms = document.querySelectorAll('.form-content');

    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons and forms
                tabBtns.forEach(b => b.classList.remove('active'));
                forms.forEach(f => f.classList.remove('active'));
                
                // Add active class to clicked button and corresponding form
                btn.classList.add('active');
                document.getElementById(`${btn.dataset.tab}Form`).classList.add('active');
            });
        });
    }

    // Switch to Register form
    if (switchToRegister) {
        switchToRegister.addEventListener('click', function(e) {
            e.preventDefault();
            loginForm.classList.remove('active');
            registerForm.classList.add('active');
        });
    }

    // Switch to Login form
    if (switchToLogin) {
        switchToLogin.addEventListener('click', function(e) {
            e.preventDefault();
            registerForm.classList.remove('active');
            loginForm.classList.add('active');
        });
    }

    // Form validation functions
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePassword(password) {
        return password.length >= 8;
    }

    function validateName(name) {
        return name.length >= 2;
    }

    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = loginForm.querySelector('input[name="email"]').value;
            const password = loginForm.querySelector('input[name="password"]').value;

            // Validate inputs
            if (!validateEmail(email)) {
                alert('Please enter a valid email address');
                return;
            }
            if (!validatePassword(password)) {
                alert('Password must be at least 8 characters long');
                return;
            }
            
            // Show loading state
            const submitBtn = loginForm.querySelector('.button-confirm');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Signing in...';
            submitBtn.disabled = true;
            
            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    // Store token in localStorage
                    localStorage.setItem('token', data.token);
                    
                    // Redirect to dashboard with a nice transition
                    document.body.style.opacity = 0;
                    setTimeout(() => {
                        window.location.href = '/dashboard.html';
                    }, 500);
                } else {
                    // Show error message with more details
                    const errorMessage = data.message || 'Login failed. Please check your credentials.';
                    alert(errorMessage);
                    
                    // Reset button and form
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                    loginForm.reset();
                }
            } catch (error) {
                console.error('Login error:', error);
                alert('Network error. Please check your connection and try again.');
                
                // Reset button and form
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
                loginForm.reset();
            }
        });
    }

    // Register form submission
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = registerForm.querySelector('input[name="name"]').value;
            const email = registerForm.querySelector('input[name="email"]').value;
            const password = registerForm.querySelector('input[name="password"]').value;
            const gender = registerForm.querySelector('select[name="gender"]').value;

            // Validate inputs
            if (!validateName(name)) {
                alert('Please enter a valid name (at least 2 characters)');
                return;
            }
            if (!validateEmail(email)) {
                alert('Please enter a valid email address');
                return;
            }
            if (!validatePassword(password)) {
                alert('Password must be at least 8 characters long');
                return;
            }
            if (!gender) {
                alert('Please select your gender');
                return;
            }
            
            // Show loading state
            const submitBtn = registerForm.querySelector('.button-confirm');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Creating...';
            submitBtn.disabled = true;
            
            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, password, gender })
                });

                const data = await response.json();

                if (response.ok) {
                    // Store token in localStorage
                    localStorage.setItem('token', data.token);
                    
                    // Redirect to mood selection with a nice transition
                    document.body.style.opacity = 0;
                    setTimeout(() => {
                        window.location.href = '/mood-selection.html';
                    }, 500);
                } else {
                    // Show error message with more details
                    const errorMessage = data.message || 'Registration failed. Please try again.';
                    alert(errorMessage);
                    
                    // Reset button and form
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                    registerForm.reset();
                }
            } catch (error) {
                console.error('Registration error:', error);
                alert('Network error. Please check your connection and try again.');
                
                // Reset button and form
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
                registerForm.reset();
            }
        });
    }

    // Add button hover effects for social login buttons
    const socialButtons = document.querySelectorAll('.button-log');
    
    socialButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.icon');
            if (icon) {
                icon.style.fill = '#fff';
            }
        });
        
        button.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.icon');
            if (icon) {
                icon.style.fill = 'var(--accent-color)';
            }
        });
    });

    // Logo animation
    function toggleLogoExpansion() {
        logoContainers.forEach(container => {
            container.classList.add('logo-expanding');
            
            setTimeout(() => {
                container.classList.remove('logo-expanding');
            }, 4000); // Keep expanded for 4 seconds
        });
    }

    // Start the first animation after 1 second
    setTimeout(() => {
        toggleLogoExpansion();
        
        // Set up the interval to run every 8 seconds
        setInterval(toggleLogoExpansion, 8000);
    }, 1000);

    // Add hover effect
    logoContainers.forEach(container => {
        container.addEventListener('mouseenter', function() {
            this.classList.add('logo-expanding');
        });
        
        container.addEventListener('mouseleave', function() {
            if (!this.classList.contains('manual-expanding')) {
                this.classList.remove('logo-expanding');
            }
        });
        
        container.addEventListener('click', function() {
            this.classList.toggle('manual-expanding');
            if (this.classList.contains('manual-expanding')) {
                this.classList.add('logo-expanding');
            } else {
                this.classList.remove('logo-expanding');
            }
        });
    });

    // Add some visual feedback for login form
    if (loginForm && registerForm) {
        const loginInputs = loginForm.querySelectorAll('.input');
        const registerInputs = registerForm.querySelectorAll('.input');
        
        loginInputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.classList.add('input-focused');
            });
            
            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.classList.remove('input-focused');
                }
            });
        });
        
        registerInputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.classList.add('input-focused');
            });
            
            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.classList.remove('input-focused');
                }
            });
        });
    }
}); 