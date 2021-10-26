import React, {Component} from "react";
import './App.css';
import { Panel, ParcelIDForm, LayerSelect } from "./Components/Panel"
import { Map, MapLayer} from './Components/Map';
import { osm, wms, toVector, xyz} from './Components/DataSources'
import FeatureStyles from './Components/Map/FeatureStyles';
import { fromLonLat } from 'ol/proj';
import { TileArcGISRest, ImageArcGISRest } from 'ol/source';
import * as api from './Database/api.js'
import { getPixelIndexArray } from "ol/render/canvas/ExecutorGroup";

const layers = [
  {
    "id": "osm",
    "name": "Open Street Map",
    "type": "Tile",
    "display": true,
    "order": 0,
    "source": osm()
  },
  {
    "id": "bcmosaic2018",
    "name": "BC Mosaic 2018",
    "type": "Tile",
    "display": false,
    "order": 0,
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
    "order": 0,
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
    "order": 0,
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
      parcels: [],
      queryError: '',
      details: `Still working on report format, but the SQL query is now working!`,
      layers: [...layers]
    }
  }

  queryParcel = (parcelID) => {
    parcelID = Number(parcelID);

    console.log("queryParcel for " + parcelID)
    
    let parcels = [...this.state.parcels];
    
    if (parcelID === 0 || parcelID === NaN) {
      this.setState({queryError: 'Please specify a 9 digit Parcel ID'});
      return;
    } else if (parcels.find(({pid, ...feature}) => pid == parcelID)) {
      this.setState({queryError: 'You already have searched for this parcel'});
      return;
    } else {
      this.setState({queryError: ''});
    }
    
    api.getParcelGeometry(parcelID).then(res => {
      let geom = res[0].get_geojson ? {...res[0].get_geojson} : null;
      let queryError = '';
      if (!geom)  {
        queryError = "No results found for parcelID '" + parcelID + "'";
        this.setState({queryError});
      } else {
        parcels.push({...geom})
        console.log("parcels", parcels)
        this.setState({parcels: [...parcels]});
      }
    }).catch(e => console.log(e))
    
  }

  setLayers = (layers) => {
    this.setState({layers})
  }

  render(){
    let activeParcels = [...this.state.parcels]
    let activeLayers = this.state.layers.filter(layer => layer.display);

    return (
      <div className="App">
          <Panel queryParcel={this.queryParcel}>
            <ParcelIDForm queryParcel={this.queryParcel} queryError={this.state.queryError}/>
            <LayerSelect layers={this.state.layers} setLayers={this.setLayers}/>
            <div className={"results-text"}>

              <div className={"results-id"} >
                {this.state.parcels.map(parcel => {
                  return <span key={parcel.pid} className="pid">{parcel.pid}</span>
                })}
              </div>
              <div className={"results-info"}>
                {this.state.details}
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

            {activeParcels.map(parcel => {
                  return (
                    <MapLayer 
                      type={"Vector"} 
                      source={toVector(parcel, "EPSG:3005")} 
                      style={FeatureStyles.MultiPolygon}
                    />
                  )
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
