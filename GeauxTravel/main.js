import Map from 'ol/Map.js';
import View from 'ol/View.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import { fromLonLat, toLonLat } from 'ol/proj';
import TileLayer from 'ol/layer/Tile.js';
import {Fill, Icon, Stroke, Style, Circle as CircleStyle} from 'ol/style.js';
import {GeometryCollection, Point, Polygon} from 'ol/geom.js';
import Feature from 'ol/Feature.js';
import {Vector as VectorLayer} from 'ol/layer.js';
import {db} from './firebase.js';
import {collection} from './firebase.js';
import { addDoc } from './firebase.js';
import { getDocs } from './firebase.js';

/* Set initial view to Baton Rouge */
const br = fromLonLat([-91.18, 30.41]);



/* Establish screen user sees */
const view = new View ({
  center: [0,0],
  zoom: 12,
  minZoom: 2,
  maxZoom: 18,
  zoomduration: 500
});

/* Build map */
const map = new Map({
  /*controls: defaultControls().extend([mousePositionControl]),*/
  layers: [
    new TileLayer({
      source: new OSM,
    }),],
  target: 'js-map',
  view: view,
});
// mouse countrol vars
const mousePosition = document.getElementById('mouse-position');
const selectedCoords = document.getElementById('selected-mouse-position');

map.on('pointermove', (event)=>{
  const coordinate = toLonLat(event.coordinate);
  mousePosition.innerHTML = `Mouse Position: ${coordinate[0].toFixed(4)}, ${coordinate[1].toFixed(4)}`;
});
//create null
var lastSelected = null;

function handleMapClick(event){
  const coordinate = toLonLat(event.coordinate);
  if (!coordinate) {
    return;
  }
  selectedCoords.innerHTML = `Selected Coordinates: ${coordinate[0].toFixed(4)}, ${coordinate[1].toFixed(4)}`;

  lastSelected = coordinate;
  map.un('click',handleMapClick);
  
}
window.listen = function(){
  map.on('click', handleMapClick);
}



/*
async function addCircleFeature(coordinates, description, category){
  const circleFeature = new Feature({
  geometry : new Point(coordinates), 
  description: description,
  })
}
*/



//function to select coordinates
/*window.handleMapClick = function(){
  map.on('click', (event)=> {
    const coordinate = toLonLat(event.coordinate);
    selectedCoords.innerHTML = `Selected Coordinates: ${coordinate[0].toFixed(4)}, ${coordinate[1].toFixed(4)}`;

    //stop listening for events immediately
    map.un('click',handleMapClick);

    //Return the coordinates as an array
    lastSelected= coordinate;
  });
}*/

// Set up vector source and layer for dots
const vectorSource = new VectorSource();
const vectorLayer = new VectorLayer({ source: vectorSource});
map.addLayer(vectorLayer);

//Function to create and add a circle feature on the map and save to Firebase
async function addCircleFeature(coordinates, description) {
  const circleFeature = new Feature({
    geometry: new Point(fromLonLat(coordinates)),
    
    description: description,
  });
  console.log(`addCircle ${coordinates}`);
  console.log(`turn those coords to nonlonlat ${fromLonLat(coordinates)}`);
  var color = null;
  var colorSelect = description;
  switch(colorSelect){
    case "Robbery":
      color = "rgb(232, 12, 12)";
      break;
    case "CarRobbery":
      color = "rgb(221, 113, 238)";
      break;
    case "Kidnapping":
      color = "yellow";
      break;
    case "Vandalism":
      color = "orange";
      break;
    case "Assault":
      color = "pink";
      break;
    case "Accident/HitandRun":
      color = "rgb(74, 146, 255)";
      break;            
    case "SuspiciousActivities":
      color = "aqua";   
      break;
    case "FraudulentActivity":
      color = "rgb(13, 211, 13)";
      break;
    default:
      color = "black";       
  }
    circleFeature.setStyle(
      new Style({
        image: new CircleStyle({
          radius: 10,
          fill: new Fill({ color: color}),
          stroke: new Stroke({ color: color, width: 2}),
        }),
      })
    );

  vectorSource.addFeature(circleFeature);

  
}
async function firebaseUpload(description) {
  const coordinates =  lastSelected
  console.log(lastSelected);
  
  //const latitude = coordinates[1]
  //const longitude = coordinates[0]
  
  try {
    await addDoc(collection(db, "Crimes"), {
      description: description,
      coordinates: coordinates,

    });
    console.log(`Crime added to Firebase:`, description);

  } catch (e) {
    console.error("Error adding crime :(");
  }
}


