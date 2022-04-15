import React, { Component } from "react";
import homepagecss from "../Css/homepage_css/homepage.module.css";
import {
  Navbar,
  Container,
  Nav,
  Card,
  Image,
  OverlayTrigger,
  Tooltip,
  Button,
  Form
} from "react-bootstrap";
import google_map from "../../images/google_map.jpg";
export class Homepage extends Component {
  
  constructor(props) {
    
  
    super(props);
    this.state = {
      past: [],
      future: [],
      data: [],
      nearest: [],
      station_code: this.props.station_code,
      mp:{},
      state:[],
      search_state:"Default",
      city:[],

      search_city:"Default",
      temp_data:[]
    
    };
    // console.log(this.props.station_code, "him");
  }
  lower_bound = (arr, target) => {
    let res = 1e9;
    // console.log(arr,target);
    let start = 0;
    let end = arr.length - 1;

    while (start <= end) {
      let mid = Math.floor(start + (end - start) / 2);

      if (arr[mid] == target) {
        return arr[mid];
      }

      // console.log(arr[mid],mid);

      if (arr[mid] > target) {
        res = Math.min(res, arr[mid]);

        end = mid - 1;
      } else {
        start = mid + 1;
      }
    }

    return res;
  };
  cmp = (a, b) => {
    // console.log(a,b);
    return a.nearest_code > b.nearest_code ? 1 : -1;
  };

  
  componentDidMount = async () => {
    
    
    let url = "https://assessment.api.vweb.app/rides";

    let response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    let json1 = await response.json();
    // console.log(json1,"Homepage");

    this.setState({
      data: json1,
    });

    let obj = []; // for we will store all nearest ride
    let mp1=new Object();
    let arr1=[];
  
    for (let element of json1) {

      
        if(!mp1[element.state])
        {
          arr1.push(element.state);
          mp1[element.state]=[]

        }
      if(!mp1[element.state].includes(element.city))
        mp1[element.state].push(element.city)
      let arr = element.station_path;
      let target = this.props.station_code;

      let code = this.lower_bound(arr, target);
      let temp_obj = {
        nearest_code: code,
        data: element,
        station_code: this.state.station_code,
      };
      obj.push(temp_obj);
    }

    this.setState({
      mp:mp1,
      state:arr1
    })
    
    obj.sort(this.cmp);
    // console.log(obj, "Nearest");

    this.setState({
      data: obj,
    });

    let first = [],
      second = [];

    let d = new Date("03/30/2022"); // it can be change according to time
    // console.log(d);
    d = d.getTime();

    for (let element of obj) {
      let temp = new Date(element.data.date);
      //  console.log(temp,element.date);
      temp = temp.getTime();

      if (temp >= d) {
        second.push(element);
      } else first.push(element);
    }

    this.setState({
      past: first,
      future: second,
      nearest: obj,
      temp_data:obj
    });
  };
  unpcomingrides = () => {
    // console.log("Shouwing upcoming rides", this.state.future.length);

    this.setState({
      data: this.state.future,
    });
  };
  nearestrides = () => {
    // console.log("showing Nearest rides", this.state.future.length);

    this.setState({
      data: this.state.nearest,
      
    });
  };
  pastrides = () => {
    // console.log("showing past rides", this.state.past.length);
    this.setState({
      data: this.state.past,
    });
  };
ownfilter=(flag)=>{


 this.setState({
   data:this.state.temp_data
 },()=>{

 
  let temp_obj=[];
  // console.log(this.state,"antim hai bhai",flag);

  for(let element of this.state.data)
  {
    if(flag){
    if(this.state.search_state==element.data.state)
    temp_obj.push(element);
    }
    else
    {
      if(this.state.search_city==element.data.city)
      temp_obj.push(element);
    }
  }


  

  this.setState({
    data:temp_obj,
    nearest:temp_obj
  },()=>{
    let first=[];
    let second=[];
    let d = new Date("03/30/2022"); // it can be change according to time
    // console.log(d);
    d = d.getTime();

    for (let element of temp_obj) {
      let temp = new Date(element.data.date);
      //  console.log(temp,element.date);
      temp = temp.getTime();

      if (temp >= d) {
        second.push(element);
      } else first.push(element);
    }

    this.setState({
      past: first,
      future: second,
  
    });
  })

});
}

