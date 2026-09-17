// Configuration du thème Tailwind (couleurs, espacements, typographie du design system TravelMatch)
tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "tertiary-container": "#af4c45",
                "error": "#ba1a1a",
                "surface-container-low": "#f3f3f3",
                "on-error": "#ffffff",
                "on-secondary-fixed": "#0e1e1e",
                "inverse-primary": "#7ad7c6",
                "on-tertiary": "#ffffff",
                "surface-white": "#FFFFFF",
                "tertiary-fixed": "#ffdad6",
                "primary": "#005e53",
                "on-primary-fixed": "#00201b",
                "on-secondary-container": "#576867",
                "secondary-container": "#d4e6e5",
                "secondary-fixed-dim": "#b8cac9",
                "outline": "#6e7a76",
                "primary-fixed-dim": "#7ad7c6",
                "surface-tint": "#006b5e",
                "surface-container-lowest": "#ffffff",
                "surface": "#f9f9f9",
                "on-surface": "#1a1c1c",
                "error-container": "#ffdad6",
                "on-background": "#1a1c1c",
                "outline-variant": "#bdc9c5",
                "on-surface-variant": "#3e4946",
                "surface-container-highest": "#e2e2e2",
                "on-primary": "#ffffff",
                "background": "#f9f9f9",
                "on-secondary-fixed-variant": "#3a4a49",
                "primary-container": "#00796b",
                "secondary": "#516161",
                "surface-bright": "#f9f9f9",
                "surface-variant": "#e2e2e2",
                "secondary-fixed": "#d4e6e5",
                "inverse-surface": "#2f3131",
                "surface-container": "#eeeeee",
                "text-main": "#1A1A1A",
                "tertiary": "#90352f",
                "on-primary-container": "#a1feec",
                "primary-fixed": "#97f3e2",
                "on-primary-fixed-variant": "#005047",
                "surface-dim": "#dadada",
                "on-tertiary-container": "#ffe8e5",
                "on-error-container": "#93000a",
                "booking-blue": "#003580",
                "inverse-on-surface": "#f1f1f1",
                "on-secondary": "#ffffff",
                "on-tertiary-fixed-variant": "#7f2924",
                "tertiary-fixed-dim": "#ffb4ac",
                "surface-container-high": "#e8e8e8",
                "on-tertiary-fixed": "#410003",
                "glass-overlay": "rgba(255, 255, 255, 0.7)"
            },
            borderRadius: {
                DEFAULT: "0.25rem",
                lg: "0.5rem",
                xl: "0.75rem",
                full: "9999px"
            },
            spacing: {
                gutter: "16px",
                "card-gap": "20px",
                "section-gap": "48px",
                base: "8px",
                "container-padding": "24px"
            },
            fontFamily: {
                "label-sm": ["Inter"],
                "label-md": ["Inter"],
                "headline-md": ["Montserrat"],
                "headline-lg": ["Montserrat"],
                "display-lg": ["Montserrat"],
                "headline-lg-mobile": ["Montserrat"],
                "body-lg": ["Inter"],
                "body-md": ["Inter"]
            },
            fontSize: {
                "label-sm": ["12px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "600" }],
                "label-md": ["14px", { lineHeight: "20px", letterSpacing: "0.01em", fontWeight: "500" }],
                "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
                "headline-lg": ["32px", { lineHeight: "40px", fontWeight: "600" }],
                "display-lg": ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "700" }],
                "headline-lg-mobile": ["24px", { lineHeight: "32px", fontWeight: "600" }],
                "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
                "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }]
            }
        }
    }
};

// Mise à jour de l'affichage des valeurs des sliders de préférences
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("input[type='range'][data-value-target]").forEach(function (slider) {
        var targetId = slider.getAttribute("data-value-target");
        var target = document.getElementById(targetId);
        if (!target) return;
        slider.addEventListener("input", function () {
            target.innerText = slider.value + "/5";
        });
    });
});


document.addEventListener("DOMContentLoaded", function () {
    var searchButton = document.getElementById("search-button");
    var searchInput = document.getElementById("search-query");

    var categories = ["culture", "adventure", "nature", "beaches", "nightlife",
                       "cuisine", "wellness", "urban", "seclusion"];

    searchButton.addEventListener("click", async function () {
        var query = searchInput.value;

        var userPreferences = {};
        categories.forEach(function (cat) {
            var slider = document.getElementById("slider-" + cat);
            userPreferences[cat] = parseInt(slider.value);
        });

        

        var coefficient = parseInt(document.getElementById("slider-coefficient").value);
        var beta = coefficient / 100;
        var alpha = 1 - beta;

        console.log("Requête tapée :", query);
        console.log("Préférences :", userPreferences);
        console.log("Alpha :", alpha, "Beta :", beta);



        try {
            const response = await fetch("http://localhost:8000/recommend", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    query: query,
                    user_preferences: userPreferences,
                    alpha: alpha,
                    beta: beta,
                    top: 5
                })

                
            });

            const data = await response.json();
            await displayResults(data.results);

        } catch (error) {
            console.error("Erreur lors de la requête :", error);
        }
    });
});


async function displayResults(results) {
    var container = document.getElementById("results-container");
    container.innerHTML = "";

    for (const destination of results) {
        var imageUrl = await getCityImage(destination.city, destination.country);
        var matchPercent = Math.round(destination.score_final * 100);

        var card = document.createElement("div");
        card.className = "bg-surface-white rounded-[16px] overflow-hidden shadow-[0_4px_24px_rgba(0,94,83,0.04)] flex flex-col";

        card.innerHTML = `
            <div class="relative w-full pt-[56.25%] bg-surface-container-low">
                <img class="absolute inset-0 w-full h-full object-cover" src="${imageUrl}">
            </div>
            <div class="p-5 flex-grow flex flex-col">
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <h3 class="font-headline-md text-[20px] font-bold text-on-surface">${destination.city}</h3>
                        <p class="font-label-md text-label-md text-on-surface-variant">${destination.country}</p>
                    </div>
                    <div class="flex flex-col items-end">
                        <span class="font-headline-md text-[20px] text-primary">${matchPercent}%</span>
                        <span class="font-label-sm text-label-sm text-outline text-[10px]">MATCH</span>
                    </div>
                </div>
                <p class="font-body-md text-body-md text-on-surface-variant mb-4">${destination.short_description}</p>
            </div>
        `;

        container.appendChild(card);
    }
}



async function getCityImage(cityName, country) {
    try {
        const query = encodeURIComponent(`${cityName} ${country}`);
        const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${query}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=1`
        );
        const data = await response.json();
        return data.results[0]?.urls?.regular || "https://via.placeholder.com/400x225?text=No+Image";
    } catch (error) {
        console.error("Erreur récupération image pour", cityName, error);
        return "https://via.placeholder.com/400x225?text=No+Image";
    }
}
