let map;

document.addEventListener("DOMContentLoaded", () => {
	if (typeof L !== "undefined") {
		init();
	} else {
		console.error("Leaflet is not loaded. Ensure leaflet.js is included before this script.");
	}
});

function init() {
	// Center on Brussels Central Station
	map = L.map("map").setView([50.845748, 4.356524], 14);

	L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	}).addTo(map);

	// Create a custom purple icon for Brussels Central Station
	const purpleIcon = new L.Icon({
		iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png",
		shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
		iconSize: [25, 41],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		shadowSize: [41, 41],
	});

	// Purple marker and circle for Brussels Central Station
	L.marker([50.845748, 4.356524], { icon: purpleIcon }).addTo(map).bindPopup("Brussels Central Station").openPopup();

	L.circle([50.845748, 4.356524], {
		color: "purple",
		fillColor: "purple",
		fillOpacity: 0.5,
		radius: 150,
		className: "fading-circle",
	}).addTo(map);

	// Custom red icon for Erasmus campus
	const redIcon = new L.Icon({
		iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
		shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
		iconSize: [25, 41],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		shadowSize: [41, 41],
	});

	// Marker for Erasmus Campus with red icon
	L.marker([50.841779, 4.322871], { icon: redIcon }).addTo(map).bindPopup("Erasmus Hogeschool Brussel Campus Kaai");

	// Rectangle for campus area
	const campusRectangle = L.rectangle(
		[
			[50.8405, 4.3215],
			[50.843, 4.3255],
		],
		{
			color: "red",
			weight: 2,
			fillColor: "#f03",
			fillOpacity: 0.3,
		}
	).addTo(map);
	campusRectangle.bindPopup("Erasmus Campus Area");

	loadMarkers();
}

function loadMarkers() {
	const apiUrl = "https://bruxellesdata.opendatasoft.com/api/records/1.0/search/?dataset=urinoirs-publics-vbx&q=&rows=20";

	fetch("https://cors-anywhere.herokuapp.com/" + apiUrl)
		.then((response) => {
			if (!response.ok) {
				throw new Error(`API request failed with status ${response.status}`);
			}
			return response.json();
		})
		.then((data) => {
			if (!data.records || data.records.length === 0) {
				console.log("No urinal records found.");
				return;
			}

			data.records.forEach((item) => {
				const coords = item.fields.geo_point_2d;
				if (coords && coords[0] && coords[1]) {
					addMarker(coords[0], coords[1], item.fields.nom || "Public Urinal");
				}
			});
		})
		.catch((error) => {
			console.error("Error fetching urinal data:", error.message);
		});
}

function addMarker(lat, lon, popupText = "") {
	L.marker([lat, lon]).addTo(map).bindPopup(popupText);

	const circle = L.circle([lat, lon], {
		color: "blue",
		fillColor: "#3388ff",
		fillOpacity: 0.5,
		radius: 150,
		className: "fading-circle",
	}).addTo(map);

	setFadingEffect();
}

function setFadingEffect() {
	if (document.getElementById("fading-style")) return;

	const style = document.createElement("style");
	style.id = "fading-style";
	style.innerHTML = `
    .fading-circle {
      animation: fadePulse 2s infinite;
      transition: opacity 1s ease-in-out;
    }
    @keyframes fadePulse {
      0% { opacity: 0.4; }
      50% { opacity: 1; }
      100% { opacity: 0.4; }
    }
  `;
	document.head.appendChild(style);
}
