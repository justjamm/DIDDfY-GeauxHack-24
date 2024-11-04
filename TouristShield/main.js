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
  maxZoom: 16,
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
  const button = document.getElementById("chooseLocation");
  button.style.backgroundColor = "#007acc";
  map.un('click',handleMapClick);
  
}
window.listen = function(){
  const button = document.getElementById("chooseLocation");
  button.style.backgroundColor = "yellow";
  map.on('click', handleMapClick);
  
}


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
  var color = "rgba(0, 0, 0, 0.5)";
  var colorSelect = description;
  switch(colorSelect){
    case "Robbery":
      color = "rgba(232, 12, 12, 0.5)";
      break;
    case "CarRobbery":
      color = "rgba(123, 104, 238, 0.5)";
      break;
    case "Kidnapping":
      color = "rgba(255, 215, 0, 0.5)";
      break;
    case "Vandalism":
      color = "rgba(255, 165, 0, 0.5)";
      break;
    case "Assault":
      color = "rgba(255, 0, 225, 0.5)";
      break;
    case "Accident/HitandRun":
      color = "rgba(74, 146, 255, 0.5)";
      break;            
    case "SuspiciousActivities":
      color = "rgba(0, 255, 255, 0.5)";   
      break;
    case "FraudulentActivity":
      color = "rgba(13, 211, 13, 0.5)";
      break;
    default:
      color = "rgba(0, 0, 0, 0.5)";       
  }
    circleFeature.setStyle(
      new Style({
        image: new CircleStyle({
          radius: 7,
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


 