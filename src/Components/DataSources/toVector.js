import { get } from "ol/proj";
import GeoJSON from "ol/format/GeoJSON";
import VectorSource from 'ol/source/Vector';

function toVector(geojsonObject, projection="EPSG:3857") {
	return new VectorSource({
		features: new GeoJSON().readFeatures(geojsonObject, {
		  featureProjection: get(projection),
		})
	})
}

export default toVector;