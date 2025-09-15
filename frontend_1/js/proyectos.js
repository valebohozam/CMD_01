        // Sample project data
        const projects = [
            {
                id: 1,
                title: "Torre Central",
                location: "Bogotá, Colombia",
                type: "commercial",
                status: "active",
                progress: 75,
                budget: "$2.5M",
                duration: "18 meses",
                team: ["JM", "AS", "CR", "ML"],
                description: "Moderno edificio de oficinas de 25 pisos"
            },
            {
                id: 2,
                title: "Residencial Los Pinos",
                location: "Medellín, Colombia",
                type: "residential",
                status: "active",
                progress: 45,
                budget: "$1.8M",
                duration: "14 meses",
                team: ["PR", "LG", "MR"],
                description: "Conjunto residencial de 120 apartamentos"
            },
            {
                id: 3,
                title: "Complejo Comercial Norte",
                location: "Cali, Colombia",
                type: "commercial",
                status: "completed",
                progress: 100,
                budget: "$3.2M",
                duration: "20 meses",
                team: ["AN", "JR", "CS", "MV", "LH"],
                description: "Centro comercial con 150 locales"
            },
            {
                id: 4,
                title: "Urbanización Verde",
                location: "Cartagena, Colombia",
                type: "residential",
                status: "planning",
                progress: 15,
                budget: "$4.1M",
                duration: "24 meses",
                team: ["DR", "AM"],
                description: "Desarrollo urbano sostenible de 200 viviendas"
            },
            {
                id: 5,
                title: "Planta Industrial Pacífico",
                location: "Buenaventura, Colombia",
                type: "industrial",
                status: "active",
                progress: 60,
                budget: "$5.5M",
                duration: "30 meses",
                team: ["IG", "RC", "NP", "BM"],
                description: "Complejo industrial de procesamiento"
            },
            {
                id: 6,
                title: "Hotel Boutique Centro",
                location: "Bogotá, Colombia",
                type: "commercial",
                status: "completed",
                progress: 100,
                budget: "$1.9M",
                duration: "16 meses",
                team: ["SM", "DP", "FG"],
                description: "Hotel boutique de 40 habitaciones"
            }
        ];

        function getStatusClass(status) {
            return `status-${status}`;
        }

        function getStatusText(status) {
            const statusTexts = {
                'active': 'En Progreso',
                'planning': 'Planificación',
                'completed': 'Completado'
            };
            return statusTexts[status];
        }

        function createProjectCard(project) {
            return `
                <div class="project-card fade-in" data-type="${project.type}" data-status="${project.status}">
                    <div class="project-image">
                        <div class="project-status ${getStatusClass(project.status)}">
                            ${getStatusText(project.status)}
                        </div>
                    </div>
                    <div class="project-content">
                        <h3 class="project-title">${project.title}</h3>
                        <div class="project-location">
                            📍 ${project.location}
                        </div>
                        <div class="project-meta">
                            <div class="meta-item">
                                <div class="meta-value">${project.budget}</div>
                                <div class="meta-label">Presupuesto</div>
                            </div>
                            <div class="meta-item">
                                <div class="meta-value">${project.duration}</div>
                                <div class="meta-label">Duración</div>
                            </div>
                        </div>
                        <div class="progress-section">
                            <div class="progress-header">
                                <span class="progress-label">Progreso</span>
                                <span class="progress-percentage">${project.progress}%</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${project.progress}%"></div>
                            </div>
                        </div>
                        <div class="project-team">
                            <div class="team-avatars">
                                ${project.team.slice(0, 4).map(member => `<div class="avatar">${member}</div>`).join('')}
                                ${project.team.length > 4 ? `<div class="avatar">+${project.team.length - 4}</div>` : ''}
                            </div>
                            <span class="team-count">${project.team.length} miembros</span>
                        </div>
                    </div>
                </div>
            `;
        }

        function renderProjects(projectsToRender = projects) {
            const grid = document.getElementById('projectsGrid');
            const emptyState = document.getElementById('emptyState');
            
            if (projectsToRender.length === 0) {
                grid.innerHTML = '';
                emptyState.style.display = 'block';
            } else {
                grid.innerHTML = projectsToRender.map(createProjectCard).join('');
                emptyState.style.display = 'none';
                
                // Re-observe new elements for animations
                document.querySelectorAll('.fade-in').forEach(el => {
                    observer.observe(el);
                });
            }
        }

        function filterProjects() {
            const statusFilter = document.getElementById('statusFilter').value;
            const typeFilter = document.getElementById('typeFilter').value;
            const searchQuery = document.getElementById('searchBox').value.toLowerCase();

            const filteredProjects = projects.filter(project => {
                const matchesStatus = !statusFilter || project.status === statusFilter;
                const matchesType = !typeFilter || project.type === typeFilter;
                const matchesSearch = !searchQuery || 
                    project.title.toLowerCase().includes(searchQuery) ||
                    project.location.toLowerCase().includes(searchQuery);

                return matchesStatus && matchesType && matchesSearch;
            });

            renderProjects(filteredProjects);
        }

        function clearFilters() {
            document.getElementById('statusFilter').value = '';
            document.getElementById('typeFilter').value = '';
            document.getElementById('searchBox').value = '';
            renderProjects();
        }

        // Event listeners
        document.getElementById('statusFilter').addEventListener('change', filterProjects);
        document.getElementById('typeFilter').addEventListener('change', filterProjects);
        document.getElementById('searchBox').addEventListener('input', filterProjects);

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

        // Navbar background on scroll
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(26, 26, 46, 0.98)';
            } else {
                navbar.style.background = 'rgba(26, 26, 46, 0.95)';
            }
        });

        // Initialize
        renderProjects();