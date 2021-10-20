import ParcelIDForm from "./ParcelIDForm";

function Panel(props) {
    return (
        <div className={"panel"}>
            <ParcelIDForm {...props} />
        </div>
    )
}

export default Panel;