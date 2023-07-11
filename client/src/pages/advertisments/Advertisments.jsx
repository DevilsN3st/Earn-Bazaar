import { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import Post from "../../components/post/Post";

import { Link } from "react-router-dom";

import axiosBaseURL from "../httpCommon";

const Advertisments = () => {
  const [location, setLocation] = useState("");
  const [locationList, setLocationList] = useState([]);
  const [advertismentList, setAdvertismentList] = useState([]);

  useEffect(() => {
    console.log("Advertisments");
    if (location === "") return;
    const getAdvertisments = async () => {
      const data = await axiosBaseURL.get(
        `/advertisment?location=${location}`
      );
        setAdvertismentList(data.data);
      console.log(data);
    };
    getAdvertisments();
  }, [location]);

  useEffect(() => {
    const getLocations = async () => {
      const data = await axiosBaseURL.get("/location");
      console.log(data);
      setLocationList(data.data);
    };
    getLocations();
  }, []);

  return (
    <div>
      <Container className="m-2 p-2">
        <Row>
          {/* <div className="jumbotron"> */}
          <h1 className="display-4">Advertise Your post in Your Local Area.</h1>
          <p className="lead">View All the Advertisments here.</p>
          {/* <hr className="my-4" /> */}
          <Link to="/post-advertisment">
              <Button variant="primary">Post Advertisment</Button>
            </Link>
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
              onChange={(e) => setLocation(e.target.value)}
            >
              <option>Open this select menu</option>
              {locationList.map((location) => {
                return <option key={location._id} value={location._id}>{location.name}</option>;
              })}
            </Form.Select>
          </Col>
        </Row>
        <Row className="m-5 p-2 justify-content-end">
          {advertismentList.map((advertisment) => (
            <Post post={advertisment.post} />
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Advertisments;
