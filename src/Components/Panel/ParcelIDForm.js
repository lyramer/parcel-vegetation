import React from "react";

class ParcelIDForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {value: ''};
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event) {this.setState({value: event.target.value});  }
    handleSubmit(event) {
        console.log('An ID was submitted: ' + this.state.value);
        this.props.queryParcel(this.state.value);
        event.preventDefault();
    }
  
    render() {
    // console.log(this.props)
      return (
        <form className={"parcel-form"} onSubmit={this.handleSubmit}>        
            <label>
                <input 
                    type="text" 
                    value={this.state.value} 
                    onChange={this.handleChange} 
                    placeholder={"Parcel ID"}
                />        
            </label>
            <input type="submit" value="Search" />
        </form>
      );
    }
  }

  export default ParcelIDForm;