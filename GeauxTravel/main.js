
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import { fromLonLat } from 'ol/proj';
import TileGrid from 'ol/tilegrid/TileGrid.js'; 
import TileLayer from 'ol/layer/Tile.js';
import {get as getProjection} from 'ol/proj.js';
import VectorTileSource from 'ol/source/VectorTile.js';
import {circular} from 'ol/geom/Polygon.js';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';
import{Draw, Modify, Snap} from 'ol/interaction.js';
import {GeometryCollection, Point, Polygon} from 'ol/geom.js';
import MousePosition from 'ol/control/MousePosition.js';
import {createStringXY} from 'ol/coordinate.js';
import Source from 'ol/source/Vector.js';
import {addCity} from './firebase.js';
class CustomTileSource {
  getTile(z, x, y) {
    // Create a canvas for each tile
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d');

    //Set the color based on tile coords
    const color = this.getColorForTile(x, y);
    context.fillStyle = color;
    context.fillRect(0,0, canvas.width, canvas.height);
    console.log("rendering {z} {x} {y}");
    return canvas;
  }

  //Function for color determination
  getColorForTile(x,y) {
    //Change color based on coords
    return 'red';
  }
}
const br = fromLonLat([-91.1871, 30.4515]);

/* Mouse position */
const mousePositionControl = new MousePosition({
  coordinateFormat: createStringXY(4),
  className: 'mouse-position',
  target: document.getElementById('mouse-position'),
});

const view = new View ({
  center: [0,0],
  zoom: 12,
  minZoom: 0,
  maxZoom: 18,
  zoomduration: 500
});

const map = new Map({
  layers: [
    new TileLayer({
      source: new OSM,
    }),],
  target: 'js-map',
  view: view,
});





window.drawCircle = function(ctx, x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = 'blue';
  ctx.fill();
  ctx.stroke();
};

// Handle click event
/*
window.handleClick = function() {
  var lon = parseFloat(document.getElementById("lon").value);
  var lat = parseFloat(document.getElementById("lat").value);
  console.log("handleClick worked");

  

  if (!isNaN(lon) && !isNaN(lat)) {
      // Assuming a conversion to canvas coordinates; replace as needed
      
      const canvas = document.getElementById('myCanvas');
      const ctx = canvas.getContext('2d');
      
      // Example conversion; you might need to adjust this based on your application's needs
      const x = lon * 2; // Adjust scaling
      const y = lat * 2; // Adjust scaling
      
      // Clear the canvas and draw the circle
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawCircle(ctx, 160, 240, 20); // Radius is 20 pixels
  } else {
      console.log("Invalid coordinates");
  }
};*/
//document.getElementById('drawButton').addEventListener('click', handleClick);





window.handleClick = function() {
  var lon = parseFloat(document.getElementById("lon").value);
  var lat = parseFloat(document.getElementById("lat").value);
  console.log("handleClick worked");
  if (!isNaN(lon) && !isNaN(lat)) {
    view.animate({zoom: 2},{center: fromLonLat([lon, lat])}, {zoom: 12});
  } else {
    console.log("Invalid coordinates");
  }
};

/* coord hardcode */
window.fillInput = function()  {
  const dropdown = document.getElementById("cities");
  const selectedCity = dropdown.value;
  const lon = document.getElementById("lon");
  const lat = document.getElementById("lat");

  /* Hardcode of city coordinates */
  if (selectedCity == "BatonRouge") {
    lon.value = -91.1871;
    lat.value = 30.4515;
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

//document.getElementById("submit-button").addEventListener("click", handleClick);
view.centerOn( br, map.getSize(), [570,500]);
 

/*const raster = new TileLayer({
  source: new OSM(),
}) 

let draw;
circleFunction = function(circleCoord) {
  const center = coordinates[0];
  const last = coordinates[coordinates.length-1];
  const radius = 20
}
  draw = new Draw({
    source: source,
    type: 'Circle',
    geometryFunction: circleFunction
  });

  map.addInteraction(draw);

  //
*/
addCity();
