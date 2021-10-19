import './App.css';
import { Map, MapLayer} from './Components/Map';
import osm from './Components/DataSources/osm'

// import map config details
import * as mapConfig from "./config.json";

function App() {
  return (
    <div className="App">
        <Map {...mapConfig.view}>
          <MapLayer layer={{type: "Tile", source:osm()}}/>
          </Map>
    </div>
  );
}

export default App;
