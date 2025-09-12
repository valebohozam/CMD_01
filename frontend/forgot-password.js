let resendCount = 0;
let canResend = true;

// Form submission handler
document.getElementById('resetForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const resetBtn = document.getElementById('resetBtn');
    const email = document.getElementById('email').value;
    
    // Validate email
    if (!email || !isValidEmail(email)) {
    showError('Por favor ingresa un correo válido');
    return;
    }
    
    // Add loading state
    resetBtn.classList.add('loading');
    resetBtn.textContent = 'Enviando...';
    
    // Simulate sending reset email
    setTimeout(() => {
    console.log('Password reset requested for:', email);
    showSuccessState(email);
    }, 2000);
});

function showSuccessState(email) {
    const initialState = document.getElementById('initialState');
    const successState = document.getElementById('successState');
    const sentEmailSpan = document.getElementById('sentEmail');
    
    // Hide initial state and show success
    initialState.style.display = 'none';
    successState.classList.add('active');
    sentEmailSpan.textContent = email;
}

function resendEmail() {
    if (!canResend) return;
    
    resendCount++;
    const resendBtn = event.target;
    const email = document.getElementById('sentEmail').textContent;
    
    resendBtn.classList.add('loading');
    resendBtn.textContent = 'Reenviando...';
    
    // Disable resend temporarily
    canResend = false;
    
    setTimeout(() => {
    resendBtn.classList.remove('loading');
    resendBtn.textContent = '✅ ¡Correo reenviado!';
    resendBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    
    // Reset button after delay
    setTimeout(() => {
        resendBtn.textContent = 'Reenviar correo';
        resendBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        canResend = true;
    }, 3000);
    
    console.log('Password reset resent for:', email, 'Count:', resendCount);
    }, 1500);
}

function goToLogin() {
    // Replace with actual login page URL
    window.location.href = 'login.html';
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(message) {
    // Simple error display (you can enhance this)
    const emailInput = document.getElementById('email');
    emailInput.style.borderColor = '#ef4444';
    emailInput.placeholder = message;
    
    setTimeout(() => {
    emailInput.style.borderColor = '#e5e7eb';
    emailInput.placeholder = 'Ingresa tu correo electrónico';
    }, 3000);
}

// Add entrance animation
window.addEventListener('load', function() {
    const container = document.querySelector('.forgot-container');
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
    this.parentElement.parentElement.style.transform = 'translateY(-2px)';
    });
    
    input.addEventListener('blur', function() {
    this.parentElement.parentElement.style.transform = 'translateY(0)';
    });
});