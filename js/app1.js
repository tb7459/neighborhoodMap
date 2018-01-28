// set up initial locations
var initLocs = [
	         {
	          name: 'Starbucks',
	          address: '8805 Lakeview Pkwy, Rowlett, TX 75088',
	          lat: '32.920257',
	          lng: '-96.5168882',
		  fsId: '4b1a75a9f964a520a4ea23e3'
                 },
	         {
	          name: 'Target',
	          address: '4701 Lakeview Pkwy, Rowlett, TX 75088',
	          lat: '32.908873',
	          lng: '-96.556652',
	          fsId: '4b4a73b9f964a520108826e3'
                 },
	         {
	          name: 'Walmart Supercenter',
	          address: '2501 Lakeview Pkwy, Rowlett, TX 75088',
	          lat: '32.910725',
	          lng: '-96.5801205',
	          fsId: '4b295ce1f964a520a29d24e3'
                 },
	         {
	          name: 'McDonalds',
	          address: '8503 Lakeview Pkwy, Rowlett, TX 75088',
	          lat: '32.9175869',
	          lng: '-96.5209452',
	          fsId: '4bc1e99074a9a5932d61d2f6'
                 },
	         {
	          name: 'Chik-Fil-a',
	          address: '2617 Lakeview Pkwy, Rowlett, TX 75088',
	          lat: '32.9099741',
	          lng: '-96.5758744',
	          fsId: '4bc0bb262a89ef3be803f188'
                 } 
               ];
//set up Location model,
//this will include data from foursquare:
//(description, rating, and url)
var Location = function(data){
   this.name    = ko.observable(data.name);
   this.address = ko.observable(data.address);
   this.lat     = ko.observable(data.lat);
   this.lng     = ko.observable(data.lng);
   this.fsId    = ko.observable(data.fsId);
   this.desc    = ko.observable('');
   this.rtg     = ko.observable('');
   this.url     = ko.observable('');
};

// error function
function errorFunc(){
   alert("Google maps failed to load, please try again");
}

// function to open the menu
function menu_open(){
  document.getElementById('locationlist').style.display = "block";
}

// function to close the menu
function menu_close(){
  document.getElementById('locationlist').style.display = "none";
}

// set up the map
var map;
function initMap() {
     map = new google.maps.Map(document.getElementById('map'), {
       center: {lat: 32.9087485, lng: -96.550225},
       zoom: 13
     });
// call the applybindings here so that it loads the page after
// the map
     ko.applyBindings(new ViewModel());

}

var ViewModel = function(){

   var self = this; 
   this.locList = ko.observableArray([]);
   // initialize the selectedValue variable for user input
   this.selectedValue = null;

   //initialize marker variable and markers array
   var marker;
   var markers = [];

   //set up dataWindow
   var dataWindow = new google.maps.InfoWindow({
        maxWidth: 300,
    });

   //push locations into locList
   initLocs.forEach(function(locItem){
       self.locList.push( new Location(locItem));
   });

   //for each item in locList, set up marker and add the event listeners
   self.locList().forEach(function(eachItem){
	    marker = new google.maps.Marker({
            position: new google.maps.LatLng(eachItem.lat(), eachItem.lng()),
            map: map,
            title: eachItem.name(),
            animation: google.maps.Animation.DROP
        });
        eachItem.marker = marker;
        markers.push(marker);

	$.ajax({
		url: 'https://api.foursquare.com/v2/venues/' + eachItem.fsId() + 
		'?v=201708011111111111&client_id=QKXKWPUXEMGHLJO1OFLZD2WIHTLBNXM30Q1DIKUHVMT3PCG2' + 
		'&client_secret=KFZ1PLF3QTY2NGBAYMILJ3UGUZH5GCLYXOYVIMYVL1XO4E4T',
		datatype: "json",
		success: function(data){

		 var result = data.response.venue;

 		 var description = result.hasOwnProperty('description') ? result.description : '';
                 eachItem.desc(description || 'no description in foursquare.com for this location');
         
		 var rating = result.hasOwnProperty('rating') ? result.rating : '';
                 eachItem.rtg(rating || 'none');
		 
		 var url = result.hasOwnProperty('url') ? result.url : '';
                 eachItem.url(url || '');

	         var contentString = '<b>' + eachItem.name() + '</b></br>'+ eachItem.address() + '</br></br><b>FourSquare Description</b>:</br>' +  description + '</br></br><b>FourSquare rating: ' + rating + '</b></br></br><b>URL</b>:</br>' + url; 
	         google.maps.event.addListener(eachItem.marker, 'click', function () {
                   dataWindow.open(map, this);
                   eachItem.marker.setAnimation(google.maps.Animation.BOUNCE);
                   setTimeout(function () {
                        eachItem.marker.setAnimation(null);
                   }, 500);
                   dataWindow.setContent(contentString);
                   map.setCenter(eachItem.marker.getPosition());
                  });
		},
		error: function (e) {
                dataWindow.setContent('<h5>Foursquare data is unavailable. Please try refreshing later.</h5>');
                document.getElementById("error").innerHTML = "<h4>Foursquare data is unavailable. Please try refreshing later.</h4>";
            }
	
      });
   });
   
   this.currentLoc = ko.observable( this.locList()[0]);
  
   //function to show the location on the map when the 
   //user mouses over the listed item
   self.showLoc = function (eachItem) {
	eachItem.marker.setMap(map);
        google.maps.event.trigger(eachItem.marker, 'click');
    };

   //function to show the selected location in dropdown
   // and hide the others.
   self.showSingleLoc = function (selectedValue) {

	 //if selectedValue is defined, hide all markers
         if(selectedValue){
           for (var i = 0; i < markers.length; i++) {
              markers[i].setMap(null);
           }

           //show selected Marker, and bounce it
           selectedValue.marker.setMap(map);
           google.maps.event.trigger(selectedValue.marker, 'click');

          }

	  //if selectedValue is undefined (means All was selected)
	  // show all
	  else{
           
	    for (var j = 0; j< markers.length; j++) {
              markers[j].setMap(map);
            }

	  }
   };

   
};
