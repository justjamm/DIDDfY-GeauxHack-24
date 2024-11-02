
import Map from 'ol/Map.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer/.js';
import View from 'ol/View.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import { fromLonLat } from 'ol/proj';
import TileGrid from 'ol/tilegrid/TileGrid.js'; 
import {get as getProjection} from 'ol/proj.js';
import VectorTileSource from 'ol/source/VectorTile.js';
import {circular} from 'ol/geom/Polygon.js';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';
import{Draw, Modify, Snap} from 'ol/interaction.js';
import {GeometryCollection, Point, Polygon} from 'ol/geom.js';
import MousePosistion from 'ol/control/MousePosition.js';
import Source from 'ol/source/Vector.js';

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

const view = new View ({
  center: [0,0],
  zoom: 12,
  minZoom: 12,
  maxZoom: 18,
  zoomduration: 500
});
/*
const mousePositionControl = new MousePosition({
  coordinateFormat: createStringXY(4),
  projection: 'EPSG:4326'
})
*/
const map = new Map({
  layers: [
    new TileLayer({
      source: new OSM(),
    }),

    
  ],
  target: 'js-map',
  view: view,
});



/*
const projectionSelect = document.getElementById('projection');
projectionSelect.addEventListener('change', function (event) {
  mousePositionControl.setProjection(event.target.value);
});

const precisionInput = document.getElementById('precision');
precisionInput.addEventListener('change', function (event) {
  const format = createStringXY(event.target.valueAsNumber);
  mousePositionControl.setCoordinateFormat(format);
});
*/
window.handleClick = function() {
  var lon = parseFloat(document.getElementById("lon").value);
  var lat = parseFloat(document.getElementById("lat").value);
  console.log("handleclick worked");
  if (!isNaN(lon) && !isNaN(lat)) {
    view.animate({
      center: fromLonLat([lon, lat]),
      duration: 1000 
    });
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
*/
