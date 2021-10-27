import React, {Component} from "react";
import './App.css';
import { Panel, ParcelIDForm, LayerSelect } from "./Components/Panel"
import { Map, MapLayer} from './Components/Map';
import { toVector } from './Components/DataSources'
import FeatureStyles from './Components/Map/FeatureStyles';
import { fromLonLat } from 'ol/proj';
import { TileArcGISRest, ImageArcGISRest } from 'ol/source';
import * as api from './Database/api.js'
import { getPixelIndexArray } from "ol/render/canvas/ExecutorGroup";
import { dataLayers } from "./dataLayers";

// import map config details
let mapConfig = require('./config.json');
mapConfig.view.center = fromLonLat(mapConfig.view.center, mapConfig.view.projection)

// import a multipolygon geometry
let geometries = require('./geometries.json');

// import a single polygon
let geometry = require('./geometry.json');


class App extends Component{
  constructor(props) {
    super(props);    
    this.state = {
      mapExtent: null,
      parcels: {
        type: "FeatureCollection",
        features: [],
        properties: {
        }
      },
      queryError: '',
      details: `Still working on report format, but the SQL query is now working! \n
                ID's to search: 015417271 012479292 010511687`,
      layers: [...dataLayers]
    }
  }

  queryParcel = (parcelID) => {
    let cleanedPID = parcelID.replace('-', '');
    cleanedPID = Number(cleanedPID);

    console.log("queryParcel for " + cleanedPID)
    
    let collection = {...this.state.parcels};
    let features = [...collection.features];
    
    if (cleanedPID === 0 || cleanedPID === NaN) {
      this.setState({queryError: 'Please specify a 9 digit Parcel ID'});
      return;
    } else if (features.find(({type, geometry, properties}) => properties.pid == cleanedPID)) {
      this.setState({queryError: 'You already have searched for this parcel'});
      return;
    } else {
      this.setState({queryError: ''});
    }
    
    api.getParcelGeometry(cleanedPID).then(res => {
      let geom = res[0].get_geojson ? {...res[0].get_geojson} : null;
      let queryError = '';
      if (!geom)  {
        queryError = "No results found for cleanedPID '" + cleanedPID + "'";
        this.setState({queryError});
      } else {
        features.push({...geom})
        console.log("features", features)
        collection.features = [...features]
        this.setState({
          parcels: collection,
          mapExtent: toVector(collection).getExtent()
        });
        console.log(toVector(collection).getExtent());
      }
    }).catch(e => console.log(e))
    
  }

  setLayers = (layers) => {
    this.setState({layers})
  }

  render(){

    let activeLayers = this.state.layers.filter(layer => layer.display);

    return (
      <div className="App">
          <Panel queryParcel={this.queryParcel}>
            <ParcelIDForm queryParcel={this.queryParcel} queryError={this.state.queryError}/>
            <LayerSelect layers={this.state.layers} setLayers={this.setLayers}/>
            <div className={"results-text"}>

              <div className={"results-id"} >
                {this.state.parcels.features.map(parcel => {
                  return <span key={parcel.properties.pid} className="pid-label">{parcel.properties.pid}</span>
                })}
              </div>
              <div className={"results-info"}>
                {this.state.details}
              </div>
            </div>
          </Panel>
          <Map {...mapConfig.view} extent={this.state.mapExtent}>
            {activeLayers.map(layer => {
              return (
                <MapLayer 
                  key={"layer_"+layer.id}
                  {...layer}
                  projection={layer.source.projection}
                />)
            })}

            {this.state.parcels.features &&
              <MapLayer 
                type={"Vector"} 
                source={toVector(this.state.parcels, "EPSG:3857")} 
                style={FeatureStyles.MultiPolygon}
              />
                  
            }
            {/* <MapLayer 
              type={"Vector"} 
              source={toVector(geometries, "EPSG:3857")} 
              style={FeatureStyles.MultiPolygon}
            />
            <MapLayer 
              type={"Vector"} 
              source={toVector(geometry, "EPSG:3857")} 
              style={FeatureStyles.Polygon}
            /> */}
          </Map>
      </div>
    );
  }
}

export default App;
