import React, {Component} from "react";
import './App.css';
import { Panel, ParcelIDForm, LayerSelect } from "./Components/Panel"
import { Map, MapLayer} from './Components/Map';
import { osm, wms, toVector, xyz} from './Components/DataSources'
import FeatureStyles from './Components/Map/FeatureStyles';
import { fromLonLat } from 'ol/proj';
import { TileArcGISRest, ImageArcGISRest } from 'ol/source';


const layers = [
  {
    "id": "osm",
    "name": "Open Street Map",
    "type": "Tile",
    "display": true,
    "order": 1,
    "source": osm()
  },
  {
    "id": "bcmosaic2018",
    "name": "BC Mosaic 2018",
    "type": "Tile",
    "display": false,
    "order": 2,
    "source": 
      wms({
        url: "http://206.12.92.18:10191/geoserver/BCParks/wms",
        params: {
          'VERSION':"1.1.0",
          'LAYERS':"BCParks:mosaic",
          'SRS':"EPSG:3857",
          'TILED':true
        },
        serverType: "geoserver"
      }),
  },
  {
    "id": "bcmosaic2020",
    "name": "BC Mosaic 2020",
    "type": "Tile",
    "display": false,
    "order": 3,
    "source": 
      wms({
        url: "http://206.12.92.18:10191/geoserver/BCParks/wms",
        params: {
          'VERSION':"1.1.0",
          'LAYERS':"BCParks:EDA_Mosaic_S2_L2A_BritishColumbia_2020_v1",
          'SRS':"EPSG:3857",
          'TILED':true
        },
        serverType: "geoserver"
      }),
  }, 
  {
    "id": "landcover",
    "name": "ESRI 2020 Landcover",
    "type": "Tile",
    "display": false,
    "order": 4,
    "source": xyz({
      "attributions": 'Copyright:© 2021 ESRI',
      "ratio": 1,
      "params": {
        "FORMAT": "png"
      },
      "url": "https://tiledimageservices.arcgis.com/P3ePLMYs2RVChkJx/arcgis/" +
      "rest/services/Esri_2020_Land_Cover_V2/ImageServer/tile/{z}/{y}/{x}",
      //"crossOrigin": null,
      // "minZoom": 1,
      // "maxZoom": 13,
      "projection": 'EPSG:4326',
      "transition": 0,
    })
  }
];
 
// import connect secrets
//require('dotenv').config();

// connect postGIS DB
// const { Pool, Client } = require('pg');

//test it (pull this out)
//Client = new Client();
//console.log()

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
      parcelInfo: `Still working on report format, but the SQL query is now working!`,
      parcelIDs: [],
      layers: [...layers]
    }
  }

  queryParcel = (parcelID) => {
    console.log("queryParcel for " + parcelID)
    this.setState({parcelID});
    fetch("http://206.12.92.18:10190/parcel/" + parcelID)
    .then(res => res.json())
    .then(
      (result) => {
        console.log(result);
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

  setLayers = (layers) => {
    this.setState({layers})
  }

  render(){

    let activeLayers = this.state.layers.filter(layer => layer.display);

    return (
      <div className="App">
          <Panel queryParcel={this.queryParcel}>
            <ParcelIDForm queryParcel={this.queryParcel} />
            <LayerSelect layers={this.state.layers} setLayers={this.setLayers}/>
            <div className={"results-text"}>
              <div className={"results-id"} >
                {this.state.parcelIDs}
              </div>
              <div className={"results-info"}>
                {this.state.parcelInfo}
              </div>
            </div>
          </Panel>
          <Map {...mapConfig.view}>
            {activeLayers.map(layer => {
              return (
                <MapLayer 
                  key={"layer_"+layer.id}
                  {...layer}
                  projection={layer.source.projection}
                />)
            })}
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
