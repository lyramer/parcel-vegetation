import * as olSource from "ol/source";

function wms(props) {
    const {url, params, serverType} = {...props}
    return new olSource.TileWMS({
        url,
        params,
        serverType,
        // Countries have transparency, so do not fade tiles:
    });
}

export default wms;