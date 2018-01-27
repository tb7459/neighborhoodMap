# neighborhoodMap

Description: 
  This is a single webpage that displays 5 locations(with markers) on a google map. A collapsible menu
  is provided (hamburger icon) that will display the list of locations, that when clicked, will cause
  the corresponding marker to bounce and location information ( from foursquare.com) to display.
  A filter drop-down is provided that will display only the filtered location and it's information, which 
  defaults to All, and will display all.

To Add new locations:
  If a new location is wanted, you must get the foursquare.com, and the lat and lng from google maps
  and add a new entry in the initLocs portion of the app.js as follows:

  {
     name: '<new location name>',
     address: '<new location address>',
     lat: '<new location lattitude',
     lng: '<new location longitude',
     fsId: '<new location foursquare id>'
  },

Credits:
  webpage uses google maps api to display map and markers, and provide animation(Bounce and drop).
  Webpage also uses foursquare.com api to get description, rating, and url information and display 
  in the information window of google map.


