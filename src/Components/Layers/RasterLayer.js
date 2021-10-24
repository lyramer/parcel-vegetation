import { useContext, useEffect } from "react";
import MapContext from "../Map/MapContext";
import ImageLayer from "ol/layer/Image";


const RasterLayer = ({ source, style, zIndex = 2}) => {
	const { map } = useContext(MapContext);

	useEffect(() => {
		if (!map) return;

		let imgLayer = new ImageLayer({
			source
		})

		map.addLayer(imgLayer);
		imgLayer.setZIndex(zIndex);

		return () => {
			if (map) {
				map.removeLayer(imgLayer);
			}
		};
	}, [map, source, zIndex]);

	return null;
};

export default RasterLayer;