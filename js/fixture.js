$(document).ready(function() {
    const jornadasSwiper = new Swiper('.jornadas-swiper', {
        slidesPerView: 'auto',
        spaceBetween: 10,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            320: {
                slidesPerView: 3,
            },
            480: {
                slidesPerView: 4,
            },
            768: {
                slidesPerView: 6,
            },
            1024: {
                slidesPerView: 8,
            }
        }
    });

    // Variables para el estado actual
    let currentTorneo = 'apertura';
    let currentJornada = 1;
    let allFixtures = null;

    // Función para cargar todos los partidos
    async function loadAllFixtures() {
        try {
            const fixtures = await getFixtures();
            if (fixtures && fixtures.length > 0) {
                allFixtures = fixtures;
                console.log('Partidos cargados:', fixtures.length);
                return fixtures;
            }
            throw new Error('No se pudieron cargar los partidos');
        } catch (error) {
            console.error('Error al cargar partidos:', error);
            return null;
        }
    }

    // Función para actualizar los botones de jornada
    function updateJornadaButtons(torneo) {
        const jornadasWrapper = document.querySelector('.jornadas-swiper .swiper-wrapper');
        jornadasWrapper.innerHTML = '';

        // Crear botones para cada jornada (19 jornadas por torneo)
        for (let i = 1; i <= 19; i++) {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.innerHTML = `<button class="jornada-btn ${i === currentJornada ? 'active' : ''}" data-jornada="${i}">Jornada ${i}</button>`;
            jornadasWrapper.appendChild(slide);
        }

        // Reiniciar Swiper
        jornadasSwiper.update();
    }

    // Función para actualizar los partidos de una jornada
    async function updateJornadaPartidos(torneo, jornada) {
        try {
            const fixtures = await loadAllFixtures();
            if (!fixtures) {
                throw new Error('No hay datos de partidos disponibles');
            }

            console.log(`Filtrando partidos para ${torneo}, jornada ${jornada}`);

            // Filtrar partidos por torneo y jornada
            const jornadaPartidos = fixtures.filter(match => {
                const matchDate = new Date(match.fixture.date);
                const isApertura = matchDate.getMonth() < 6; // Primera mitad del año
                const matchRound = match.league.round;
                console.log(`Partido: ${match.teams.home.name} vs ${match.teams.away.name}, Ronda: ${matchRound}`);
                
                return (torneo === 'apertura' ? isApertura : !isApertura) && 
                       matchRound.includes(`Jornada ${jornada}`);
            });

            console.log(`Partidos encontrados para jornada ${jornada}:`, jornadaPartidos.length);

            const fixtureContainer = document.querySelector('.jornada-content');
            if (!fixtureContainer) return;

            const matchesContainer = document.createElement('div');
            matchesContainer.className = 'matches-container';

            if (jornadaPartidos.length === 0) {
                matchesContainer.innerHTML = `
                    <div class="no-partidos">
                        <p>No hay partidos programados para esta jornada</p>
                    </div>
                `;
            } else {
                jornadaPartidos.forEach(match => {
                    const matchCard = document.createElement('div');
                    matchCard.className = 'partido-card';
                    const homeTeamName = formatTeamName(match.teams.home.name);
                    const awayTeamName = formatTeamName(match.teams.away.name);
                    
                    const matchDate = new Date(match.fixture.date);
                    const formattedDate = matchDate.toLocaleDateString('es-ES', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short'
                    });
                    const formattedTime = matchDate.toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                    
                    matchCard.innerHTML = `
                        <div class="equipo-container">
                            <img src="../img/escudos/${homeTeamName}.png" alt="${match.teams.home.name}" class="equipo-logo">
                            <span class="equipo-nombre">${match.teams.home.name}</span>
                        </div>
                        <div class="resultado-container">
                            <span class="hora">${formattedDate}</span>
                            <span class="estado">${formattedTime}</span>
                        </div>
                        <div class="equipo-container visitante">
                            <span class="equipo-nombre">${match.teams.away.name}</span>
                            <img src="../img/escudos/${awayTeamName}.png" alt="${match.teams.away.name}" class="equipo-logo">
                        </div>
                    `;
                    matchesContainer.appendChild(matchCard);
                });
            }

            // Reemplazar el contenido existente
            const existingContainer = fixtureContainer.querySelector('.matches-container');
            if (existingContainer) {
                existingContainer.remove();
            }
            fixtureContainer.appendChild(matchesContainer);

        } catch (error) {
            console.error('Error al actualizar partidos:', error);
            const fixtureContainer = document.querySelector('.jornada-content');
            if (fixtureContainer) {
                fixtureContainer.innerHTML = `
                    <div class="error-message">
                        <p>Error al cargar los partidos. Por favor, intente nuevamente.</p>
                    </div>
                `;
            }
        }
    }

    // Inicializar
    async function initialize() {
        try {
            await loadAllFixtures();
            updateJornadaButtons(currentTorneo);
            updateJornadaPartidos(currentTorneo, currentJornada);
        } catch (error) {
            console.error('Error en la inicialización:', error);
        }
    }

    // Event Listeners
    $('.torneo-btn').on('click', function() {
        currentTorneo = $(this).data('torneo');
        currentJornada = 1;
        
        $('.torneo-btn').removeClass('active');
        $(this).addClass('active');
        
        updateJornadaButtons(currentTorneo);
        updateJornadaPartidos(currentTorneo, currentJornada);
    });

    $('.jornadas-swiper').on('click', '.jornada-btn', function() {
        currentJornada = parseInt($(this).data('jornada'));
        
        $('.jornada-btn').removeClass('active');
        $(this).addClass('active');
        
        updateJornadaPartidos(currentTorneo, currentJornada);
    });

    // Iniciar la aplicación
    initialize();
});