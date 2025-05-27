const API_KEY = '42d45bd3e5msh86f4b289f2ab7c6p12c298jsn420ecc8a778d';
const API_HOST = 'api-football-v1.p.rapidapi.com';
const LEAGUE_ID = 140; // ID de la Liga 1 peruana
const SEASON = 2024; // Cambiado a 2024 ya que 2025 aún no está disponible

// Función para obtener la tabla de posiciones
async function getStandings() {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': API_HOST
        }
    };

    try {
        const response = await fetch(`https://${API_HOST}/v3/standings?league=${LEAGUE_ID}&season=${SEASON}`, options);
        const data = await response.json();
        console.log('Datos de la tabla:', data); // Para verificar los datos
        return data.response[0].league.standings[0];
    } catch (error) {
        console.error('Error al obtener la tabla:', error);
        return null;
    }
}

// Función para obtener los partidos
async function getFixtures() {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': API_HOST
        }
    };

    try {
        const response = await fetch(`https://${API_HOST}/v3/fixtures?league=${LEAGUE_ID}&season=${SEASON}`, options);
        const data = await response.json();
        console.log('Datos de partidos recibidos:', data);
        return data.response;
    } catch (error) {
        console.error('Error al obtener los partidos:', error);
        return null;
    }
}

// Función para obtener estadísticas de goles
async function getTopScorers() {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': API_HOST
        }
    };

    try {
        const response = await fetch(`https://${API_HOST}/v3/players/topscorers?league=${LEAGUE_ID}&season=${SEASON}`, options);
        const data = await response.json();
        console.log('Datos de goleadores:', data); // Para verificar los datos
        return data.response;
    } catch (error) {
        console.error('Error al obtener goleadores:', error);
        return null;
    }
}

// Función para obtener estadísticas de asistencias
async function getTopAssists() {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': API_HOST
        }
    };

    try {
        const response = await fetch(`https://${API_HOST}/v3/players/topassists?league=${LEAGUE_ID}&season=${SEASON}`, options);
        const data = await response.json();
        console.log('Datos de asistencias:', data); // Para verificar los datos
        return data.response;
    } catch (error) {
        console.error('Error al obtener asistencias:', error);
        return null;
    }
}

// Función para formatear el nombre del equipo para la ruta de la imagen
function formatTeamName(teamName) {
    const nameMap = {
        'Real Madrid': 'realmadrid',
        'Barcelona': 'barcelona',
        'Atlético de Madrid': 'atleticomadrid',
        'Sevilla': 'sevilla',
        'Real Sociedad': 'realsociedad',
        'Real Betis': 'realbetis',
        'Villarreal': 'villarreal',
        'Athletic Club': 'athleticclub',
        'Valencia': 'valencia',
        'Celta de Vigo': 'celtavigo',
        'Osasuna': 'osasuna',
        'Getafe': 'getafe',
        'Rayo Vallecano': 'rayovallecano',
        'Granada': 'granada',
        'Mallorca': 'mallorca',
        'Alavés': 'alaves',
        'Las Palmas': 'laspalmas',
        'Leganes': 'leganes',
        'Valladolid': 'valladolid',
        'Girona': 'girona',
    };
    return nameMap[teamName] || teamName.toLowerCase().replace(/\s+/g, '');
}

// Función para actualizar la tabla en el HTML
async function updateStandings() {
    const standings = await getStandings();
    if (!standings) return;

    const tableBody = document.querySelector('.standings-table tbody');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    standings.forEach((team, index) => {
        const row = document.createElement('tr');
        const teamName = formatTeamName(team.team.name);
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><div class="equipo-container"><img src="../img/escudos/${teamName}.png" alt="${team.team.name}" class="equipo-logo">${team.team.name}</div></td>
            <td>${team.all.played}</td>
            <td>${team.all.win}</td>
            <td>${team.all.draw}</td>
            <td>${team.all.lose}</td>
            <td>${team.all.goals.for}</td>
            <td>${team.all.goals.against}</td>
            <td>${team.goalsDiff}</td>
            <td>${team.points}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Función para actualizar el selector de jornadas
function updateJornadaSelector(fixtures) {
    const jornadaSelect = document.getElementById('jornada-select');
    if (!jornadaSelect) {
        console.error('No se encontró el selector de jornadas');
        return;
    }

    console.log('Actualizando selector de jornadas con fixtures:', fixtures);

    // Limpiar el selector
    jornadaSelect.innerHTML = '';

    // Obtener jornadas únicas de los fixtures
    const jornadas = [...new Set(fixtures.map(match => match.league.round))].sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)[0]);
        const numB = parseInt(b.match(/\d+/)[0]);
        return numA - numB;
    });

    console.log('Jornadas encontradas:', jornadas);

    // Crear opciones para cada jornada
    jornadas.forEach(jornada => {
        const option = document.createElement('option');
        option.value = jornada;
        option.textContent = `Jornada ${jornada.match(/\d+/)[0]}`;
        jornadaSelect.appendChild(option);
    });

    // Seleccionar la última jornada por defecto
    if (jornadas.length > 0) {
        const ultimaJornada = jornadas[jornadas.length - 1];
        jornadaSelect.value = ultimaJornada;
        console.log('Seleccionando última jornada:', ultimaJornada);
        updateRoundMatches(ultimaJornada, fixtures);
    }
}

