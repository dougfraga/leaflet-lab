function initDemoMap() {
  var Esri_WorldImagery = L.tileLayer(
    "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  );

  var Esri_DarkGreyCanvas = L.tileLayer(
    "http://{s}.sm.mapstack.stamen.com/" +
      "(toner-lite,$fff[difference],$fff[@23],$fff[hsl-saturation@20])/" +
      "{z}/{x}/{y}.png",
  );

  var baseLayers = {
    "Satélite [ESRI]": Esri_WorldImagery,
    "Mapa Cinza": Esri_DarkGreyCanvas
  };

  var map = L.map("mapdiv", {
    layers: [Esri_WorldImagery],
    zoomControl:false,
    attributionControl:false,
    minZoom: 9
  });

  var layerControl = L.control.layers(baseLayers);
  layerControl.addTo(map);
  map.setView([-23.1, -44.2], 11);

  return {
    map: map,
    layerControl: layerControl
  };
}

// BIG map
var mapStuff
var mymap
var layerControl
var mrkCurrentLocation;
var ctlRef;
var ctlZoom;
var ctlScale;
var ctlMousePos;
var now;
var dateString;
var hour;
var ctlDate;

$(document).ready(function(){

  mapStuff = initDemoMap();
  mymap = mapStuff.map;
  layerControl = mapStuff.layerControl;
/*
	setInterval(function() {
		mymap.locate();
	}, 5000);
*/	

  now = new Date()
  dateString = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth()+1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours()}:00`;
  hour = now.getHours()

  ctlZoom = L.control.zoom({zoomInText:'+', zoomOutText:'-', position:'topright'});
  ctlZoom.addTo(mymap);

  ctlDate = L.control.attribution({position:'bottomright'}).addTo(mymap);
	ctlDate.addAttribution(`Created by <a href="https://douglasfraga.com/" target="blank">Douglas Fraga</a>`);

	ctlRef = L.control.attribution({prefix: `<h6>Previsão para: <strong>${dateString}</strong></h6>`, position:'topleft'}).addTo(mymap);
	
	ctlScale = L.control.scale({position:'bottomleft', imperial:false, maxWidth:200}).addTo(mymap);
	/*
	mymap.on('locationfound', function(e) {
		console.log(e);
		if (mrkCurrentLocation) {
			mrkCurrentLocation.remove();
		}
		mrkCurrentLocation = L.circle(e.latlng,
			{radius:e.accuracy/2}).addTo(mymap);
	});
  */


  // load data (u, v grids) from somewhere (e.g. https://github.com/danwild/wind-js-server)
  $.getJSON(`dougfraga/big_${hour}.json`, function(data) {
    var velocityLayer = L.velocityLayer({
      displayValues: true,
      displayOptions: {
        velocityType: "",
        position: "bottomright",
        emptyString: "Sem dado",
        angleConvention: "bearingCW",
        directionString: "Direção",
        speedString: "Velocidade",
      },
      data: data,
      maxVelocity: 1,
      velocityScale: 1 // arbitrary default 0.005
    });
    velocityLayer.addTo(mymap)
    //layerControl.addOverlay(velocityLayer, "Animação de correntes");
  });

  ctlMousePos = L.control.mousePosition({position:'bottomright', emptyString: 'Mova o cursor sobre o mapa'}).addTo(mymap);
  
});		



