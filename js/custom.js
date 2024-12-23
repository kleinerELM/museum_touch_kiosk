var getUrlParameter = function getUrlParameter(sParam) {
	var sPageURL = window.location.search.substring(1),
		sURLVariables = sPageURL.split('&'),
		sParameterName,
		i;

	for (i = 0; i < sURLVariables.length; i++) {
		sParameterName = sURLVariables[i].split('=');

		if (sParameterName[0] === sParam) {
			return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
		}
	}
	return false;
};

function get_id( data ) {
	var id = getUrlParameter('id');
	if (id !== false) {
		/* make sure, the id is correctly formed - assuming the leading 0es are missing */
		id = (id.length < 4) ? id.padStart(4, "0") : id;
		if ( !data.includes(id) ) {
			console.log('unknown id - fallback to first element in list!');
			id = data[0];
		}
		return id;
	} else {
		return data[0];
	}
}

function build_navigation( path, data ) {
	var items = [];
	for (i = 0; i < data.length; ++i) {
		var id = data[i];
		var name = ("name" in file_data[id]) ?
			file_data[id]["name"] :
			id;
		items.push(
			'<li id="link_' + data[i] + '"><a href="#"><img src="' + path + data[i] + '/stack_files/10/0_0.jpg" /><span>' + name + '</span></a></li>'
			// ?id=' + data[i] + '
		);
	}
	$('#images').html(items.join( "" ));
	for (i = 0; i < data.length; ++i) {
		$("#link_" + data[i]).click(function(){
			$("#head>span").animate({opacity:0},100);
			console.log(this.id.split("_")[1]);
			var id = this.id.split("_")[1];
			var map_image = ("map" in file_data[id]) ?
				'media/' + file_data[id]["map"] :
				'media/map_we_1945.jpg';
			var name = ("name" in file_data[id]) ?
				file_data[id]["name"] :
				id;

			//window.location.href = '?id=' + this.id.substr(this.id.length - 4); // Ziel-URL hier anpassen
			$('#openseadragon1').empty();
			$('#head_id').text(name);
			load_openseadragon_viewer( path, id, file_data[id]["deg"] );
			$("#head span").animate({'opacity':1},1000);

			$("#map_nav").css({"background-image": "url('" + map_image + "')"});
			$("#map_nav .position_overlay").animate({'opacity':0},100, function() {
				$("#map_nav .position_overlay").attr("src", path + id + "/pos.svg");
				$("#map_nav .position_overlay").animate({'opacity':1},100);
			});
		});
	}
}

function load_openseadragon_viewer( path, id, degrees ) {

	var viewer = OpenSeadragon({
		id: "openseadragon1",
		prefixUrl: "./images/",
		tileSources: path + id + "/stack.dzi", // Pfad zur DZI-Datei
		showNavigator: true, // Navigator-Minimap anzeigen
		navigatorPosition: "BOTTOM_RIGHT", // Position der Minimap
		navigatorSizeRatio:0.15,
		navigatorWidth:"15em",
		navigatorHeight:"15em",
		navigatorAutoFade:true,
		preserveViewport: true,
		degrees: degrees,
		visibilityRatio: 1,
		minZoomImageRatio: 1,
		/*tileSources: file_list,
		showSequenceControl: true,*/
	});
}


$(document).ready(function() {
	$("#map_nav").click(function() {
		var io = this.io ^= 1; // Simple I/O toggler
		$("#map_nav a").css({"display": "block"});
		$("#map_nav a").animate({"opacity": io ? 0 : 1}, 500, function() {
			$("#map_nav a").css({"display": io ? 'none' : "block"});
			$("#map_nav .position_overlay").css({"display": io ? 'block' : "none"});
			$("#map_nav .position_overlay").animate({"opacity": io ? 1 : 0}, 200);
		  });
		$("#map_nav").animate({"height": io ? '20.5rem' : '4rem'}, 500);
		$("#map_nav").css({"background-blend-mode": io ? "initial" : 'soft-light'});
		$("#nav").animate({"margin-bottom": io ? '20.5rem' : '4rem'}, 500);
	});
});