import { useContext, useEffect } from "react";
import MapContext from "../Map/MapContext";
import OLVectorLayer from "ol/layer/Vector";

const VectorLayer = ({ source, style, zIndex = 1 }) => {
	const { map } = useContext(MapContext);

	useEffect(() => {
		if (!map) return;

		let vectorLayer = new OLVectorLayer({
			source,
			style
		});

		map.addLayer(vectorLayer);
		vectorLayer.setZIndex(zIndex);

		return () => {
			if (map) {
				map.removeLayer(vectorLayer);
			}
		};
	}, [map, source, style, zIndex]);

	return null;
};

export default VectorLayer;