import React, { Component } from 'react'
import { Navbar,Container,Image } from 'react-bootstrap'
import logo from '../../images/man-profile-cartoon_18591-58482.webp'
var t=0;
export class Navbar2 extends Component {
    constructor(props)
    {
      super(props);
      this.state={
        user:{}
      }
    
    
    }
    componentDidMount=async()=>{
    
      if(t==0){
        console.log(t);
        t++;
      let url="https://assessment.api.vweb.app/user";
      let response = await fetch(url);
      let json1 = await response.json();
    console.log(json1,"Navbar");

    this.setState({
      user:json1
    },()=>{
      this.props.set_station_code(this.state.user.station_code);
    })
  }
  
    }
    render() {
      
        return (
            <div>
                <Navbar bg="dark" variant="dark">
    <Container>
      <Navbar.Brand href="#home">
        {' '}
      Edvora
      </Navbar.Brand>
      <Navbar.Brand  className='d-flex justify-content-center'>
      <h5 style={{color:'white'}}>{this.state.user.name}</h5>
      <Image
      alt=""
      width="30"
      height="30"
      src={this.state.user.url}
      className="d-inline-block align-top"
      roundedCircle={1}
      />
      </Navbar.Brand>
    </Container>
  </Navbar>
            </div>
        )
    }
}

export default Navbar2
