import * as olSource from "ol/source";

function xyz(children ) {
	return new olSource.XYZ({...children });
}

export default xyz;