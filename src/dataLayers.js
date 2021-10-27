
import { osm, wms, xyz} from './Components/DataSources'

export const dataLayers = [
    {
      id: "osm",
      name: "Open Street Map",
      type: "Tile",
      display: true,
      order: 0,
      source: osm()
    },
    {
      id: "bcmosaic2018",
      name: "BC Mosaic 2018",
      type: "Tile",
      display: false,
      order: 0,
      source: 
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
      id: "bcmosaic2020",
      name: "BC Mosaic 2020",
      type: "Tile",
      display: false,
      order: 0,
      source: 
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
      id: "landcover",
      name: "ESRI 2020 Landcover",
      type: "Tile",
      display: false,
      order: 0,
      source: xyz({
        attributions: 'Copyright:© 2021 ESRI',
        ratio: 1,
        params: {
          "FORMAT": "png"
        },
        url: "https://tiledimageservices.arcgis.com/P3ePLMYs2RVChkJx/arcgis/" +
        "restservices/Esri_2020_Land_Cover_V2/ImageServer/tile/{z}/{y}/{x}",
        projection: 'EPSG:4326',
        transition: 0,
      })
    }
  ];