import { useState, useEffect, useContext } from "react";
import { SocketContext} from "../videoChat/Context";
import { Context } from "../../context/Context";
import { Container, Row, Col, Button, Form } from "react-bootstrap";

import Post from "../../components/post/Post";

import { Link } from "react-router-dom";

import axiosBaseURL from "../httpCommon";

const Advertisments = () => {
  // const [location, setLocation] = useState("");
  const [locationList, setLocationList] = useState([]);
  const [list, setList] = useState([]);
  // const [advertismentList, setAdvertismentList] = useState([]);
  const { user } = useContext(Context);
  const { getNewAdInLocation, newAdvertisment, setNewAdvertisment, currentLocation, setCurrentLocation, advertismentList, setAdvertismentList, addUserToLocation, removeUserFromLocation } = useContext(SocketContext);

  useEffect(() => {
    console.log("Advertisments");
    if (currentLocation === "") return;
    const getAdvertisments = async () => {
      const data = await axiosBaseURL.get(
        `/advertisment?location=${currentLocation}`
      );
        setAdvertismentList(data.data);
        setList(data.data);
      console.log(data);
    };
    getAdvertisments();
    if( user && user._id && currentLocation ){
      removeUserFromLocation(user._id, currentLocation);
      addUserToLocation(user._id, currentLocation);
    }
    getNewAdInLocation(currentLocation);
  }, [currentLocation]);

  useEffect(() => {
    const getLocations = async () => {
      const data = await axiosBaseURL.get("/location");
      console.log(data);
      setLocationList(data.data);
    };
    getLocations();
    getNewAdInLocation();
  }, []);

  useEffect(() => {
    setList(advertismentList);    
  }, [advertismentList]);

  // useEffect(() => {
  //   console.log("Advertisments");
  //   if (currentLocation === "") return; 
  //   if (newAdvertisment.location === currentLocation) {
  //     setAdvertismentList((prev) => [...prev, newAdvertisment]);
  //   }
  // }, [newAdvertisment, currentLocation]);

console.log("advertismentList", advertismentList);
  return (
    <div>
      <Container className="m-2 p-2">
        <Row>
          {/* <div className="jumbotron"> */}
          <h1 className="display-4">Advertise Your post in Your Local Area.</h1>
          <p className="lead">View All the Advertisments here.</p>
          {/* <hr className="my-4" /> */}
          {user && <Link to="/post-advertisment">
              <Button variant="primary">Post Advertisment</Button>
            </Link>}
          <hr className="my-4" />
            
          {/* </div> */}
        </Row>
        <Row className="justify-content-center">
          <Col sm={8}>
            <p className="lead pt-2">
              Select the Location of where you want to view all the
              advertisements
            </p>
            <Form.Select
              aria-label="Default select example"
              onChange={(e) => setCurrentLocation(e.target.value)}
            >
              <option>Open this select menu</option>
              {locationList.map((location) => {
                return <option key={location._id} value={location._id}>{location.name}</option>;
              })}
            </Form.Select>
          </Col>
        </Row>
        {!user && <Row className="justify-content-center">
          For Real Time updates you need to login.
        </Row>}
        <Row className="m-5 p-2 justify-content-end">
          {list?.map((advertisment) => (
            <Post key={advertisment._id} post={advertisment.post} />
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Advertisments;
