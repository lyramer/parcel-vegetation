import React from "react";
import { TileLayer, RasterLayer, VectorLayer } from "../Layers";
import Static from 'ol/source/ImageStatic';


function MapLayer(props) {

    const {type, source, projection, extent, display, style, order=0, ...other} = props;

    // note that I'm specifically using a test against falsity
    // so that if you don't define display, it doesn't return falsey
    if (display === false) return null;
    if (!type) console.error("ERROR: You must specify a type in the MapLayer props.")
    
    switch(type) {
        case "Image":
            const img = new Static({
                url: source,
                projection: props.projection,
                imageExtent: props.extent,
            })
            return (<RasterLayer source={img} zIndex={order} />)
        case "Vector":
            return (<VectorLayer source={source} zIndex={order} style={style}/>)
        case "Tile":
            return (<TileLayer source={source} zIndex={order} />)
        case "Raster":
            return (<RasterLayer source={source} zIndex={order} />)
        case "XYZ":
            return (<TileLayer source={source} zIndex={3} />)
        default:
            return null;
    }
}
export default MapLayer;