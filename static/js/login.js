document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.getElementById('password-toggle');
    const messageBanner = document.getElementById('message-banner');

    // Password Visibility Toggle Mechanics
    passwordToggle.addEventListener('click', () => {
        const isPassword = passwordInput.getAttribute('type') === 'password';
        passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
        
        // Dynamically shift SVG eye interface icons safely via innerHTML standard vectors
        passwordToggle.innerHTML = isPassword 
            ? `<svg class="eye-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`
            : `<svg class="eye-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
    });

    // Helper: Render runtime errors smoothly across validation operations
    const setFieldError = (inputElement, errorElementId, message) => {
        const errorElement = document.getElementById(errorElementId);
        if (message) {
            inputElement.classList.add('invalid');
            errorElement.textContent = message;
        } else {
            inputElement.classList.remove('invalid');
            errorElement.textContent = '';
        }
    };

    // Helper: Display platform notification toasts or structural alerts
    const displayBanner = (message, type) => {
        messageBanner.textContent = message;
        messageBanner.className = `message-banner ${type}`;
        messageBanner.classList.remove('hidden');
    };

    const clearBanner = () => {
        messageBanner.textContent = '';
        messageBanner.className = 'message-banner hidden';
    };

    // Email Regex Expression Validation standard
    const isValidEmail = (email) => {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return regex.test(email.trim());
    };

    // Live clean-up interactions during input typing states
    emailInput.addEventListener('input', () => setFieldError(emailInput, 'email-error', ''));
    passwordInput.addEventListener('input', () => setFieldError(passwordInput, 'password-error', ''));

    // Intercept submit state pipeline processes
    loginForm.addEventListener('submit', (e) => {

    clearBanner();

    let isFormValid = true;

    // validations

    if (!isFormValid) {
        e.preventDefault();
        return;
    }



        // Validation - Email Checks
        if (!emailInput.value.trim()) {
            setFieldError(emailInput, 'email-error', 'Email field cannot be empty.');
            isFormValid = false;
        } else if (!isValidEmail(emailInput.value)) {
            setFieldError(emailInput, 'email-error', 'Please enter a valid email address.');
            isFormValid = false;
        } else {
            setFieldError(emailInput, 'email-error', '');
        }

        // Validation - Password Checks
        if (!passwordInput.value.trim()) {
            setFieldError(passwordInput, 'password-error', 'Password field cannot be empty.');
            isFormValid = false;
        } else {
            setFieldError(passwordInput, 'password-error', '');
        }

        // Form Submission Execution Simulation
        if (isFormValid) {
            const submitButton = loginForm.querySelector('.btn-submit');
            submitButton.disabled = true;
            submitButton.textContent = 'Authenticating...';

            setTimeout(() => {
                displayBanner('Welcome back, Hero! Loading your Quest panel...', 'success');
                // You can safely redirect or handle session assignment pipelines here:
                // window.location.href = 'dashboard.html';
            }, 1200);
        } else {
            displayBanner('Please correct the highlighted errors above before proceeding.', 'error');
        }
    });
});