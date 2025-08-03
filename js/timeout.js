let timeout;
let timeout2;
var time_to_reload = 10; //in minuten

function resetTimeout() {
	clearTimeout(timeout);
	clearTimeout(timeout2);
	timeout = setTimeout(() => {
		// Check if the current URL does NOT start with the base URL
		// and redirect to the index page if it doesn't -> then this application is installed on a local server.
		// Then it is expected, that the local server is the touchscreen interface which is used in the museum and shall reset to the index page after 10 minutes of inactivity.
		if (!window.location.href.startsWith("https://weimar1945.flugplatz-nohra.de/")) {
			window.location.href = "./index.html"; // Ziel-URL hier anpassen
		}
		//console.log('Weiterleitung');
	}, time_to_reload * 60 * 1000); // 10 Minuten in Millisekunden

	timeout2 = setTimeout(() => {
		if ($("#warning").length <= 0) {
			$('body').append('<div id="warning"><span>Die Seite wird in ' + Math.round(time_to_reload * 0.05 * 60) + ' Sekunden zurückgesetzt.</span></div>');
		}
	}, time_to_reload * 0.95 * 60 * 1000); // 10 Minuten in Millisekunden

	$('#warning').remove();
}
// Timeout initialisieren
resetTimeout();

// Events überwachen, um Benutzeraktivität zu erkennen
window.addEventListener("mousemove", resetTimeout); // Bewegung der Maus
window.addEventListener("keydown", resetTimeout);   // Tasteneingabe
window.addEventListener("click", resetTimeout);     // Mausklick
window.addEventListener("scroll", resetTimeout);    // Scrollen