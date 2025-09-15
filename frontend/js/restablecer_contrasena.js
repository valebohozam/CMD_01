// Password strength checker
        function checkPasswordStrength(password) {
            let strength = 0;
            const requirements = {
                length: password.length >= 8,
                uppercase: /[A-Z]/.test(password),
                lowercase: /[a-z]/.test(password),
                number: /\d/.test(password),
                special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
            };

            // Update requirement indicators
            Object.keys(requirements).forEach(req => {
                const element = document.getElementById(req);
                if (element) {
                    element.classList.toggle('valid', requirements[req]);
                    if (requirements[req]) strength++;
                }
            });

            // Update strength meter
            const strengthFill = document.getElementById('strengthFill');
            const strengthClasses = ['weak', 'fair', 'good', 'strong'];
            
            strengthFill.className = 'strength-fill';
            if (strength > 0) {
                const strengthLevel = Math.min(strength - 1, 3);
                strengthFill.classList.add(strengthClasses[strengthLevel]);
            }

            return strength === 5;
        }

        // Form validation
        function validateForm() {
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const submitBtn = document.getElementById('submitBtn');

            const isStrongPassword = checkPasswordStrength(newPassword);
            const passwordsMatch = newPassword === confirmPassword;
            const hasCurrentPassword = currentPassword.length > 0;

            submitBtn.disabled = !(isStrongPassword && passwordsMatch && hasCurrentPassword);

            // Show password mismatch error
            if (confirmPassword && !passwordsMatch) {
                showError('Las contraseñas no coinciden');
            } else if (confirmPassword && passwordsMatch) {
                hideMessages();
            }
        }

        // Show success message
        function showSuccess() {
            const successMsg = document.getElementById('successMessage');
            const errorMsg = document.getElementById('errorMessage');
            
            errorMsg.classList.remove('show');
            successMsg.classList.add('show');
            
            setTimeout(() => {
                successMsg.classList.remove('show');
            }, 5000);
        }

        // Show error message
        function showError(message) {
            const successMsg = document.getElementById('successMessage');
            const errorMsg = document.getElementById('errorMessage');
            const errorText = document.getElementById('errorText');
            
            successMsg.classList.remove('show');
            errorText.textContent = message;
            errorMsg.classList.add('show');
            
            setTimeout(() => {
                errorMsg.classList.remove('show');
            }, 5000);
        }

        // Hide all messages
        function hideMessages() {
            const successMsg = document.getElementById('successMessage');
            const errorMsg = document.getElementById('errorMessage');
            
            successMsg.classList.remove('show');
            errorMsg.classList.remove('show');
        }

        // Simulate password change
        function simulatePasswordChange() {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    // Simulate success/failure (90% success rate)
                    if (Math.random() > 0.1) {
                        resolve();
                    } else {
                        reject(new Error('Error del servidor'));
                    }
                }, 2000);
            });
        }

        // Handle form submission
        async function handleSubmit(e) {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submitBtn');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.textContent = 'Cambiando contraseña...';
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            
            try {
                await simulatePasswordChange();
                
                // Success
                showSuccess();
                document.getElementById('changePasswordForm').reset();
                
                // Redirect after success
                setTimeout(() => {
                    window.location.href = 'profile.html';
                }, 2000);
                
            } catch (error) {
                showError(error.message || 'Error al cambiar la contraseña');
            } finally {
                // Reset button state
                submitBtn.textContent = originalText;
                submitBtn.classList.remove('loading');
                setTimeout(() => {
                    validateForm();
                }, 100);
            }
        }

        // Initialize form
        document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('changePasswordForm');
            const newPasswordInput = document.getElementById('newPassword');
            const confirmPasswordInput = document.getElementById('confirmPassword');
            const currentPasswordInput = document.getElementById('currentPassword');
            
            // Add event listeners
            form.addEventListener('submit', handleSubmit);
            
            [newPasswordInput, confirmPasswordInput, currentPasswordInput].forEach(input => {
                input.addEventListener('input', validateForm);
                input.addEventListener('focus', hideMessages);
            });
            
            // Initial validation
            validateForm();
        });