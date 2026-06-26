document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const nameInput = document.getElementById('fullname');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const termsCheckbox = document.getElementById('terms');
    const passwordToggle = document.getElementById('password-toggle');
    const messageBanner = document.getElementById('message-banner');

    // Password Visibility Toggle Mechanics
    passwordToggle.addEventListener('click', () => {
        const isPassword = passwordInput.getAttribute('type') === 'password';
        passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
        
        passwordToggle.innerHTML = isPassword 
            ? `<svg class="eye-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`
            : `<svg class="eye-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
    });

    // Helper: Render runtime errors smoothly across validation operations
    const setFieldError = (inputElement, errorElementId, message) => {
        const errorElement = document.getElementById(errorElementId);
        if (message) {
            if(inputElement) inputElement.classList.add('invalid');
            errorElement.textContent = message;
        } else {
            if(inputElement) inputElement.classList.remove('invalid');
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
    nameInput.addEventListener('input', () => setFieldError(nameInput, 'name-error', ''));
    emailInput.addEventListener('input', () => setFieldError(emailInput, 'email-error', ''));
    passwordInput.addEventListener('input', () => setFieldError(passwordInput, 'password-error', ''));
    termsCheckbox.addEventListener('change', () => setFieldError(null, 'terms-error', ''));

    // Intercept submit state pipeline processes
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        clearBanner();
        
        let isFormValid = true;

        // Validation - Name Checks
        if (!nameInput.value.trim()) {
            setFieldError(nameInput, 'name-error', 'Name field cannot be empty.');
            isFormValid = false;
        } else if (nameInput.value.trim().length < 2) {
            setFieldError(nameInput, 'name-error', 'Name must be at least 2 characters long.');
            isFormValid = false;
        } else {
            setFieldError(nameInput, 'name-error', '');
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

        // Validation - Password Complexity Checks
        if (!passwordInput.value) {
            setFieldError(passwordInput, 'password-error', 'Password field cannot be empty.');
            isFormValid = false;
        } else if (passwordInput.value.length < 8) {
            setFieldError(passwordInput, 'password-error', 'Password must be at least 8 characters long.');
            isFormValid = false;
        } else {
            setFieldError(passwordInput, 'password-error', '');
        }

        // Validation - Checkbox Explicit Agreement verification
        if (!termsCheckbox.checked) {
            setFieldError(null, 'terms-error', 'You must agree to the policies to create an account.');
            isFormValid = false;
        } else {
            setFieldError(null, 'terms-error', '');
        }

        // Form Submission Execution Simulation
        if (isFormValid) {
            const submitButton = signupForm.querySelector('.btn-submit');
            submitButton.disabled = true;
            submitButton.textContent = 'Creating Adventurer Profile...';

            setTimeout(() => {
                displayBanner('Account created successfully! Preparing your custom workspace...', 'success');
                signupForm.reset();
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
            }, 1200);
        } else {
            displayBanner('Please resolve the errors highlighted below to initialize registration.', 'error');
        }
    });
});