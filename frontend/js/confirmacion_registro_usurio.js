        // Get user data from URL parameters or localStorage
        function getUserData() {
            const urlParams = new URLSearchParams(window.location.search);
            return {
                name: urlParams.get('name') || 'Usuario',
                email: urlParams.get('email') || 'usuario@ejemplo.com',
                role: urlParams.get('role') || 'Usuario',
                date: new Date().toLocaleDateString('es-ES', { 
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric' 
                })
            };
        }

        // Update user information in the card
        function updateUserInfo() {
            const userData = getUserData();
            document.getElementById('userName').textContent = userData.name;
            document.getElementById('userEmail').textContent = userData.email;
            document.getElementById('userRole').textContent = userData.role;
            document.getElementById('registrationDate').textContent = userData.date;
        }

        // Countdown timer
        function startCountdown() {
            let timeLeft = 10;
            const countdownElement = document.getElementById('countdown');
            
            const timer = setInterval(() => {
                timeLeft--;
                countdownElement.textContent = timeLeft;
                
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    // Uncomment to enable auto-redirect
                    // window.location.href = 'login.html';
                }
            }, 1000);
        }

        // Confetti animation
        function createConfetti() {
            const colors = ['#ff6b35', '#27ae60', '#3498db', '#f39c12', '#e74c3c'];
            const confettiCount = 50;
            
            for (let i = 0; i < confettiCount; i++) {
                setTimeout(() => {
                    const confetti = document.createElement('div');
                    confetti.style.position = 'fixed';
                    confetti.style.left = Math.random() * 100 + 'vw';
                    confetti.style.top = '-10px';
                    confetti.style.width = '10px';
                    confetti.style.height = '10px';
                    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                    confetti.style.pointerEvents = 'none';
                    confetti.style.borderRadius = '50%';
                    confetti.style.zIndex = '9999';
                    confetti.style.animation = `confettiFall ${2 + Math.random() * 3}s linear forwards`;
                    
                    document.body.appendChild(confetti);
                    
                    setTimeout(() => {
                        confetti.remove();
                    }, 5000);
                }, i * 50);
            }
        }

        // Add confetti animation CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes confettiFall {
                0% {
                    transform: translateY(-10px) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translateY(100vh) rotate(720deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

        // Initialize page
        document.addEventListener('DOMContentLoaded', function() {
            updateUserInfo();
            startCountdown();
            
            // Trigger confetti after animation completes
            setTimeout(createConfetti, 800);
            
            // Add click handlers for buttons
            document.querySelector('.btn-primary').addEventListener('click', function(e) {
                e.preventDefault();
                // Add loading state
                this.textContent = 'Redirigiendo...';
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1000);
            });
        });