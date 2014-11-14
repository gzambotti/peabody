$(document).ready(function() {
  var map;  
  var tableid_collection = '1Gx59NtWsI6iHq57FztcU8aWvlTQOXcjJtq5LEbGI';
  var arraydata = [];
  var content = '';
  var lineCoordinates;
  var infowindow = new google.maps.InfoWindow();
  var linePath;
  
  function initialize() {
    var mapOptions = {
      zoom: 6,
      center: new google.maps.LatLng(23.634501,-102.552784),
      mapTypeId: google.maps.MapTypeId.TERRAIN,
      zoomControl: true,
      zoomControlOptions: {style: google.maps.ZoomControlStyle.BIG},
      streetViewControl: false,
      panControl: false,
      scaleControl: true
    };
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    
      
    $.ajax("https://www.googleapis.com/fusiontables/v1/query?sql=SELECT * FROM " + tableid_collection + "&key=AIzaSyCpHwlJzky3GlrccTkbttPb1DPkb2RXVRs",
      { dataType: "json" }
      ).done(function ( data ) {
            // array for building the selection menu
            var rows = data['rows'];               
            for (var i in rows) {                          
              arraydata.push(rows[i])
            }
            var locations = maparray(arraydata);
            var redCircle = {path: google.maps.SymbolPath.CIRCLE, fillColor: '#DF013A', fillOpacity: 1, scale: 6, strokeColor: '#610B0B', strokeWeight: 2 };

            for (var n in locations) {
              console.log(locations[n]);               
              var marker = new google.maps.Marker({position: new google.maps.LatLng(locations[n][4], locations[n][3]),icon: redCircle,map: map});                          
              
              google.maps.event.addListener(marker,'click', (function(marker,content,infowindow){                                   
                  var itemID = (locations[n][1]);
                  return function() {      
                    content = '<div class="slider demo">';
                    for(var y= 0;y<arraydata.length;y++) {
                        var item = arraydata[y];                        
                        if(item[1] == itemID) {
                          content += "<div class='slick-slide slick-active'><img src=images/" +  item[2] + "><div class='caption'> " + item[7]+ "<a class='f1'> Add Line</a></div></div>";                          
                        }
                    };                    
                    content += "</div>";                    
                    infowindow.setContent(content);
                    infowindow.open(map,marker);                                                         
                    
                    //start the carosuel
                    $('.demo').slick({
                      dots: false,                      
                      centerMode: true,                      
                      variableWidth: true,  
                      arrows: true,
                      slideToShow: 1                                            
                    });
                  };
              })(marker,content,infowindow));              
        }    
    });   
  } 
  
  // add line connection 
  google.maps.event.addListener(infowindow, 'domready', function() {
    var lineCoordinates;
    console.log(linePath) 
    $('.f1').on('click', function (event) {
        //console.log(arraydata)
        if (typeof(linePath) != "undefined"){linePath.setMap(null);}      
        for(var y= 0;y<arraydata.length;y++) {
          var item = arraydata[y];
          if(arraydata[y][2] == $('.slick-center').children('img').attr('src').split('/')[1]){                        
            console.log(item[2]);
            lineCoordinates = [new google.maps.LatLng(item[4],item[3]),new google.maps.LatLng(item[6],item[5])];
          }  
        };

        if (typeof(linePath) != "undefined"){linePath.setMap(null);}

        linePath = new google.maps.Polyline({path: lineCoordinates, geodesic: true, strokeColor: '#FF3300', strokeOpacity: .9, strokeWeight: 3 });
        linePath.setMap(map);      
        
    });
   
    
  });
  

  // responsive resize
  google.maps.event.addDomListener(window, "resize", function() {
    var center = map.getCenter();
    google.maps.event.trigger(map, "resize");
    map.setCenter(center); 
  });

  google.maps.event.addDomListener(window, 'load', initialize);

  //google.maps.event.addListener(infowindow, 'domready', function() {
                /*document.getElementById("f1").addEventListener("click", function(e) {
                  //e.stop();
                    console.log("hi!");
                  });*/

              
              
  //            });


  function addLine(myLine){   
    var lineCoordinates = myLine;
    var linePath = new google.maps.Polyline({
      path: lineCoordinates,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });

    linePath.setMap(map);
  }  

  
});



function maparray(myarray){
  var tempArray = new Array();
  tempArray[0]= myarray[0];
    for(var i=0;i<myarray.length;i++)
    {
      var flag = true;
      for(var j=0;j<tempArray.length;j++)
      {
        if(tempArray[j][1]==myarray[i][1])
        {
          flag = false;
        }
      }//for loop
      if(flag==true)
      tempArray.push(myarray[i]);
    }//for loop
    return tempArray;
}

