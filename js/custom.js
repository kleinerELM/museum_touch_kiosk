let file_data;
var viewer = null;

function getUrlParameter(sParam) {
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

function build_navigation( path, data, viewer ) {
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
			preview_click_evt(id, path, file_data, viewer);
		});
	}
}

function load_openseadragon_viewer( path, id, degrees ) {
	var viewer = OpenSeadragon({
		id: "openseadragon1",
		//prefixUrl: "./images/",
		tileSources: path + id + "/stack.dzi", // Pfad zur DZI-Datei
		overlays: {
			id: 'example-overlay',
			x: 0.33,
			y: 0.75,
			width: 2000,
			height: 1000,
			className: 'highlight'
		},

		showNavigator:      true, // Navigator-Minimap anzeigen
		navigatorPosition:  "BOTTOM_RIGHT", // Position der Minimap
		navigatorSizeRatio: 0.15,
		navigatorWidth:     "15em",
		navigatorHeight:    "15em",
		navigatorAutoFade:  true,
		preserveViewport:   false,
		// degrees:            degrees,
		visibilityRatio:   1,
		minZoomImageRatio: 1,
		zoomInButton:   "zoom-in",
		zoomOutButton:  "zoom-out",
		homeButton:     "home",
		fullPageButton: "full-page",
		/* showSequenceControl: true,*/
	});

	viewer.viewport.setRotation(degrees, true);
	return viewer;
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

var last_item = false;
function preview_click_evt(id, path, file_data, viewer ) {
	$("#head>span").animate({opacity:0},100);
	var map_image = ("map" in file_data[id]) ?
		'media/' + file_data[id]["map"] :
		'media/map_we_1945.jpg';
	var name = ("name" in file_data[id]) ?
		file_data[id]["name"] :
		id;

	$('#head_id').text(name);
	if (last_item === false) last_item = viewer.world.getItemAt(0);

	viewer.world.removeItem(last_item); // delete last image
	// load new source
	var degrees = file_data[id]["deg"];
	console.log( degrees );
	viewer.addTiledImage({
		tileSource: path + id + "/stack.dzi",
		//degrees: degrees,
		success: function (obj) { last_item = obj.item; },
		overlays: {
			id: 'example-overlay',
			x: 0.33,
			y: 0.75,
			width: 2000,
			height: 1000,
			className: 'highlight'
		},
	});
	viewer.viewport.setRotation(degrees, true);

	update_prev_next_btn( file_data, id, path, viewer );

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

function init_page( path, std_map_url, viewer) {

	$.getJSON( path + "files.json", function( data ) {
		file_data = data;
		file_list = Object.keys(file_data);
		var id = get_id( file_list );

		$('#head_id').text(id);
		var degrees = file_data[id]["deg"];
		console.log( degrees );
		viewer = load_openseadragon_viewer( path, id, degrees );
		build_navigation( path, file_list, viewer );
		update_prev_next_btn( file_data, id, path, viewer );
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

function update_prev_next_btn( file_data, id, path, viewer ) {
	file_list = Object.keys(file_data);
	var prev_id = false;
	var next_id = false;
	for (i = 0; i < file_list.length; ++i) {
		if ( id == file_list[i] ) {
			if ( i > 0 ) prev_id = file_list[i-1];
			if ( i+1 < file_list.length ) next_id = file_list[i+1];
		}
	}
	$("#previous").off();
	if ( prev_id ) {
		$("#previous").css({'opacity':1});
		$("#previous").click(function() {
			document.getElementById('link_' + prev_id).scrollIntoView();
			preview_click_evt(prev_id, path, file_data, viewer);
		});
	} else {
		$("#previous").css({'opacity':0.1});
	}

	$("#next").off();
	if ( next_id ) {
		$("#next").css({'opacity':1});
		$("#next").click(function() {
			document.getElementById('link_' + next_id).scrollIntoView();
			preview_click_evt(next_id, path, file_data, viewer);
		});
	} else {
		$("#next").css({'opacity':.1});
	}
}

$(document).ready(function() {

	// load json and the respecting images
	//$('#toolbar_container').load('toolbar_container.html');
	init_page( path, std_map_url, viewer );
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