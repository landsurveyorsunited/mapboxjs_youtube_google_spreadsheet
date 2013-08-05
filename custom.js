$(document).ready(function() {
  
  $("#map_toggler").click(function (){
	
	var endHeight = 400;
	if ($('#map').height() == 400){
		endHeight = 240;
	}
	
	$('#map').animate({
    	height: endHeight+'px'
  	}, 400, function() {
    // Animation complete.
    	map.fitBounds(markerLayer.getBounds());
  	});

  });
  
   var map = L.mapbox.map('map', 'acorbi.map-12emshz6');  
   
   var geojson;
   var geojson2;
   
   var alreadyCentered;
   
   // Create one layer for the markers and one layer for the route
   var markerLayer = L.mapbox.markerLayer(geojson).addTo(map);
   var routeLayer = L.mapbox.markerLayer(geojson2).addTo(map);

   // load the geojson files
   markerLayer.loadURL('http://www.open-steps.org/geojson/0.geojson'); 
   routeLayer.loadURL('http://www.open-steps.org/geojson/route.geojson'); 
   
   var polyline = L.polyline([], {color: '#0a8ef6','noClip': true, weight: 2 }).addTo(map);
   var addedMarkers = new Array();
   var addedCounter = 0;
   
   map.on('layeradd', function(e) {   	    
   
    routeLayer.eachLayer(function(marker) {    	    	
   		marker.setIcon(L.divIcon({className: 'marker'}));	
    });
    
      
    markerLayer.eachLayer(function(marker) {
    
    	var title = marker.feature.properties.title;
    	//var desc = marker.feature.properties.description.substring(0,200) + "...";
    	var desc = marker.feature.properties.description;
    	var link = marker.feature.properties.link;
    	var type = marker.feature.properties.type;
    	var logo = marker.feature.properties.logo;
    	
    	var html = $('<div class="bubble"></div>');    	
    	html.append('<a>'+title+'</a>');
    	if (link!="") {
    		html.append('<p>'+desc+' <a target="_blank" href="'+link+'">Read more</a></p>');
    	}else{
    		html.append('<p>'+desc+'</p>');	
    	}    	
    	if (logo!="") html.append('<img src="'+logo+'" style="height:40px;margin:0px 4px 4px 0px;"></img>');  	   		
    
   		marker.bindPopup(html.html());
   		
   		if (marker.feature.properties.type == "planned"){
   			marker.setIcon(L.divIcon({className: 'marker marker-planned'}));	   	
   		}else if (marker.feature.properties.type == "confirmed"){
	   		marker.setIcon(L.divIcon({className: 'marker marker-confirmed'}));	   	
   		}else if (marker.feature.properties.type == "visited"){
   			marker.setIcon(L.divIcon({className: 'marker marker-visited'}));	   		
   		}else if (marker.feature.properties.type == "position"){
			
			marker.setIcon(L.divIcon({className: 'marker marker-position'}));		
			 
		}
			
    });
    
    if (!alreadyCentered){
    	var iVal = setInterval(function(){        
    		map.fitBounds(markerLayer.getBounds()); 
    		window.clearInterval(iVal);
    		
    		routeLayer.eachLayer(function(marker) {
				
				if ($.inArray(marker.feature.properties.ID,addedMarkers)==-1){
					polyline.addLatLng(marker.getLatLng());
					addedMarkers[addedCounter] = marker.feature.properties.ID;
					addedCounter++;
				}    				
   				marker.setIcon(L.divIcon({className: 'marker'}));	
	    		
	    	});
	    	
	    	map.removeLayer(routeLayer);
    		
    		alreadyCentered = true;
    		
    	},1000);
    }
   
   });

});