// Función para actualizar los partidos de una jornada
function updateRoundMatches(selectedRound, fixtures) {
    const matchesContainer = document.querySelector('.matches-container');
    if (!matchesContainer) {
        console.error('No se encontró el contenedor de partidos');
        return;
    }

    console.log('Actualizando partidos para jornada:', selectedRound);

    // Filtrar partidos por jornada
    const roundMatches = fixtures.filter(match => match.league.round === selectedRound);
    console.log('Partidos encontrados para la jornada:', roundMatches);

    if (roundMatches.length === 0) {
        matchesContainer.innerHTML = '<div class="no-jornada">No hay partidos programados para esta jornada</div>';
        return;
    }

    // Ordenar partidos por fecha
    roundMatches.sort((a, b) => new Date(a.fixture.date) - new Date(b.fixture.date));

    // Crear el HTML para cada partido
    matchesContainer.innerHTML = roundMatches.map(match => {
        const matchDate = new Date(match.fixture.date);
        const formattedDate = matchDate.toLocaleDateString('es-ES', {
            weekday: 'short',
            day: 'numeric',
            month: 'numeric'
        });
        const formattedTime = matchDate.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });

        const homeTeamName = formatTeamName(match.teams.home.name);
        const awayTeamName = formatTeamName(match.teams.away.name);

        // Obtener el resultado del partido
        const homeScore = match.goals.home !== null ? match.goals.home : '-';
        const awayScore = match.goals.away !== null ? match.goals.away : '-';
        const resultado = `${homeScore} - ${awayScore}`;

        // Determinar el estado del partido
        let estado = match.fixture.status.short;
        if (estado === 'FT') estado = 'Finalizado';
        else if (estado === 'NS') estado = formattedTime;
        else if (estado === 'PST') estado = 'Aplazado';
        else if (estado === 'CANC') estado = 'Cancelado';
        else if (estado === 'HT') estado = 'Descanso';
        else if (estado === '2H') estado = '2do Tiempo';
        else if (estado === '1H') estado = '1er Tiempo';

        return `
            <div class="partido-card">
                <div class="equipo-container">
                    <img src="../img/escudos/${homeTeamName}.png" 
                        alt="${match.teams.home.name}" 
                        class="equipo-logo">
                    <span class="equipo-nombre">${match.teams.home.name}</span>
                </div>
                <div class="resultado-container">
                    <span class="hora">${formattedDate}</span>
                    <span class="resultado">${resultado}</span>
                    <span class="estado">${estado}</span>
                </div>
                <div class="equipo-container visitante">
                    <span class="equipo-nombre">${match.teams.away.name}</span>
                    <img src="../img/escudos/${awayTeamName}.png" 
                        alt="${match.teams.away.name}" 
                        class="equipo-logo">
                </div>
            </div>
        `;
    }).join('');
}

// Función para inicializar el fixture
async function initializeFixture() {
    console.log('Inicializando fixture...');
    const fixtures = await getFixtures();
    if (fixtures) {
        console.log('Fixtures obtenidos:', fixtures.length);
        updateJornadaSelector(fixtures);

        // Event listener para el cambio de jornada
        const jornadaSelect = document.getElementById('jornada-select');
        if (jornadaSelect) {
            jornadaSelect.addEventListener('change', (e) => {
                console.log('Jornada seleccionada:', e.target.value);
                updateRoundMatches(e.target.value, fixtures);
            });
        }
    } else {
        console.error('No se pudieron obtener los fixtures');
    }
}

// Función para actualizar las estadísticas en el HTML
async function updateStatistics() {
    const topScorers = await getTopScorers();
    const topAssists = await getTopAssists();

    // Actualizar goleadores
    const scorersContainer = document.querySelector('.goleadores-container');
    if (scorersContainer && topScorers) {
        scorersContainer.innerHTML = '';
        topScorers.slice(0, 10).forEach((player, index) => {
            const playerCard = document.createElement('div');
            playerCard.className = 'player-card';
            playerCard.innerHTML = `
                <div class="player-info">
                    <span class="position">${index + 1}</span>
                    <img src="${player.player.photo}" alt="${player.player.name}" class="player-photo">
                    <div class="player-details">
                        <span class="player-name">${player.player.name}</span>
                        <span class="team-name">${player.statistics[0].team.name}</span>
                    </div>
                </div>
                <div class="player-stats">
                    <span class="goals">${player.statistics[0].goals.total}</span>
                </div>
            `;
            scorersContainer.appendChild(playerCard);
        });
    }

    // Actualizar asistencias
    const assistsContainer = document.querySelector('.asistencias-container');
    if (assistsContainer && topAssists) {
        assistsContainer.innerHTML = '';
        topAssists.slice(0, 10).forEach((player, index) => {
            const playerCard = document.createElement('div');
            playerCard.className = 'player-card';
            playerCard.innerHTML = `
                <div class="player-info">
                    <span class="position">${index + 1}</span>
                    <img src="${player.player.photo}" alt="${player.player.name}" class="player-photo">
                    <div class="player-details">
                        <span class="player-name">${player.player.name}</span>
                        <span class="team-name">${player.statistics[0].team.name}</span>
                    </div>
                </div>
                <div class="player-stats">
                    <span class="assists">${player.statistics[0].goals.assists || 0}</span>
                </div>
            `;
            assistsContainer.appendChild(playerCard);
        });
    }
}

// Inicializar cuando el documento esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Actualizar la tabla si estamos en la página de tabla
    if (document.querySelector('.standings-table')) {
        updateStandings();
    }

    // Actualizar el fixture si estamos en la página de fixture
    if (document.querySelector('.jornada-content')) {
        initializeFixture();
    }

    // Actualizar estadísticas si estamos en la página de estadísticas
    if (document.querySelector('.goleadores-container') || document.querySelector('.asistencias-container')) {
        updateStatistics();
    }
});