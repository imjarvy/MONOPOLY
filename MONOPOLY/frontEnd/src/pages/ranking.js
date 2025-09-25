import { getRanking } from "../services/rankingService.js";

window.onload = cargarRanking;

function irAlInicio() {
    window.location.href = "../../../index.html";
}

async function cargarRanking() {
    document.getElementById("loadingContainer").style.display = "block";
    document.getElementById("errorContainer").style.display = "none";
    document.getElementById("rankingContainer").style.display = "none";
    document.getElementById("noData").style.display = "none";

    try {
        const ranking = await getRanking();

        document.getElementById("loadingContainer").style.display = "none";

        if (!ranking || ranking.length === 0) {
            document.getElementById("noData").style.display = "block";
            return;
        }

        // Estadísticas
        document.getElementById("totalPlayers").textContent = ranking.length;
        document.getElementById("totalGames").textContent = ranking.length; // Puedes cambiar esto si tienes partidas reales
        const uniqueCountries = new Set(ranking.map(j => j.country_code));
        document.getElementById("totalCountries").textContent = uniqueCountries.size;

        // Tabla
        const tbody = document.getElementById("rankingTableBody");
        tbody.innerHTML = "";
        ranking.forEach((jugador, idx) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${idx + 1}</td>
                <td><span class="country-flag">${jugador.country_code.toUpperCase()}</span></td>
                <td>${jugador.nick_name}</td>
                <td>${jugador.score}</td>
                <td>1</td>
                <td>${jugador.score}</td>
            `;
            tbody.appendChild(tr);
        });

        document.getElementById("rankingContainer").style.display = "block";
    } catch (e) {
        document.getElementById("loadingContainer").style.display = "none";
        document.getElementById("errorContainer").style.display = "block";
        document.getElementById("errorText").textContent = e.message || "No se pudo conectar con el servidor";
    }
}

window.irAlInicio = irAlInicio;
window.cargarRanking = cargarRanking;