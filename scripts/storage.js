// AeroCalc Storage Module

class FlightStorage {
    static STORAGE_KEY = 'aeroCalc_savedFlights';

    // Save flight to localStorage
    static saveFlight(flightData) {
        const flights = this.getSavedFlights();
        const newFlight = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            ...flightData
        };
        
        flights.unshift(newFlight); // Add to beginning
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(flights));
        return newFlight;
    }

    // Get all saved flights
    static getSavedFlights() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    }

    // Delete a saved flight
    static deleteFlight(flightId) {
        const flights = this.getSavedFlights();
        const filteredFlights = flights.filter(flight => flight.id !== flightId);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredFlights));
        return filteredFlights;
    }

    // Clear all saved flights
    static clearAllFlights() {
        localStorage.removeItem(this.STORAGE_KEY);
    }
}