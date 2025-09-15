        // Global variables
        let originalData = {};
        let isEditing = false;
        let currentAvatar = null;

        // DOM Elements
        const menuLinks = document.querySelectorAll('.menu-link');
        const contentSections = document.querySelectorAll('.content-section');
        const editBtn = document.getElementById('editBtn');
        const cancelBtn = document.getElementById('cancelBtn');
        const saveBtn = document.getElementById('saveBtn');
        const actionButtons = document.getElementById('actionButtons');
        const profileForm = document.getElementById('profileForm');
        const alertContainer = document.getElementById('alert-container');
        const avatarUpload = document.getElementById('avatarUpload');
        const avatarInput = document.getElementById('avatarInput');
        const profileAvatar = document.getElementById('profileAvatar');
        const navAvatar = document.getElementById('navAvatar');
        const displayName = document.getElementById('displayName');
        const displayRole = document.getElementById('displayRole');

        // Initialize application
        document.addEventListener('DOMContentLoaded', function() {
            initializeNavigation();
            initializeProfileEdit();
            initializeAvatarUpload();
            initializeSecurityFeatures();
            initializePreferences();
            initializeStatistics();
        });

        // Navigation functionality
        function initializeNavigation() {
            menuLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    // Don't switch if currently editing
                    if (isEditing) {
                        showAlert('Guarda o cancela los cambios antes de navegar a otra sección.', 'info');
                        return;
                    }
                    
                    // Remove active class from all links
                    menuLinks.forEach(l => l.classList.remove('active'));
                    // Add active class to clicked link
                    link.classList.add('active');

                    // Hide all sections with fade effect
                    contentSections.forEach(section => {
                        section.style.opacity = '0';
                        setTimeout(() => {
                            section.style.display = 'none';
                        }, 150);
                    });
                    
                    // Show target section with fade effect
                    setTimeout(() => {
                        const targetSection = link.dataset.section + '-section';
                        const section = document.getElementById(targetSection);
                        section.style.display = 'block';
                        setTimeout(() => {
                            section.style.opacity = '1';
                        }, 50);
                    }, 150);
                });
            });
        }

        // Profile editing functionality
        function initializeProfileEdit() {
            editBtn.addEventListener('click', enterEditMode);
            cancelBtn.addEventListener('click', exitEditMode);
            saveBtn.addEventListener('click', saveProfile);
        }

        function enterEditMode() {
            // Store original data
            const formData = new FormData(profileForm);
            originalData = Object.fromEntries(formData);
            
            // Enable form fields with animation
            const inputs = profileForm.querySelectorAll('input, select, textarea');
            inputs.forEach((input, index) => {
                setTimeout(() => {
                    input.removeAttribute('readonly');
                    input.removeAttribute('disabled');
                    input.style.transform = 'scale(1.02)';
                    setTimeout(() => {
                        input.style.transform = 'scale(1)';
                    }, 200);
                }, index * 50);
            });

            // Show action buttons, hide edit button
            editBtn.style.display = 'none';
            actionButtons.style.display = 'flex';
            actionButtons.style.animation = 'fadeIn 0.3s ease-out';
            
            isEditing = true;
            showAlert('Modo de edición activado. Modifica los campos que desees.', 'info');
        }

        function exitEditMode() {
            // Restore original data
            Object.keys(originalData).forEach(key => {
                const field = profileForm.querySelector(`[name="${key}"]`);
                if (field) field.value = originalData[key];
            });

            // Disable form fields
            const inputs = profileForm.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                if (input.type !== 'email') {
                    input.setAttribute('readonly', 'readonly');
                } else {
                    input.setAttribute('readonly', 'readonly');
                }
                if (input.tagName === 'SELECT') {
                    input.setAttribute('disabled', 'disabled');
                }
            });

            // Hide action buttons, show edit button
            editBtn.style.display = 'block';
            actionButtons.style.display = 'none';
            
            isEditing = false;
            clearAlert();
        }

        function saveProfile() {
            // Validate form
            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            const email = document.getElementById('email').value.trim();
            
            if (!firstName || !lastName || !email) {
                showAlert('Por favor completa todos los campos obligatorios.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showAlert('Por favor ingresa un email válido.', 'error');
                return;
            }

            // Show loading state
            saveBtn.innerHTML = '<span class="loading"></span> Guardando...';
            saveBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                // Update display elements
                const firstName = document.getElementById('firstName').value;
                const lastName = document.getElementById('lastName').value;
                const role = document.getElementById('role').selectedOptions[0].text;
                
                displayName.textContent = `${firstName} ${lastName}`;
                displayRole.textContent = role;
                
                // Update avatar initials
                const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
                if (!currentAvatar) {
                    profileAvatar.textContent = initials;
                    navAvatar.textContent = initials;
                }

                // Disable form fields
                const inputs = profileForm.querySelectorAll('input, select, textarea');
                inputs.forEach(input => {
                    input.setAttribute('readonly', 'readonly');
                    if (input.tagName === 'SELECT') {
                        input.setAttribute('disabled', 'disabled');
                    }
                });

                // Reset buttons
                saveBtn.innerHTML = 'Guardar Cambios';
                saveBtn.disabled = false;
                editBtn.style.display = 'block';
                actionButtons.style.display = 'none';
                
                isEditing = false;
                showAlert('Perfil actualizado exitosamente.', 'success');
            }, 1500);
        }

        // Avatar upload functionality
        function initializeAvatarUpload() {
            avatarUpload.addEventListener('click', () => {
                avatarInput.click();
            });

            avatarInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    if (file.size > 5 * 1024 * 1024) { // 5MB limit
                        showAlert('La imagen debe ser menor a 5MB.', 'error');
                        return;
                    }

                    if (!file.type.startsWith('image/')) {
                        showAlert('Por favor selecciona un archivo de imagen válido.', 'error');
                        return;
                    }

                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.style.width = '100%';
                        img.style.height = '100%';
                        img.style.objectFit = 'cover';
                        img.style.borderRadius = '50%';
                        
                        profileAvatar.innerHTML = '';
                        profileAvatar.appendChild(img);
                        profileAvatar.appendChild(avatarUpload);
                        
                        currentAvatar = e.target.result;
                        showAlert('Imagen de perfil actualizada.', 'success');
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        // Security features
        function initializeSecurityFeatures() {
            const changePasswordBtn = document.getElementById('changePasswordBtn');
            const twoFactorToggle = document.getElementById('twoFactorToggle');
            const manageSessions = document.getElementById('manageSessions');
            const viewHistory = document.getElementById('viewHistory');

            changePasswordBtn?.addEventListener('click', () => {
                showAlert('Funcionalidad de cambio de contraseña en desarrollo.', 'info');
            });

            twoFactorToggle?.addEventListener('change', (e) => {
                const isEnabled = e.target.checked;
                const message = isEnabled ? 
                    'Autenticación de dos factores activada.' : 
                    'Autenticación de dos factores desactivada.';
                showAlert(message, 'success');
            });

            manageSessions?.addEventListener('click', () => {
                showAlert('Abriendo gestor de sesiones...', 'info');
            });

            viewHistory?.addEventListener('click', () => {
                showAlert('Cargando historial de acceso...', 'info');
            });
        }

        // Preferences functionality
        function initializePreferences() {
            const savePreferences = document.getElementById('savePreferences');
            const resetPreferences = document.getElementById('resetPreferences');

            savePreferences?.addEventListener('click', () => {
                savePreferences.innerHTML = '<span class="loading"></span> Guardando...';
                savePreferences.disabled = true;

                setTimeout(() => {
                    savePreferences.innerHTML = 'Guardar Preferencias';
                    savePreferences.disabled = false;
                    showAlert('Preferencias guardadas exitosamente.', 'success');
                }, 1000);
            });

            resetPreferences?.addEventListener('click', () => {
                if (confirm('¿Estás seguro de restablecer todas las preferencias?')) {
                    // Reset to default values
                    document.getElementById('language').value = 'es';
                    document.getElementById('timezone').value = 'America/Bogota';
                    document.getElementById('theme').value = 'dark';
                    document.getElementById('dateFormat').value = 'DD/MM/YYYY';
                    
                    // Reset checkboxes
                    document.getElementById('emailNotifications').checked = true;
                    document.getElementById('projectUpdates').checked = true;
                    document.getElementById('newsletter').checked = false;
                    document.getElementById('browserNotifications').checked = true;
                    
                    showAlert('Preferencias restablecidas a valores por defecto.', 'info');
                }
            });
        }

        // Statistics functionality
        function initializeStatistics() {
            const refreshStats = document.getElementById('refreshStats');
            
            refreshStats?.addEventListener('click', () => {
                refreshStats.innerHTML = '🔄 Actualizando...';
                refreshStats.disabled = true;
                
                setTimeout(() => {
                    // Simulate updated stats
                    animateStatUpdate('completedProjects', 24, 26);
                    animateStatUpdate('activeProjects', 8, 9);
                    animateStatUpdate('completedTasks', 156, 163);
                    animateStatUpdate('efficiency', '95%', '97%');
                    
                    refreshStats.innerHTML = '🔄 Actualizar';
                    refreshStats.disabled = false;
                    showAlert('Estadísticas actualizadas.', 'success');
                }, 2000);
            });
        }

        // Utility functions
        function showAlert(message, type = 'info') {
            clearAlert();
            
            const alert = document.createElement('div');
            alert.className = `alert alert-${type}`;
            alert.textContent = message;
            
            alertContainer.appendChild(alert);
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.style.opacity = '0';
                    setTimeout(() => {
                        clearAlert();
                    }, 300);
                }
            }, 5000);
        }

        function clearAlert() {
            alertContainer.innerHTML = '';
        }

        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        function animateStatUpdate(elementId, fromValue, toValue) {
            const element = document.getElementById(elementId);
            if (!element) return;
            
            element.style.animation = 'pulse 0.5s ease-in-out';
            
            setTimeout(() => {
                element.textContent = toValue;
                element.style.animation = '';
            }, 250);
        }

        // Add smooth scrolling and enhanced interactions
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Add keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 's':
                        e.preventDefault();
                        if (isEditing) {
                            saveProfile();
                        }
                        break;
                    case 'Escape':
                        if (isEditing) {
                            exitEditMode();
                        }
                        break;
                }
            }
        });

        // Add form validation on input
        profileForm.addEventListener('input', function(e) {
            if (isEditing) {
                const input = e.target;
                validateField(input);
            }
        });

        function validateField(input) {
            const value = input.value.trim();
            
            // Remove previous validation classes
            input.classList.remove('valid', 'invalid');
            
            switch(input.type) {
                case 'email':
                    if (value && !isValidEmail(value)) {
                        input.classList.add('invalid');
                    } else if (value) {
                        input.classList.add('valid');
                    }
                    break;
                case 'tel':
                    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                    if (value && !phoneRegex.test(value.replace(/\s/g, ''))) {
                        input.classList.add('invalid');
                    } else if (value) {
                        input.classList.add('valid');
                    }
                    break;
                default:
                    if (input.hasAttribute('required') && !value) {
                        input.classList.add('invalid');
                    } else if (value) {
                        input.classList.add('valid');
                    }
            }
        }

        // Add enhanced hover effects
        document.querySelectorAll('.stat-card, .security-item').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });