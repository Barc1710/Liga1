$(document).ready(function() {
    // Variables principales
    let currentJornada = 1;
    let allFixtures = null;

    // Carga los partidos desde la API
    async function loadAllFixtures() {
        try {
            const fixtures = await getFixtures();
            if (fixtures && fixtures.length > 0) {
                allFixtures = fixtures;
                return fixtures;
            }
            throw new Error('No se pudieron cargar los partidos');
        } catch (error) {
            console.error('Error al cargar partidos:', error);
            return null;
        }
    }

    // Muestra los partidos de la jornada seleccionada
    async function updateJornadaPartidos(jornada) {
        try {
            const fixtures = await loadAllFixtures();
            if (!fixtures) {
                throw new Error('No hay datos de partidos disponibles');
            }

            // Filtra los partidos por jornada
            const jornadaPartidos = fixtures.filter(match => {
                const matchRound = match.league.round;
                return matchRound.includes(`Jornada ${jornada}`);
            });

            const $fixtureContainer = $('.jornada-content');
            if (!$fixtureContainer.length) return;

            const $matchesContainer = $('<div>').addClass('matches-container');

            // Muestra mensaje si no hay partidos
            if (jornadaPartidos.length === 0) {
                $matchesContainer.html(`
                    <div class="no-partidos">
                        <p>No hay partidos programados para esta jornada</p>
                    </div>
                `);
            } else {
                // Crea las tarjetas de partidos
                jornadaPartidos.forEach(match => {
                    const $matchCard = $('<div>').addClass('partido-card');
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
                    
                    $matchCard.html(`
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
                    `);
                    $matchesContainer.append($matchCard);
                });
            }

            // Actualiza el contenido de la página
            $fixtureContainer.find('.matches-container').remove();
            $fixtureContainer.append($matchesContainer);

        } catch (error) {
            console.error('Error al actualizar partidos:', error);
            $('.jornada-content').html(`
                <div class="error-message">
                    <p>Error al cargar los partidos. Por favor, intente nuevamente.</p>
                </div>
            `);
        }
    }

    // Inicia la página
    async function initialize() {
        try {
            await loadAllFixtures();
            updateJornadaPartidos(currentJornada);
        } catch (error) {
            console.error('Error en la inicialización:', error);
        }
    }

    // Maneja el cambio de jornada
    $('#jornada-select').on('change', function() {
        currentJornada = parseInt($(this).val());
        updateJornadaPartidos(currentJornada);
    });

    initialize();
});