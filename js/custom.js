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
		items.push( 
			'<li id="link_' + data[i] + '"><a href="#"><img src="' + path + data[i] + '/stack_files/10/0_0.jpg" /><span>' + data[i] + '</span></a></li>' // ?id=' + data[i] + '

		);
	}
	$('#images').html(items.join( "" ));
	for (i = 0; i < data.length; ++i) {
		$("#link_" + data[i]).click(function(){ 
			$("#head>span").animate({opacity:0},100);
			console.log(this.id.split("_")[1]); 
			var id = this.id.split("_")[1];
			//window.location.href = '?id=' + this.id.substr(this.id.length - 4); // Ziel-URL hier anpassen
			$('#openseadragon1').empty();
			$('#head_id').text(id);
			load_openseadragon_viewer( path, id, file_data[id][0] );
			$("#head span").animate({opacity:1},1000);
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
