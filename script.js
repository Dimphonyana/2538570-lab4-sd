document.getElementById('fetch-button').addEventListener('click', fetchCountryData);

async function fetchCountryData() {
    const countryName = document.getElementById('country-input').value.trim();
    
    if (!countryName) {
        alert("Please enter a country name.");
        return;
    }

    try {
        // Fetch country data
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);
        if (!response.ok) throw new Error("Country not found.");
        
        const countryData = await response.json();
        const country = countryData[0]; 
        
        // Extract relevant information
        const capital = country.capital ? country.capital[0] : "N/A";
        const population = country.population.toLocaleString();
        const region = country.region;
        const flag = country.flags.png;
        const borders = country.borders || [];

        // Display country information
        document.getElementById('country-info').innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${capital}</p>
            <p><strong>Population:</strong> ${population}</p>
            <p><strong>Region:</strong> ${region}</p>
            <img src="${flag}" alt="Flag of ${country.name.common}" class="flag">
        `;

        // Fetch and display bordering countries
        if (borders.length > 0) {
            fetchBorderingCountries(borders);
        } else {
            document.getElementById('bordering-countries').innerHTML = "<p>No bordering countries.</p>";
        }
    } catch (error) {
        document.getElementById('country-info').innerHTML = `<p style="color:red;">${error.message}</p>`;
        document.getElementById('bordering-countries').innerHTML = "";
    }
}

async function fetchBorderingCountries(borders) {
    try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const countries = await response.json();

        const borderCountries = countries.filter(country => borders.includes(country.cca3));
        
        document.getElementById('bordering-countries').innerHTML = "<h3>Bordering Countries:</h3>";
        
        borderCountries.forEach(country => {
            document.getElementById('bordering-countries').innerHTML += `
                <div>
                    <p><strong>${country.name.common}</strong></p>
                    <img src="${country.flags.png}" alt="Flag of ${country.name.common}" class="flag">
                </div>
            `;
        });
    } catch (error) {
        console.error("Error fetching bordering countries:", error);
    }
}
