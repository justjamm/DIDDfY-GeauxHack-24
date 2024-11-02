/*
import Map from 'ol/Map.js';
import {OSM, TileDebug} from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';

const map = new Map({
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
    new TileLayer({
      source: new TileDebug(),
    }),
  ],
  target: 'map',
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
});

*/
import Map from 'ol/Map.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';
import {OSM, TileDebug} from 'ol/source.js';
import { fromLonLat } from 'ol/proj';
import TileGrid from 'ol/tilegrid/TileGrid.js'; 
import {get as getProjection} from 'ol/proj.js';
import VectorTileSource from 'ol/source/VectorTile.js';

const br = fromLonLat([-91.1871, 30.4515]);

const view = new View ({
  center: [0,0],
  zoom: 13,
  minZoom: 12,
  maxZoom: 16,
});
const map = new Map({
  layers: [
    new TileLayer({
      source: new OSM(),

    }),
    new TileLayer({
      source: new TileDebug(
        /*TileGrid, new TileGrid({
        extent: getForProjection('ESPG:3857').getExtent(),
        resolutions: resolution,
        tileSize: 512,*/
        ),
}),
    
  ],
  target: 'js-map',
  view: view,

  
});

window.handleClick = function() {
  var lon = parseFloat(document.getElementById("lon").value);
  var lat = parseFloat(document.getElementById("lat").value);

  if (!isNaN(lon) && !isNaN(lat)) {
    view.setCenter(fromLonLat([lon, lat]));
  } else {
    console.error("Invalid coordinates");
  }
};

document.getElementById("submit-button").addEventListener("click", handleClick);
// window.handleClick = function(){
//   var lon = document.getElementById("lon").value;
//   var lat = document.getElementById("lat").value;
//   console.log(lon);
//   view.centerOn(fromLonLat([lon,lat]), map.getSize(), [570,500]);
//   /*
//   const lonVal = lon.value;
//   const latVal = lat.value;
//   */
// }
// window.test = function(){
//   console.log("hello");
// }

// document.getElementById("submit-button").addEventListener("click", handleClick());
 view.centerOn( br, map.getSize(), [570,500]);
  
/*window.update = function() {
  try {
    const lon = document.getElementById("lon");
    const lat = document.getElementById("lat");

    const lonVal = l
    console.log(lon);
    view.centerOn(fromLonLat([lon, lat]), 
    map.getSize(), [570,500]);
    /*const temp = fromLonLat([document.getElementById("lat"), document.getElementById("lon")]);
    map.view.center = temp;
    return temp;
  } catch (error){
    console.error(error);
  }
  
  
}
*/