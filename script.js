const input = document.getElementById('country-input');
const button = document.getElementById('search-btn');
const spinner = document.getElementById('loading-spinner');
const countryInfo = document.getElementById('country-info');
const borderSection = document.getElementById('bordering-countries');
const errorMessage = document.getElementById('error-message');


async function searchCountry(countryName) {

    try {
        // Clear previous results
        errorMessage.textContent = "";
        errorMessage.classList.add('hidden');
        countryInfo.innerHTML = "";
        borderSection.innerHTML = "";

        // Show spinner
        spinner.classList.remove('hidden');

        // Fetch main country
        const response = await fetch(
            `https://restcountries.com/v3.1/name/${countryName}`
        );

        if (!response.ok) {
            throw new Error("Country not found");
        }

        const data = await response.json();
        const country = data[0];

        // Display country information
        countryInfo.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" width="150">
        `;

        countryInfo.classList.remove('hidden');

        // Handle borders
        if (!country.borders) {
            borderSection.innerHTML = "<p>No bordering countries.</p>";
            borderSection.classList.remove('hidden');
            return;
        }

        // Fetch bordering countries
        for (let code of country.borders) {

            const borderResponse = await fetch(
                `https://restcountries.com/v3.1/alpha/${code}`
            );

            const borderData = await borderResponse.json();
            const borderCountry = borderData[0];

            borderSection.innerHTML += `
                <div>
                    <p>${borderCountry.name.common}</p>
                    <img src="${borderCountry.flags.svg}" width="100">
                </div>
            `;
        }

        borderSection.classList.remove('hidden');

    } catch (error) {

        errorMessage.textContent = 
            "Country not found. Please try again.";

        errorMessage.classList.remove('hidden');

    } finally {

        // Hide spinner
        spinner.classList.add('hidden');
    }
}


// Button click
button.addEventListener('click', () => {

    const country = input.value.trim();

    if (country) {
        searchCountry(country);
    }
});


// Enter key
input.addEventListener('keypress', (event) => {

    if (event.key === 'Enter') {

        const country = input.value.trim();

        if (country) {
            searchCountry(country);
        }
    }
});