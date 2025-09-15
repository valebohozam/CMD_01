        // FAQ Toggle Function
        function toggleFAQ(element) {
            const faqItem = element.parentNode;
            const isActive = faqItem.classList.contains('active');
            
            // Close all FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                faqItem.classList.add('active');
            }
        }

        // Form Submission
        document.getElementById('contactForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show success message
            const successMessage = document.getElementById('successMessage');
            successMessage.classList.add('show');
            
            // Reset form
            this.reset();
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                successMessage.classList.remove('show');
            }, 5000);
        });

        // Scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });

        // Navbar background on scroll
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(26, 26, 46, 0.98)';
            } else {
                navbar.style.background = 'rgba(26, 26, 46, 0.95)';
            }
        });