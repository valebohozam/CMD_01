        // Mobile menu toggle
        document.getElementById('mobileMenuToggle').addEventListener('click', function() {
            const sidebar = document.getElementById('sidebar');
            sidebar.classList.toggle('active');
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', function(e) {
            const sidebar = document.getElementById('sidebar');
            const mobileToggle = document.getElementById('mobileMenuToggle');
            
            if (window.innerWidth <= 768 && !sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        });

        // Navigation functionality
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                if (this.getAttribute('onclick')) return; // Skip logout button
                
                // Remove active class from all links
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                
                // Add active class to clicked link
                this.classList.add('active');
                
                // Update page title
                const section = this.dataset.section;
                if (section) {
                    updatePageTitle(section);
                }
                
                // Close mobile menu
                if (window.innerWidth <= 768) {
                    document.getElementById('sidebar').classList.remove('active');
                }
            });
        });

        function updatePageTitle(section) {
            const titles = {
                'dashboard': 'Dashboard',
                'proyectos': 'Gestión de Proyectos',
                'usuarios': 'Gestión de Usuarios',
                'calendario': 'Calendario de Proyectos',
                'finanzas': 'Gestión Financiera',
                'reportes': 'Reportes y Analytics',
                'configuracion': 'Configuración del Sistema'
            };
            
            document.querySelector('.page-title').textContent = titles[section] || 'Dashboard';
        }

        // Counter animation for stats
        function animateCounter(element) {
            const target = parseInt(element.dataset.target);
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    element.textContent = target;
                    clearInterval(timer);
                } else {
                    element.textContent = Math.floor(current);
                }
            }, 16);
        }

        // Progress bar animation
        function animateProgressBars() {
            document.querySelectorAll('[data-width]').forEach(bar => {
                const width = bar.dataset.width;
                setTimeout(() => {
                    bar.style.width = width + '%';
                }, 500);
            });
        }

        // Modal functions
        function openModal(modalId) {
            document.getElementById(modalId).style.display = 'block';
        }

        function closeModal(modalId) {
            document.getElementById(modalId).style.display = 'none';
        }

        // CRUD Functions
        function editProject(id) {
            alert(`Editando proyecto ID: ${id}`);
            // Here you would typically open an edit modal with the project data
        }

        function deleteProject(id) {
            if (confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
                alert(`Proyecto ID: ${id} eliminado`);
                // Here you would typically make an API call to delete the project
            }
        }

        function editUser(id) {
            alert(`Editando usuario ID: ${id}`);
            // Here you would typically open an edit modal with the user data
        }

        function deleteUser(id) {
            if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
                alert(`Usuario ID: ${id} eliminado`);
                // Here you would typically make an API call to delete the user
            }
        }

        function logout() {
            if (confirm('¿Estás seguro de que quieres salir del sistema?')) {
                alert('Cerrando sesión...');
                // Here you would typically redirect to login page
                // window.location.href = '/login';
            }
        }

        function showSection(section) {
            // Remove active from all nav links
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            
            // Add active to the corresponding nav link
            const navLink = document.querySelector(`[data-section="${section}"]`);
            if (navLink) {
                navLink.classList.add('active');
                updatePageTitle(section);
            }
        }

        // Form submissions
        document.getElementById('projectForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<div class="loading"></div> Creando...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                alert('Proyecto creado exitosamente');
                closeModal('projectModal');
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });

        document.getElementById('userForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<div class="loading"></div> Creando...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                alert('Usuario creado exitosamente');
                closeModal('userModal');
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });

        // Initialize animations on page load
        window.addEventListener('load', function() {
            // Animate stat counters
            document.querySelectorAll('.stat-value[data-target]').forEach(animateCounter);
            
            // Animate progress bars
            animateProgressBars();
            
            // Add fade-in effect to elements
            document.querySelectorAll('.fade-in, .slide-in').forEach(element => {
                element.style.opacity = '0';
                element.style.transform = element.classList.contains('fade-in') ? 'translateY(20px)' : 'translateX(-20px)';
                
                setTimeout(() => {
                    element.style.transition = 'all 0.6s ease-out';
                    element.style.opacity = '1';
                    element.style.transform = 'translate(0)';
                }, 100);
            });
        });

        // Real-time updates simulation
        function updateRealTimeData() {
            // Simulate real-time data updates
            const stats = document.querySelectorAll('.stat-value');
            stats.forEach(stat => {
                if (Math.random() > 0.95) { // 5% chance of update
                    const current = parseInt(stat.textContent);
                    const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
                    if (current + change > 0) {
                        stat.textContent = current + change;
                    }
                }
            });
        }

        // Update real-time data every 30 seconds
        setInterval(updateRealTimeData, 30000);

        // Close modals when clicking outside
        window.addEventListener('click', function(e) {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });

        // Responsive table handling
        function handleResponsiveTables() {
            const tables = document.querySelectorAll('.table-card');
            tables.forEach(table => {
                if (table.scrollWidth > table.clientWidth) {
                    table.style.overflowX = 'auto';
                }
            });
        }

        window.addEventListener('resize', handleResponsiveTables);
        window.addEventListener('load', handleResponsiveTables);

        // Keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            // Ctrl/Cmd + N for new project
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                openModal('projectModal');
            }
            
            // Escape to close modals
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal').forEach(modal => {
                    modal.style.display = 'none';
                });
            }
        });

        // Auto-save functionality simulation
        let autoSaveTimer;
        function scheduleAutoSave() {
            clearTimeout(autoSaveTimer);
            autoSaveTimer = setTimeout(() => {
                console.log('Auto-saving dashboard state...');
                // Here you would save the current state to localStorage or API
            }, 2000);
        }

        // Trigger auto-save on any form input
        document.addEventListener('input', scheduleAutoSave);

        console.log('ProBuild Dashboard loaded successfully! 🏗️');