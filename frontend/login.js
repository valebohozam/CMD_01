// Toggle password visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.password-toggle');
    
    if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    toggleBtn.textContent = '🙈';
    } else {
    passwordInput.type = 'password';
    toggleBtn.textContent = '👁️';
    }
}

// Form submission handler
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const loginBtn = document.getElementById('loginBtn');
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Add loading state
    loginBtn.classList.add('loading');
    loginBtn.textContent = 'Iniciando sesión...';
    
    // Simulate login process (replace with actual authentication)
    setTimeout(() => {
    console.log('Login attempt:', { email, password });
    
    // Simulate successful login
    loginBtn.textContent = '✅ ¡Sesión iniciada!';
    loginBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    
    // Redirect after success (replace with your actual redirect)
    setTimeout(() => {
        alert('Login exitoso! Redirigiendo...');
        // window.location.href = 'dashboard.html'; // Uncomment for actual redirect
    }, 1000);
    
    }, 2000);
});

// Add floating animation to form on load
window.addEventListener('load', function() {
    const container = document.querySelector('.login-container');
    container.style.opacity = '0';
    container.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
    container.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    container.style.opacity = '1';
    container.style.transform = 'translateY(0)';
    }, 100);
});

// Input focus effects
document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('focus', function() {
    this.parentElement.style.transform = 'translateY(-2px)';
    });
    
    input.addEventListener('blur', function() {
    this.parentElement.style.transform = 'translateY(0)';
    });
});