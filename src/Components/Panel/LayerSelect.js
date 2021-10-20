import React from "react";
import "./panel.css";

class LayerSelect extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        layers: [...props.layers]
      };
    }
  
    handleChange = (event) => {
      let layers = [...this.state.layers];
      layers = layers.map(layer => {
        if (event.target.id == layer.id) {
          layer.display = event.target.checked
        }
        return layer
      })
      this.props.setLayers(layers);
      this.setState({layers});  
    }
  
    render() {
    // console.log(this.props)
      return (
        <form className={"layer-form"} onSubmit={event => event.preventDefault()}>        
          {this.state.layers.map(layer => {
            return CheckBox(layer, this.handleChange)
          })}                         
        </form>
      );
    }
  }

  export default LayerSelect;

function CheckBox(layer, handleChange) {
  return (
    <label key={"checkbox_" + layer.id}>
      {layer.name}
      <input 
          type="checkbox"
          id={layer.id}
          checked={layer.display} 
          onChange={handleChange} 
      />        
    </label>
  )
}