  changing=(e)=>{
            //  console.log(e.target.value);

             let state1=e.target.value;
             let obj=[];

             for(let element of this.state.mp[state1])
             {
               obj.push(element);
             }

             this.setState({
                  search_state:state1,
                  city:obj
             },()=>{
                  this.ownfilter(1);
             })


          
            


             
  }
  citychanging=(e)=>{
            //  console.log(e.target.value);


             let city1=e.target.value;
             
             this.setState({
                search_city:city1
             },()=>{
               this.ownfilter(0);
             })


             
  }
  render() {
    return (
      <div className={`${homepagecss.body}`}>
        <Navbar bg="" variant="dark">
          <Container>
            <Nav className={`me-auto ${homepagecss.txt}`}>
              <Nav.Link
                href="#home"
                onClick={this.nearestrides}
              >{`Nearest rides`}</Nav.Link>
              <Nav.Link href="#features" onClick={this.unpcomingrides}>
                {`Upcoming rides (${this.state.future.length})`}{" "}
              </Nav.Link>
              <Nav.Link
                href="#pricing"
                onClick={this.pastrides}
              >{`Past rides (${this.state.past.length})`}</Nav.Link>
            </Nav>
            <div className="row">
              <div className="col-4">
                {["bottom"].map((placement) => (
                  <OverlayTrigger
                  trigger="click"
                    key={placement}
                    placement={placement}
                    overlay={
                      <Tooltip id={`tooltip-${placement}`}>
                        <div className="container">
                          <div className={`row ${homepagecss.myrow}`}>
                            
                            <div className="row my-1">
                            <Form.Select className={`${homepagecss.mysearch}`} aria-label="Default select example" value={this.state.search_state}  onChange={this.changing}>
  <option value="default" >State</option>
  {
     this.state.state.map(function(name,key){
       return <option val={1} key={key} id={key}  >{name}</option>
     })
  }
  
</Form.Select>
                            </div>
                            <div className="row my-1">
                            <Form.Select className={`${homepagecss.mysearch}`}  aria-label="Default select example" value={this.state.search_city} onChange={this.citychanging} >
  <option>City</option>
  {
    this.state.city.map(function(name,key){
      return <option val={1} key={key} id={key}  >{name}</option>
    })
  }

</Form.Select>
                            </div>
                            
                          </div>
                        </div>
                      </Tooltip>
                    }
                  >
                    <Button
                      className={`${homepagecss.mybtn}`}
                      variant="secondary"
                    >
                      <svg
                        style={{ color: "red" }}
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        fill="currentColor"
                        className="bi bi-filter-left"
                        viewBox="0 0 16 16"
                      >
                        <path d="M2 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
                      </svg>
                    </Button>
                  </OverlayTrigger>
                ))}
              </div>
              <div className="col-8">
                <Navbar.Brand href="#home">Filters</Navbar.Brand>
                <></>
              </div>
            </div>
          </Container>
        </Navbar>

        <div className="container">
          {(() => {
            if (this.state.data.length == 0) {
              return (
                <div>
                  <h4 style={{ color: "white" }}>Not found any rides</h4>
                </div>
              );
            }
          })()}
          {this.state.data.map(function (name, key) {

            
            return (
              <div key={key} className="row my-3">
                <Card bg="dark" style={{ color: "white" }}>
                  <Card.Body>
                    <div className="row">
                      <div className="col-3">
                        <Image
                          className={`${homepagecss.mg}`}
                           src={google_map} thumbnail={1} />
                           {/* src={name.data.map_url}
                           thumbnail={1}
                          />   */}
                      </div>
                      <div className="col-6">
                        <h6>Ride id:{name.id}</h6>
                        <h6>Origin station:{name.data.origin_station_code}</h6>
                        <h6>Station path:{`[${name.data.station_path}]`}</h6>
                        <h6>Date:{name.data.date}</h6>

                        <h6>
                          Distance:{name.nearest_code - name.station_code}
                        </h6>
                      </div>
                      <div className={`col-3`}>
                        <div className="row">
                          <div className="col-6">
                            <div className={`row ${homepagecss.button}`}>
                              <button className="btn-dark btn">
                                City Name
                              </button>
                            </div>
                            <div className="row">
                              <button
                                className={`btn btn-dark ${homepagecss.cursor}`}
                              >
                                {name.data.city}
                              </button>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className={`row ${homepagecss.button}`}>
                              <button className="btn-dark btn">
                                State Name
                              </button>
                            </div>
                            <div className="row">
                              <button
                                className={`btn btn-dark ${homepagecss.cursor}`}
                              >
                                {name.data.state}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Homepage;
