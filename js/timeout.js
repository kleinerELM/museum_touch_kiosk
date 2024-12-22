let timeout;
let timeout2;
var time_to_reload = 10; //in minuten

function resetTimeout() {
	clearTimeout(timeout);
	clearTimeout(timeout2);
	timeout = setTimeout(() => {
		window.location.href = "./index.html"; // Ziel-URL hier anpassen
		//console.log('Weiterleitung');
	}, time_to_reload * 60 * 1000); // 10 Minuten in Millisekunden
	timeout2 = setTimeout(() => {
		if($("#warning").length <= 0 ){
			$('body').append('<div id="warning"><span>Die Seite wird in ' + Math.round( time_to_reload*0.05 * 60 ) + ' Sekunden zurückgesetzt.</span></div>');
		}
		
	}, time_to_reload*0.95 * 60 * 1000); // 10 Minuten in Millisekunden
	$('#warning').remove();
}
// Timeout initialisieren
resetTimeout();

// Events überwachen, um Benutzeraktivität zu erkennen
window.addEventListener("mousemove", resetTimeout); // Bewegung der Maus
window.addEventListener("keydown", resetTimeout);   // Tasteneingabe
window.addEventListener("click", resetTimeout);     // Mausklick
window.addEventListener("scroll", resetTimeout);    // Scrollen