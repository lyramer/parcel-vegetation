import React from "react";
import { TileLayer, RasterLayer, VectorLayer } from "../Layers";
import Static from 'ol/source/ImageStatic';


function MapLayer(props) {

    const {type, source, projection, extent, display, style, ...other} = props;

    // note that I'm specifically using a test against falsity
    // so that if you don't define display, it doesn't return falsey
    if (display === false) return null;
    if (!type) console.error("ERROR: You must specify a type in the MapLayer props.")
    
    switch(type) {
        case "Image":
            const img = new Static({
                url: source,
                projection: projection,
                imageExtent: extent,
            })
            return (<RasterLayer source={img} />)
        case "Vector":
            return (<VectorLayer source={source} zIndex={0} style={style}/>)
        case "Tile":
            return (<TileLayer source={source} zIndex={0} />)
        case "Raster":
            return (<RasterLayer source={source} zIndex={0} />)
        default:
            return null;
    }
}
export default MapLayer;