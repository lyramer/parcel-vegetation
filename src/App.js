import React, {Component} from "react";
import './App.css';
import { Panel } from "./Components/Panel"
import { Map, MapLayer} from './Components/Map';
import { osm, toVector} from './Components/DataSources'
import FeatureStyles from './Components/Map/FeatureStyles';

// import map config details
let mapConfig = require('./config.json');

// import a multipolygon geometry
let geometries = require('./geometries.json');

// import a single polygon
let geometry = require('./geometry.json');



class App extends Component{
  constructor(props) {
    super(props);
    this.state = {parcelIDs: []}
  }

  queryParcel(parcelIDs) {
    this.setState({parcelIDs})
    fetch("https://api.example.com/items")
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
          parcelsLoaded: true,
          items: result.items
        });
      },
      (error) => {
        this.setState({
          parcelsLoaded: true,
          error
        });
      }
    )
  }

  render(){
    return (
      <div className="App">
          <Panel queryParcel={this.queryParcel} />
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
}

export default App;
