        // Generate random error code
        function generateErrorCode() {
            const codes = [
                'REG_FAILED_001', 'REG_EMAIL_EXISTS', 'REG_TIMEOUT_002', 
                'REG_INVALID_DATA', 'REG_SERVER_ERROR', 'REG_CONN_FAILED'
            ];
            return codes[Math.floor(Math.random() * codes.length)];
        }

        // Update error code
        function updateErrorCode() {
            const errorCodeElement = document.getElementById('errorCode');
            errorCodeElement.textContent = generateErrorCode();
        }

        // Add shake animation to retry button
        function addRetryShake() {
            const retryBtn = document.getElementById('retryBtn');
            
            setInterval(() => {
                retryBtn.style.animation = 'none';
                setTimeout(() => {
                    retryBtn.style.animation = 'retryShake 0.5s ease-in-out';
                }, 50);
            }, 5000);
        }

        // Add CSS for retry button shake
        const style = document.createElement('style');
        style.textContent = `
            @keyframes retryShake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
            
            .btn-primary:hover {
                animation: none !important;
            }
        `;
        document.head.appendChild(style);

        // Add loading states for buttons
        function addButtonLoadingStates() {
            const buttons = document.querySelectorAll('.btn-primary, .btn-contact');
            
            buttons.forEach(button => {
                button.addEventListener('click', function(e) {
                    if (this.classList.contains('btn-primary')) {
                        e.preventDefault();
                        this.textContent = 'Redirigiendo...';
                        setTimeout(() => {
                            window.location.href = this.href;
                        }, 1000);
                    } else if (this.classList.contains('btn-contact')) {
                        e.preventDefault();
                        this.textContent = 'Abriendo soporte...';
                        setTimeout(() => {
                            window.location.href = this.href;
                        }, 800);
                    }
                });
            });
        }

        // Error particles animation
        function createErrorParticles() {
            const colors = ['#e74c3c', '#c0392b', '#f39c12', '#d35400'];
            const particleCount = 30;
            
            for (let i = 0; i < particleCount; i++) {
                setTimeout(() => {
                    const particle = document.createElement('div');
                    particle.style.position = 'fixed';
                    particle.style.left = Math.random() * 100 + 'vw';
                    particle.style.top = '-10px';
                    particle.style.width = (Math.random() * 8 + 4) + 'px';
                    particle.style.height = (Math.random() * 8 + 4) + 'px';
                    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                    particle.style.pointerEvents = 'none';
                    particle.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
                    particle.style.zIndex = '9999';
                    particle.style.animation = `particleFall ${3 + Math.random() * 4}s linear forwards`;
                    
                    document.body.appendChild(particle);
                    
                    setTimeout(() => {
                        particle.remove();
                    }, 7000);
                }, i * 100);
            }
        }

        // Add particle animation CSS
        const particleStyle = document.createElement('style');
        particleStyle.textContent = `
            @keyframes particleFall {
                0% {
                    transform: translateY(-10px) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translateY(100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(particleStyle);

        // Get error details from URL parameters
        function getErrorDetails() {
            const urlParams = new URLSearchParams(window.location.search);
            return {
                code: urlParams.get('error') || generateErrorCode(),
                message: urlParams.get('message') || 'Error desconocido durante el registro'
            };
        }

        // Initialize page
        document.addEventListener('DOMContentLoaded', function() {
            updateErrorCode();
            addRetryShake();
            addButtonLoadingStates();
            
            // Get error details from URL if available
            const errorDetails = getErrorDetails();
            if (errorDetails.code !== generateErrorCode()) {
                document.getElementById('errorCode').textContent = errorDetails.code;
            }
            
            // Trigger error particles after animation completes
            setTimeout(createErrorParticles, 1200);
            
            // Optional: Log error for debugging
            console.error('Registration failed:', errorDetails);
        });