// Load crimes from Firebase on map load
async function loadCrimes(){
  const querySnap = await getDocs(collection(db, "Crimes"));

  querySnap.forEach((doc) => {
    const data /* object */= doc.data();
    const coordinates /* array */ = data.coordinates;
    
    const description = data.description;
    console.log(description, coordinates);
    /*const circleFeature = new Feature({
      geometry: new Point(coords),
    });

    
    [data.coordinates.longitude, data.coordinates.latitude]

    vectorSource.addFeature(circleFeature);
    console.log(`Loaded crimes: ${description}`);
    */
   addCircleFeature(coordinates, description);
   console.log(`Loaded crimes: ${description}`);
   console.log(`loaded coordinates: ${coordinates}`)

  });
}
loadCrimes();

/* Functionaly to Go! button */

window.handleClick = function() {
  var lon = parseFloat(document.getElementById("lon").value);
  var lat = parseFloat(document.getElementById("lat").value);
  console.log("handleClick worked");
  if (!isNaN(lon) && !isNaN(lat)) {
    view.animate({zoom: 2}, {center: fromLonLat([lon, lat])}, {zoom: 12});
  } else {
    console.log("Invalid coordinates");
  }
};

window.getDescription = function(){
  const selectedCrime = document.getElementById("crimeSelect").value;
  return selectedCrime;
}


window.submitCrime = function(){
  console.log(lastSelected);
  console.log(getDescription());
  
  try{
    firebaseUpload(getDescription());
    addCircleFeature(lastSelected,getDescription());
  } catch (e) {
    console.error("failed to add");
    }
  
}



/* Functionality to dropdown menu */
window.fillInput = function()  {
  const selectedCity = document.getElementById("cities").value;
  const lon = document.getElementById("lon");
  const lat = document.getElementById("lat");

  /* Hardcode of city coordinates */
  if (selectedCity == "Atyrau") {
    lon.value = 51.9238;
    lat.value = 47.0945;
  }
  else if (selectedCity == "BatonRouge") {
    lon.value = -91.1871;
    lat.value = 30.4515;
  }
  else if (selectedCity == "Berlin") {
    lon.value = 13.405;
    lat.value = 52.52;
  }
  else if (selectedCity == "Lagos") {
    lon.value = 3.3792;
    lat.value = 6.5244;
  }
  else if (selectedCity == "London") {
    lon.value = -0.1276;
    lat.value = 51.5072;
  }
  else if (selectedCity == "Yokohama") {
    lon.value = 139.6380;
    lat.value = 35.4437;
  }
  else if (selectedCity == "Venice") {
    lon.value = 12.316;
    lat.value = 45.4404
  }
}

window.showReport = function() {
  const report = document.getElementById("reportCrime");
  if (report.style.display === "none") {
    report.style.display = "flex";  
    document.getElementById("reportButton").value = "Hide Report Menu";
  }
  else {
    report.style.display = "none";
    document.getElementById("reportButton").value = "Show Report Menu";
  }
}
view.centerOn( br, map.getSize(), [570,500]);

/*
const format = createStringXY(event.target.valueAsNumber);
mousePositionControl.setCoordinateFormat(format);
//document.getElementById("submit-button").addEventListener("click", handleClick);
*/


  
/*
function clickListener(){
  document.addEventListener("click", loadCrimes())
}
document.getElementById("chooseLocation").addEventListener("click", clickListener()) 

*/

