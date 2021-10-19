import './App.css';
import { Map, MapLayer} from './Components/Map';
import { osm, toVector} from './Components/DataSources'
import FeatureStyles from './Components/Map/FeatureStyles';

// import map config details
let mapConfig = require('./config.json');

// import a multipolygon geometry
let geometries = require('./geometries.json');

// import a single polygon
let geometry = require('./geometry.json');



function App() {
  return (
    <div className="App">
        <Map {...mapConfig.view}>
          <MapLayer type={"Tile"} source={osm()}/>
          <MapLayer 
            type={"Vector"} 
            source={toVector(geometries, "EPSG:3857")} 
            style={FeatureStyles.MultiPolygon}
          />
          <MapLayer 
            type={"Vector"} 
            source={toVector(geometry, "EPSG:3857")} 
            style={FeatureStyles.Polygon}
          />
        </Map>
    </div>
  );
}

export default App;
