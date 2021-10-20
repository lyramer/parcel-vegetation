import React, {Component} from "react";
import './App.css';
import { Panel, ParcelIDForm, LayerSelect } from "./Components/Panel"
import { Map, MapLayer} from './Components/Map';
import { osm, wms, toVector} from './Components/DataSources'
import FeatureStyles from './Components/Map/FeatureStyles';
import { fromLonLat } from 'ol/proj';
import { TileArcGISRest, ImageArcGISRest} from 'ol/source';
const layers = [
  {
    "id": "osm",
    "name": "Open Street Map",
    "type": "Tile",
    "display": true,
    "order": "1",
    "source": osm()
  },
  {
    "id": "bcmosaic",
    "name": "BC Mosaic",
    "type": "Tile",
    "display": false,
    "order": "2",
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
    "id": "landcover",
    "name": "ESRI 2020 Landcover",
    "type": "Raster",
    "display": false,
    "order": "3",
    "source": new TileArcGISRest({
      url: "https://tiledimageservices.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/" + "Esri_2020_Land_Cover_V2/ImageServer",
      ratio: 1,
      params: {'TOKEN': "P3ePLMYs2RVChkJx"}
    })
  },
];
 
// import connect secrets
require('dotenv').config();

// connect postGIS DB
//  const { Pool, Client } = require('pg');

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
      parcelInfo: `Mrs. Beaumont made me a slight compliment upon my recovery, for I had pleaded illness to excuse keeping my room: Lady Louisa spoke not a word; but Lord Orville, little imagining himself the cause of my indisposition, enquired concerning my health with the most distinguishing politeness. I hardly made any answer; and, for the first time since I have been here, contrived to sit at some distance from him.

      I could not help observing that my reserve surprised him; yet he persisted in his civilities, and seemed to wish to remove it. But I paid him very little attention; and the moment breakfast was over, instead of taking a book, or walking in the garden, I retired to my own room.
      
      Soon after, Mrs. Selwyn came to tell me, that Lord Orville had been proposing I should take an airing, and persuading her to let him drive us both in his phaeton. She delivered the message with an archness that made me blush; and added, that an airing, in my Lord Orville's carriage, could not fail to revive my spirits. There is no possibility of escaping her discernment; she has frequently rallied me upon his Lordship's attention,-and, alas!-upon the pleasure with which I have received it! However, I absolutely refused the offer.`,
      parcelIDs: [],
      layers: [...layers]
    }
  }

  queryParcel = (parcelIDs) => {

    this.setState({parcelIDs});

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

  setLayers = (layers) => {
    this.setState({layers})
  }

  render(){
    let activeLayers = this.state.layers.filter(layer => layer.display)
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
                  type={layer.type} 
                  source={layer.source} 
                  key={"layer_"+layer.id}
                  zIndex={layer.order}
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
