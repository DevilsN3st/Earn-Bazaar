import {useState, useEffect, useContext} from "react";

import { SocketContext} from "../videoChat/Context";

import { Container, Row, Col, Button, Form } from "react-bootstrap";
import axiosBaseURL from "../httpCommon";
import { Context } from "../../context/Context";
import { Link } from "react-router-dom";


const PostAdvertisment = () => {

  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [locationList, setLocationList] = useState([]);
  const [result, setResult] = useState('');

  const user = useContext(Context).user._id;
  // console.log("user from context",user);

  const { newAdvertisment, setNewAdvertisment, currentLocation, setCurrentLocation, advertismentList, setAdvertismentList, addUserToLocation, removeUserFromLocation, getNewAdInLocation, postNewAdInLocation } = useContext(SocketContext);



  useEffect(() => {
    const getLocations = async () => {
      const data = await axiosBaseURL.get("/location");
      // console.log(data);
      setLocationList(data.data);
    };

    const getPosts = async () => {
      const data = await axiosBaseURL.get(`/posts?userId=${user}`);
      // console.log(data);
      setPosts(data.data);
    };

    getLocations();
    getPosts();
  }, []);
  
  
  const handleSubmit = async () => {
    const newAdvertisment = {
      sender: user,
      post: selectedPost,
      locationId: selectedLocation,
    };
    // console.log(newAdvertisment);
    try {
      const res = await axiosBaseURL.post("/advertisment", newAdvertisment);
      if( user && user._id && selectedLocation ){
        // removeUserFromLocation(user._id, currentLocation);
        addUserToLocation(user._id, currentLocation);
        console.log("user added to location")
      }
      postNewAdInLocation(user, res.data, selectedLocation);
      setResult("Success! Advertisment Posted");
      console.log(res);
    } catch (err) {
      // setResult(err.stri);
      console.log(err);
    }
  };
  

  

  return (
    < >
      <Container className="m-2 p-2">
        <Row >
          {/* <div className="jumbotron"> */}
            <h1 className="display-4">
              Advertise Your post in Your Local Area.
            </h1>
            <p className="lead">
              Here you can advertise your specific events according in the
              locations where your target audience belongs to. You just have to
              select the posts and location to spread awareness for your events.
            </p>
            {/* <hr className="my-4" /> */}
            <p>
              Select the posts and the locations according to your requirement
              below.
            </p>
            <Link to="/advertisments">
              <Button variant="primary">View All the Advertisments</Button>
            </Link>

            <hr className="my-4" />
          {/* </div> */}
        </Row>
        <Row className="justify-content-center">
          <Col sm={8}>
            <p className="lead"> Select the Post which you want to publish </p>
            <Form.Select onChange = { (e) => setSelectedLocation(e.target.value)} aria-label="Default select example">
              <option>Open this select menu</option>
              {locationList.map((location) => {
                return <option key={location._id} value={location._id}>{location.name}</option>;
              })}
            </Form.Select>
            <p className="lead pt-2">
              Select the Location where you want to advertise
            </p>
            <Form.Select onChange={(e) => setSelectedPost(e.target.value)} aria-label="Default select example">
              <option>Open this select menu</option>
              {posts.map((post) => {
                return <option key={post._id} value={post._id}>{post.title}</option>;
              })}
            </Form.Select>
          </Col>
        </Row>
        <Row className="pt-2 justify-content-end">
          <Col sm={4} className="mt-2 pt-2">
            <Button onClick={handleSubmit}> Advertise! </Button>
              {result && <p className="lead pt-2">{result}</p>
              }
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default PostAdvertisment;
