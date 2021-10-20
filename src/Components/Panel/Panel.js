import ParcelIDForm from "./ParcelIDForm";
import LayerSelect from "./LayerSelect";

const Panel = ({children}) => {
    return (
        <div className={"panel"}>
            {children}
        </div>
    );
}

export default Panel;