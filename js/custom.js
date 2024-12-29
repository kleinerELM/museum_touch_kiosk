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
		);
	}
	$('#images').html(items.join( "" ));
	for (i = 0; i < data.length; ++i) {
		// set the onclick funktion of the image
		$("#link_" + data[i]).click(function(){
			var id = this.id.split("_")[1]; // get id from html-block-id
			preview_click_evt(id, path, file_data);
		});
	}
}

function load_openseadragon_viewer( path, id, degrees, overlays ) {
	var viewer = OpenSeadragon({
		id: "openseadragon1",
		prefixUrl: "./images/",
		tileSources: path + id + "/stack.dzi", // Pfad zur DZI-Datei

		overlays: {
			id: 'example-overlay',
			x: 0.33,
			y: 0.75,
			width: 0.2,
			height: 0.25,
			className: 'highlight'
		},

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
		zoomInButton:   "zoom-in",
		zoomOutButton:  "zoom-out",
		homeButton:     "home",
		fullPageButton: "full-page",
		/* showSequenceControl: true,*/
	});
}

function map_click_evt( map_open ) {
	$("#map_nav a").css({"display": "block"});
	$("#map_nav a").animate({"opacity": map_open ? 0 : 1}, 500, function() {
		$("#map_nav a").css({"display": map_open ? 'none' : "block"});
		$("#map_nav .position_overlay").css({"display": map_open ? 'block' : "none"});
		$("#map_nav .position_overlay").animate({"opacity": map_open ? 1 : 0}, 200);
	  });
	$("#map_nav").animate({"height": map_open ? '20.5rem' : '4rem'}, 500);
	$("#map_nav").css({"background-blend-mode": map_open ? "initial" : 'soft-light'});
	$("#nav").animate({"margin-bottom": map_open ? '20.5rem' : '4rem'}, 500);
}

function preview_click_evt(id, path, file_data) {
	$("#head>span").animate({opacity:0},100);
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

	if ( $('#map_nav').length ) {
		$("#map_nav").css({"background-image": "url('" + map_image + "')"});
		$("#map_nav .position_overlay").animate({'opacity':0},100, function() {
			$("#map_nav .position_overlay").attr("src", path + id + "/pos.svg");
			$("#map_nav .position_overlay").animate({'opacity':1},100);
		});
		if ($("#map_nav").prop('open') == 0) {
			map_hinting( 2000 );
		}
	}
}

function init_page( path, std_map_url) {

	$.getJSON( path + "files.json", function( data ) {
		file_data = data;
		file_list = Object.keys(file_data);
		build_navigation( path, file_list );
		var id = get_id( file_list );

		$('#head_id').text(id);
		load_openseadragon_viewer( path, id, file_data[id]["deg"] );
		$("#head span").animate({opacity:1},1000);
		document.getElementById('link_' + id).scrollIntoView();

		if ( $('#map_nav').length ) {
			$("#map_nav").css({"background-image": "url('" + std_map_url + "')"});
		}

	});
};

function toggle_map_state() {
	if ( $("#map_nav").prop('open') == 1 ) {
		$("#map_nav").prop('open', 0);
	} else {
		$("#map_nav").prop('open', 1);
	}
	return $("#map_nav").prop('open');
}

// opens map shortly for a set time in ms
function map_hinting( time ) {
	$("#map_nav").prop('autoclose', 1);
	$("#map_nav").prop('open', 1);
	map_click_evt( 1 );
	setTimeout(() => {
		if ( $("#map_nav").prop('autoclose') == 1 ) {
			$("#map_nav").prop('open', 0);
			map_click_evt( 0 );
			$("#map_nav").prop('autoclose', 0);
		};
    }, time );
};

$(document).ready(function() {
	let file_data;

	// load json and the respecting images
	init_page( path, std_map_url );
	if ( $('#map_nav').length ) {
		$("#map_nav").prop('open', 1);

		$("#map_nav").click(function() {
			map_open = toggle_map_state(); // Simple I/O toggler
			map_click_evt( map_open );
			$("#map_nav").prop('autoclose', 0);
		});
		map_hinting( 3000 );
	}
});