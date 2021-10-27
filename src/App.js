import React, {Component} from "react";
import './App.css';
import { Panel, ParcelIDForm, LayerSelect } from "./Components/Panel"
import { Report } from "./Components/Report"
import { Map, MapLayer} from './Components/Map';
import { toVector } from './Components/DataSources'
import FeatureStyles from './Components/Map/FeatureStyles';
import { fromLonLat } from 'ol/proj';
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

const sampleReportData = [
  {"tree_type" : "AcAt", "parcel_id" : 15296008, "parcel_area" : 647945.85, "intersect_area" : 30119.94},
  {"tree_type" : "AcSx(At)", "parcel_id" : 15296008, "parcel_area" : 647945.85, "intersect_area" : 35275.56},
  {"tree_type" : "Pli", "parcel_id" : 15296008, "parcel_area" : 647945.85, "intersect_area" : 114935.01},
  {"tree_type" : "SxPl", "parcel_id" : 15296008, "parcel_area" : 647945.85, "intersect_area" : 3.26},
  {"tree_type" : "At", "parcel_id" : 15327906, "parcel_area" : 647355.37, "intersect_area" : 105947.10},
  {"tree_type" : "At(Sx)", "parcel_id" : 15327906, "parcel_area" : 647355.37, "intersect_area" : 915.40},
  {"tree_type" : "Pli", "parcel_id" : 15327906, "parcel_area" : 647355.37, "intersect_area" : 238.74},
  {"tree_type" : "Pli(At)", "parcel_id" : 15327906, "parcel_area" : 647355.37, "intersect_area" : 3764.73},
  {"tree_type" : "Sx(Ac)", "parcel_id" : 15327906, "parcel_area" : 647355.37, "intersect_area" : 14716.23},
  {"tree_type" : "Sx(At)", "parcel_id" : 15327906, "parcel_area" : 647355.37, "intersect_area" : 46182.02},
  {"tree_type" : "SxAt", "parcel_id" : 15327906, "parcel_area" : 647355.37, "intersect_area" : 29413.62},
  {"tree_type" : "Sx(PliBl)", "parcel_id" : 15327906, "parcel_area" : 647355.37, "intersect_area" : 62362.38}
  ]

class App extends Component{
  constructor(props) {
    super(props);    
    this.state = {
      mapExtent: null,
      parcelIDs: [],
      parcels: {
        type: "FeatureCollection",
        features: [],
        properties: {
        }
      },
      queryError: '',
      details: `ID's to search: 015417271 012479292 010511687`,
      reportData: [],
      layers: [...dataLayers]
    }
  }

  queryParcel = (parcelID) => {
    let cleanedPID = parcelID.replace('-', '');
    cleanedPID = Number(cleanedPID);
    
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
      let geom = res[0].get_geojson1 ? {...res[0].get_geojson1} : null;
      let queryError = '';
      if (!geom)  {
        queryError = "No results found for cleanedPID '" + cleanedPID + "'";
        this.setState({queryError});
      } else {
        features.push({...geom})
        collection.features = [...features]
        let ids = features.map(feature => feature.properties.pid)
        let report = api.getVRIs(ids).then(res => {
          console.log("got VRIS");
          this.setState({
            reportData: [...sampleReportData]
          });
        })
        this.setState({
          parcels: collection,
          mapExtent: toVector(collection).getExtent(),
          parcelIDs: ids
        });
        console.log(toVector(collection).getExtent());
        return res
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
                <Report reportData={this.state.reportData}/>
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
