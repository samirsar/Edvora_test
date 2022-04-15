// import logo from './logo.svg';
import React, { Component } from 'react'
// import {Button} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar2 from './Components/navbar/Navbar2';
import Homepage from './Components/Homepage/Homepage';


export class App extends Component {
  constructor(props)
  {
    super(props);
    this.state={
      user_station_code:0
    }
  }
  set_station_code=(code)=>{
    this.setState({
      user_station_code:code
    },()=>console.log(this.state))
  
  }
  
  render() {
    return (
      <div>
        <Navbar2 set_station_code={this.set_station_code} />
        {
          (()=>{
             if(this.state.user_station_code!=0)
            return <Homepage station_code={this.state.user_station_code}/>
            
          })()
        }
      </div>
    )
  }
}

export default App
