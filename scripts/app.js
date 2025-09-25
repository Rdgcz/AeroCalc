// AeroCalc Main Application

class AeroCalcApp {
    constructor() {
        this.currentAircraft = null;
        this.savedFlights = [];
        this.init();
    }

    init() {
        this.loadAircraftData();
        this.setupEventListeners();
        this.loadSavedFlights();
    }

    // Load aircraft data from JSON
    async loadAircraftData() {
        try {
            const response = await fetch('data/aircraft.json');
            this.aircraftData = await response.json();
            this.renderAircraftSelection();
        } catch (error) {
            console.error('Error loading aircraft data:', error);
        }
    }

    // Render aircraft selection cards
    renderAircraftSelection() {
        const grid = document.getElementById('aircraftGrid');
        grid.innerHTML = '';

        this.aircraftData.aircrafts.forEach(aircraft => {
            const card = document.createElement('div');
            card.className = 'aircraft-card';
            card.innerHTML = `
                <h3>${aircraft.image} ${aircraft.name}</h3>
                <p><strong>Speed:</strong> ${aircraft.cruiseSpeed} KTS</p>
                <p><strong>Consumption:</strong> ${aircraft.fuelConsumption} L/H</p>
                <p><strong>Capacity:</strong> ${aircraft.fuelCapacity} L</p>
            `;

            card.addEventListener('click', () => this.selectAircraft(aircraft));
            grid.appendChild(card);
        });
    }

    // Select aircraft and auto-fill form
    selectAircraft(aircraft) {
        this.currentAircraft = aircraft;
        
        // Update UI
        document.querySelectorAll('.aircraft-card').forEach(card => {
            card.classList.remove('selected');
        });
        event.currentTarget.classList.add('selected');

        // Auto-fill form
        document.getElementById('cruiseSpeed').value = aircraft.cruiseSpeed;
        document.getElementById('fuelConsumption').value = aircraft.fuelConsumption;
    }

    // Setup event listeners
    setupEventListeners() {
        document.getElementById('flightForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.calculateFlight();
        });

        document.getElementById('saveFlight').addEventListener('click', () => {
            this.saveCurrentFlight();
        });
    }

    // Main calculation function
    calculateFlight() {
        const distance = parseFloat(document.getElementById('distance').value);
        const speed = parseFloat(document.getElementById('cruiseSpeed').value);
        const consumption = parseFloat(document.getElementById('fuelConsumption').value);
        const capacity = this.currentAircraft ? this.currentAircraft.fuelCapacity : 0;

        if (!distance || !speed || !consumption) {
            alert('Please fill in all fields');
            return;
        }

        const results = FlightCalculator.calculateFlightPlan(distance, speed, consumption, capacity);
        this.displayResults(results);
    }

    // Display results
    displayResults(results) {
        document.getElementById('flightTime').textContent = results.formattedTime;
        document.getElementById('fuelRequired').textContent = results.formattedFuel;
        document.getElementById('autonomy').textContent = results.formattedAutonomy;
        
        document.getElementById('resultsSection').style.display = 'block';
        this.currentResults = results;
    }

    // Save flight to storage
    saveCurrentFlight() {
        if (!this.currentResults) {
            alert('No flight results to save');
            return;
        }

        const flightData = {
            aircraft: this.currentAircraft ? this.currentAircraft.name : 'Custom',
            distance: parseFloat(document.getElementById('distance').value),
            ...this.currentResults
        };

        FlightStorage.saveFlight(flightData);
        this.loadSavedFlights();
        alert('Flight saved successfully! ✈️');
    }

    // Load and display saved flights
    loadSavedFlights() {
        this.savedFlights = FlightStorage.getSavedFlights();
        const container = document.getElementById('savedFlightsList');
        
        if (this.savedFlights.length === 0) {
            container.innerHTML = '<p>No saved flights yet.</p>';
            return;
        }

        container.innerHTML = this.savedFlights.map(flight => `
            <div class="saved-flight-item">
                <h4>${flight.aircraft} - ${flight.distance} NM</h4>
                <p>Time: ${flight.formattedTime} | Fuel: ${flight.formattedFuel}</p>
                <small>Saved: ${new Date(flight.timestamp).toLocaleDateString()}</small>
                <button onclick="app.deleteFlight('${flight.id}')" class="btn-delete">Delete</button>
            </div>
        `).join('');
    }

    // Delete a saved flight
    deleteFlight(flightId) {
        if (confirm('Delete this flight?')) {
            FlightStorage.deleteFlight(flightId);
            this.loadSavedFlights();
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new AeroCalcApp();
});