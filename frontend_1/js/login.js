        // Form validation and interactivity
        const form = document.getElementById('registerForm');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const passwordStrength = document.getElementById('passwordStrength');
        const submitBtn = document.getElementById('submitBtn');
        const alertContainer = document.getElementById('alert-container');

        // Password strength checker
        function checkPasswordStrength(password) {
            const minLength = password.length >= 8;
            const hasUpper = /[A-Z]/.test(password);
            const hasLower = /[a-z]/.test(password);
            const hasNumber = /\d/.test(password);
            const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

            const strength = [minLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;

            if (strength < 3) {
                return { level: 'weak', text: 'Contraseña débil - Agrega mayúsculas, números y símbolos' };
            } else if (strength < 5) {
                return { level: 'medium', text: 'Contraseña media - Considera agregar más caracteres especiales' };
            } else {
                return { level: 'strong', text: 'Contraseña fuerte' };
            }
        }

        passwordInput.addEventListener('input', function() {
            const password = this.value;
            if (password.length > 0) {
                const strength = checkPasswordStrength(password);
                passwordStrength.style.display = 'block';
                passwordStrength.className = `password-strength ${strength.level}`;
                passwordStrength.textContent = strength.text;
            } else {
                passwordStrength.style.display = 'none';
            }
            validatePasswords();
        });

        confirmPasswordInput.addEventListener('input', validatePasswords);

        function validatePasswords() {
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;

            if (confirmPassword.length > 0 && password !== confirmPassword) {
                confirmPasswordInput.style.borderColor = 'var(--error-color)';
                showAlert('Las contraseñas no coinciden', 'error');
            } else {
                confirmPasswordInput.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                clearAlert();
            }
        }

        // Form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            // Validation
            if (!data.terms) {
                showAlert('Debes aceptar los términos y condiciones', 'error');
                return;
            }

            if (data.password !== data.confirmPassword) {
                showAlert('Las contraseñas no coinciden', 'error');
                return;
            }

            const passwordCheck = checkPasswordStrength(data.password);
            if (passwordCheck.level === 'weak') {
                showAlert('La contraseña es muy débil. Por favor, crea una contraseña más segura.', 'error');
                return;
            }

            // Simulate registration process
            submitBtn.disabled = true;
            submitBtn.textContent = 'Creando cuenta...';

            setTimeout(() => {
                showAlert('¡Cuenta creada exitosamente! Te hemos enviado un correo de verificación.', 'success');
                form.reset();
                passwordStrength.style.display = 'none';
                submitBtn.disabled = false;
                submitBtn.textContent = 'Crear Cuenta';
                
                // Redirect after success (simulate)
                setTimeout(() => {
                    // window.location.href = 'login.html';
                }, 2000);
            }, 2000);
        });

        function showAlert(message, type) {
            clearAlert();
            const alert = document.createElement('div');
            alert.className = `alert alert-${type}`;
            alert.textContent = message;
            alertContainer.appendChild(alert);
        }

        function clearAlert() {
            alertContainer.innerHTML = '';
        }

        // Email validation
        document.getElementById('email').addEventListener('blur', function() {
            const email = this.value;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (email && !emailRegex.test(email)) {
                this.style.borderColor = 'var(--error-color)';
                showAlert('Por favor, ingresa un correo electrónico válido', 'error');
            } else {
                this.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                clearAlert();
            }
        });

        // Phone number formatting
        document.getElementById('phone').addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.startsWith('57')) {
                value = value.substring(2);
            }
            if (value.length > 10) {
                value = value.substring(0, 10);
            }
            if (value.length >= 3) {
                value = value.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
            }
            this.value = value ? '+57 ' + value : '';
        });