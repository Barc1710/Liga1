const API_KEY = 'TU_API_KEY'; // Reemplaza esto con tu API key
const API_HOST = 'api-football-v1.p.rapidapi.com';
const LEAGUE_ID = 128; // ID de la Liga 1 peruana
const SEASON = 2024;

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
        return data.response[0].league.standings[0];
    } catch (error) {
        console.error('Error al obtener la tabla:', error);
        return null;
    }
}

// Función para obtener el fixture
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
        return data.response;
    } catch (error) {
        console.error('Error al obtener el fixture:', error);
        return null;
    }
}

// Función para actualizar la tabla en el HTML
async function updateStandings() {
    const standings = await getStandings();
    if (!standings) return;

    const tableBody = document.querySelector('.tabla-posiciones tbody');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    standings.forEach((team, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><img src="../img/escudos/${team.team.name.toLowerCase().replace(/\s+/g, '')}.png" alt="${team.team.name}"></td>
            <td>${team.team.name}</td>
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

// Función para actualizar el fixture en el HTML
async function updateFixtures() {
    const fixtures = await getFixtures();
    if (!fixtures) return;

    const fixtureContainer = document.querySelector('.jornada-content');
    if (!fixtureContainer) return;

    // Agrupar partidos por jornada
    const matchesByRound = {};
    fixtures.forEach(match => {
        const round = match.league.round;
        if (!matchesByRound[round]) {
            matchesByRound[round] = [];
        }
        matchesByRound[round].push(match);
    });

    // Actualizar los botones de jornada
    const jornadasNav = document.querySelector('.jornadas-swiper .swiper-wrapper');
    if (jornadasNav) {
        jornadasNav.innerHTML = '';
        Object.keys(matchesByRound).forEach((round, index) => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.innerHTML = `<button class="jornada-btn ${index === 0 ? 'active' : ''}">${round}</button>`;
            jornadasNav.appendChild(slide);
        });
    }

    // Mostrar los partidos de la primera jornada
    const firstRound = Object.keys(matchesByRound)[0];
    updateRoundMatches(matchesByRound[firstRound]);
}

// Función para actualizar los partidos de una jornada específica
function updateRoundMatches(matches) {
    const fixtureContainer = document.querySelector('.jornada-content');
    if (!fixtureContainer) return;

    const matchesContainer = document.createElement('div');
    matchesContainer.className = 'matches-container';

    matches.forEach(match => {
        const matchCard = document.createElement('div');
        matchCard.className = 'partido-card';
        matchCard.innerHTML = `
            <div class="equipo-container">
                <img src="../img/escudos/${match.teams.home.name.toLowerCase().replace(/\s+/g, '')}.png" alt="${match.teams.home.name}" class="equipo-logo">
                <span class="equipo-nombre">${match.teams.home.name}</span>
            </div>
            <div class="resultado-container">
                <span class="hora">${new Date(match.fixture.date).toLocaleDateString()}</span>
                <span class="estado">${match.fixture.status.short}</span>
            </div>
            <div class="equipo-container visitante">
                <span class="equipo-nombre">${match.teams.away.name}</span>
                <img src="../img/escudos/${match.teams.away.name.toLowerCase().replace(/\s+/g, '')}.png" alt="${match.teams.away.name}" class="equipo-logo">
            </div>
        `;
        matchesContainer.appendChild(matchCard);
    });

    // Reemplazar el contenido existente
    const existingContainer = fixtureContainer.querySelector('.matches-container');
    if (existingContainer) {
        existingContainer.remove();
    }
    fixtureContainer.appendChild(matchesContainer);
}

// Inicializar cuando el documento esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Actualizar la tabla si estamos en la página de tabla
    if (document.querySelector('.tabla-posiciones')) {
        updateStandings();
    }

    // Actualizar el fixture si estamos en la página de fixture
    if (document.querySelector('.jornada-content')) {
        updateFixtures();
    }
}); 