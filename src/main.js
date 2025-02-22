let playersData = []; // Store the fetched player data
let currentSort = {
  column: "goals", // Default sort column
  order: "desc", // Default sort order
};

async function fetchTeams() {
  try {
    const response = await fetch("data/teams.json");
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    let teams = await response.json();

    // Sort teams by PTS in descending order
    teams.sort((a, b) => b.PTS - a.PTS);

    populateTeamsTable(teams);
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

function populateTeamsTable(teams) {
  const tableBody = document.getElementById("leagueTableBody");
  tableBody.innerHTML = "";

  teams.forEach((team, index) => {
    const row = `
              <tr class="border-b hover:bg-gray-100">
                  <td class="px-4 py-2 text-center">${index + 1}</td>
                  <td class="px-4 py-2 text-center text-lg font-bold">${team.name}</td>
                  <td class="px-4 py-2 text-center">${team.MP}</td>
                  <td class="px-4 py-2 text-center">${team.W}</td>
                  <td class="px-4 py-2 text-center">${team.D}</td>
                  <td class="px-4 py-2 text-center">${team.L}</td>
                  <td class="px-4 py-2 text-center">${team.GF}</td>
                  <td class="px-4 py-2 text-center">${team.GA}</td>
                  <td class="px-4 py-2 text-center">${team.GD}</td>
                  <td class="px-4 py-2 text-center font-bold">${
                    team.PTS
                  }</td>
              </tr>
          `;
    tableBody.innerHTML += row;
  });
}

document.addEventListener("DOMContentLoaded", fetchTeams);

let teamsData = [];

async function loadTeamsData() {
  try {
    const response = await fetch("data/team-members.json");
    teamsData = await response.json();
  } catch (error) {
    console.error("Error loading team data:", error);
  }
}

// Call the function when the page loads
loadTeamsData();

// Fetch data from JSON file
async function fetchPlayersData() {
  try {
    const response = await fetch("data/players.json"); // Fetch JSON data
    const data = await response.json();
    playersData = data.players; // Store the data for sorting

    playersData.sort((a, b) => b.goals - a.goals);

    renderPlayersTable(data.players);
    updateSortIcons();
  } catch (error) {
    console.error("Error fetching teams data:", error);
  }
}

function renderPlayersTable(players) {
  const tableBody = document.getElementById("playersTable");
  tableBody.innerHTML = ""; // Clear previous data

  players.forEach((player) => {
    const row = document.createElement("tr");
    row.classList.add("even:bg-gray-100");
    row.innerHTML = `
                  <td class="py-3 px-5 border-b font-bold text-lg">${player.name}</td>
                  <td class="py-3 px-5 border-b text-center">${player.team}</td>
                  <td class="py-3 px-5 text-center border-b">${player.number}</td>
                  <td class="py-3 px-5 text-center border-b">${player.goals}</td>
                  <td class="py-3 px-5 text-center border-b">${player.yellowCards}</td>
                  <td class="py-3 px-5 text-center border-b">${player.redCards}</td>
              `;
    tableBody.appendChild(row);
  });
}

function sortPlayers(criteria) {
  // Toggle sort order if the same column is clicked
  if (currentSort.column === criteria) {
    currentSort.order = currentSort.order === "asc" ? "desc" : "asc";
  } else {
    currentSort.column = criteria;
    currentSort.order = "asc"; // Reset to ascending for new column
  }

  const sortedPlayers = [...playersData].sort((a, b) => {
    if (currentSort.order === "asc") {
      return a[currentSort.column] - b[currentSort.column]; // Ascending order
    } else {
      return b[currentSort.column] - a[currentSort.column]; // Descending order
    }
  });

  renderPlayersTable(sortedPlayers); // Re-render the table with sorted data
  updateSortIcons(); // Update icons based on current sort
}

function updateSortIcons() {
  const headers = document.querySelectorAll("th");
  headers.forEach((header) => {
    const icon = header.querySelector("i");
    if (icon) {
      // Check if the icon exists
      if (header.textContent.trim() === currentSort.column) {
        icon.classList.remove("fa-sort");
        icon.classList.add(
          currentSort.order === "asc" ? "fa-sort-up" : "fa-sort-down"
        );
      } else {
        icon.classList.remove("fa-sort-up", "fa-sort-down");
        icon.classList.add("fa-sort");
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", fetchPlayersData);

function showTeamModal(teamName) {
  const team = teamsData.teams.find((t) => t.name === teamName);

  if (!team) return;

  document.getElementById("modal-title").textContent = team.name;

  const playersList = document.getElementById("team-players");
  playersList.innerHTML = "";

  team.players.forEach((player) => {
    const li = document.createElement("li");
    li.className =
      "bg-gray-100 px-4 py-2 rounded-md shadow flex justify-between";
    li.innerHTML = `<span>${player.name}</span> <span class="font-bold text-gray-700">#${player.number}</span>`;
    playersList.appendChild(li);
  });

  document.getElementById("team-modal").classList.add("flex");
  document.getElementById("team-modal").classList.remove("hidden");
}

function closeTeamModal() {
  document.getElementById("team-modal").classList.add("hidden");
  document.getElementById("team-modal").classList.remove("flex");
}

// Attach variables to window for global access
window.playersData = playersData;
window.currentSort = currentSort;
window.teamsData = teamsData;

// Attach functions to window
window.fetchTeams = fetchTeams;
window.populateTeamsTable = populateTeamsTable;
window.loadTeamsData = loadTeamsData;
window.fetchPlayersData = fetchPlayersData;
window.renderPlayersTable = renderPlayersTable;
window.sortPlayers = sortPlayers;
window.updateSortIcons = updateSortIcons;
window.showTeamModal = showTeamModal;
window.closeTeamModal = closeTeamModal;
