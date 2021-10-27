import React, { useRef, useEffect, useState } from "react";
import MapContext from "./MapContext";

//OPENLAYERS
import "ol/ol.css";
import { Map as OLMap } from 'ol';
import { View as OLView } from 'ol';
import { defaults as defaultControls} from 'ol/control';

import "./Map.css";

const Map = ({ zoom, center, projection, extent, children}) => {

    //  note that this means that the coordinates for the default map center
    // are stored in an array of length 2, where lon is first and lat second.
    //let calculatedCenter = fromLonLat(center, projection)

    const mapRef = useRef();
    const [map, setMap] = useState(null);

    // on component mount
    useEffect(() => {
        let options = {
            view: new OLView({ zoom, center, projection }),
            layers: [],
            controls: defaultControls(),
            overlays: []
        };

        let mapObject = new OLMap(options);
        mapObject.setTarget(mapRef.current);
        setMap(mapObject);

        return () => mapObject.setTarget(undefined);
    }, []);

    // zoom change handler
    useEffect(() => {
        if (!map) return;

        map.getView().setZoom(zoom);
    }, [zoom]);

    // center change handler
    useEffect(() => {
        if (!map) return;

        map.getView().setCenter(center)
    }, [center])

    // extent change handler
    useEffect(() => {
        if (!map) return;

        map.getView().fit(extent)
    }, [extent])

    return (
        <MapContext.Provider value={{ map }}>
            <div ref={mapRef} className="ol-map">
                {children}
            </div>
        </MapContext.Provider>
    )
}

export default Map;