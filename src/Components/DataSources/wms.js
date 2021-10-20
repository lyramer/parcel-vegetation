import * as olSource from "ol/source";

function wms(props) {
    const {url, params, serverType} = {...props}
    console.log("generating wms request source for...")
    console.log("url: ", url)
    console.log("params: ", params)
    console.log("serverType: ", serverType)
    return new olSource.TileWMS({
        url,
        params,
        serverType,
        // Countries have transparency, so do not fade tiles:
    });
}

export default wms;