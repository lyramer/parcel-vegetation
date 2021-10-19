import React from "react";
import { TileLayer, RasterLayer } from "../Layers";
import Static from 'ol/source/ImageStatic';


function MapLayer(props) {

    const {type, source, projection, extent, display, ...other} = props.layer;

    // note that I'm specifically using a test against falsity
    // so that if you don't define display, it doesn't return falsey
    if (display === false) return null;
    
    switch(type) {
        case "Raster":
            const img = new Static({
                url: source,
                projection: projection,
                imageExtent: extent,
            })
            return (<RasterLayer source={img} />)
        case "Vector":
            // TO DO
        case "Tile":
            return (<TileLayer source={source} zIndex={0} />)
        default:
            return null;
    }
}
export default MapLayer;