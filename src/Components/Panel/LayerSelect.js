import React from "react";
import "./panel.css";

class LayerSelect extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        values: {...props.layers}
      };
      this.handleChange = this.handleChange.bind(this);
    }
  
    handleChange(event) {
      let values = this.state.values;
      values[event.target.id] = event.target.checked;
      this.props.toggleLayer(event.target.id);
      this.setState({values});  
    }
  
    render() {
    // console.log(this.props)
      return (
        <form className={"layer-form"} onSubmit={event => event.preventDefault()}>        
            <label>
                Layer 1
                <input 
                    type="checkbox"
                    id="layer1"
                    checked={this.state.values.layer1} 
                    onChange={this.handleChange} 
                />        
            </label>
            <label>
                Layer 2
                <input 
                    type="checkbox"
                    id="layer2"
                    checked={this.state.values.layer2} 
                    onChange={this.handleChange} 
                />        
            </label>
            <label>
                Layer 3
                <input 
                    type="checkbox"
                    id="layer3"
                    checked={this.state.values.layer3} 
                    onChange={this.handleChange} 
                />        
            </label>                                    
        </form>
      );
    }
  }

  export default LayerSelect;