// AeroCalc Calculations Module

class FlightCalculator {
    // Calculate Flight Time in minutes
    static calculateFlightTime(distanceNM, speedKTS) {
        if (speedKTS <= 0) return 0;
        return (distanceNM / speedKTS) * 60; // Convert to minutes
    }

    // Calculate Fuel Required in liters
    static calculateFuelRequired(flightTimeMinutes, fuelConsumptionLPH) {
        return (flightTimeMinutes / 60) * fuelConsumptionLPH;
    }

    // Calculate Autonomy in hours
    static calculateAutonomy(fuelCapacityL, fuelConsumptionLPH) {
        if (fuelConsumptionLPH <= 0) return 0;
        return fuelCapacityL / fuelConsumptionLPH;
    }

    // Format time as HH:MM
    static formatTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = Math.round(minutes % 60);
        return `${hours}h ${mins}m`;
    }

    // Format fuel with units
    static formatFuel(liters) {
        if (liters >= 1000) {
            return `${(liters / 1000).toFixed(1)}k L`;
        }
        return `${liters.toFixed(1)} L`;
    }

    // Main calculation function
    static calculateFlightPlan(distance, speed, consumption, capacity) {
        const flightTime = this.calculateFlightTime(distance, speed);
        const fuelRequired = this.calculateFuelRequired(flightTime, consumption);
        const autonomy = this.calculateAutonomy(capacity, consumption);

        return {
            flightTime: flightTime,
            fuelRequired: fuelRequired,
            autonomy: autonomy,
            formattedTime: this.formatTime(flightTime),
            formattedFuel: this.formatFuel(fuelRequired),
            formattedAutonomy: autonomy.toFixed(1) + ' hours'
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FlightCalculator;
}