import { useContext, useEffect, useState } from "react";
import "./write.css";
import axios from "axios";
import { Context } from "../../context/Context";
import DatePicker from "react-date-picker";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axiosBaseURL, { writePost } from "../httpCommon";
import DefaultMap from "../../components/location/DefaultMap";
import Button from "react-bootstrap/esm/Button";

export default function Write() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [reward, setReward] = useState("");
  const [guest, setGuest] = useState("");
  const [desc, setDesc] = useState("");
  const [fileImg, setFileImg] = useState(null);
  const [filePdf, setFilePdf] = useState(null);
  const { user } = useContext(Context);
  const [value, onChange] = useState(new Date());
  const [coordinates, setCoordinates] = useState();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (location) {
      const navCoordinates = {
        longitude: location.coords.longitude,
        latitude: location.coords.latitude,
      };
      setCoordinates(navCoordinates);
    });
    // console.log("write", coordinates)
  }, [navigator.geolocation]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPost = {
      username: user.username,
      userCategory: user.userCategory,
      title,
      desc,
      location,
      category,
      reward,
      guest,
    };
    if( coordinates.latitude && coordinates.longitude ){
      newPost.coords = coordinates;
    }
    if (fileImg) {
      const dataImg = new FormData();
      const fileNameImg = Date.now() + fileImg.name;
      dataImg.append("name", fileNameImg);
      dataImg.append("file", fileImg);
      newPost.photo = fileNameImg;
      try {
        await axiosBaseURL.post("/upload/images", dataImg);
      } catch (err) {}
    }
    if (filePdf) {
      const dataPdf = new FormData();
      const fileNamePdf = Date.now() + filePdf.name;
      dataPdf.append("name", fileNamePdf);
      dataPdf.append("file", filePdf);
      newPost.brochure = fileNamePdf;
      try {
        await axiosBaseURL.post("/upload/pdfs", dataPdf);
      } catch (err) {}
    }
    try {
      const res = await writePost(newPost);
      window.location.replace("/post/" + res.data._id);
    } catch (err) {}
  };
  return (
    <div className="write">
      {fileImg && (
        <img className="writeImg" src={URL.createObjectURL(fileImg)} alt="" />
      )}
      <form className="writeForm" onSubmit={handleSubmit}>
        <div className="writeFormGroup">
          <label htmlFor="fileInput">
            <i className="writeIcon fas fa-plus"></i>
          </label>
          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            onChange={(e) => setFileImg(e.target.files[0])}
          />
          <input
            type="text"
            placeholder="Event Title"
            className="writeInput"
            autoFocus={true}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="writeFormGroup">
          <label htmlFor="fileInputPdf">
            <i className="writeIcon fas fa-plus"></i>
          </label>
          <input
            type="file"
            id="fileInputPdf"
            style={{ display: "none" }}
            onChange={(e) => setFilePdf(e.target.files[0])}
          />
          {!filePdf ? (
            <div className="writeInput">Upload your Brochure here!</div>
          ) : (
            <a className="writeInput" href={URL.createObjectURL(filePdf)}>
              Uploaded Pdf
            </a>
          )}
        </div>
        <div className="writeFormGroup">
          <input
            type="text"
            placeholder="Event Location Name"
            className="writeInput"
            autoFocus={true}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="writeFormGroup">
          {coordinates && <DefaultMap coordinates={coordinates} />}
        </div>
        <div className="writeFormGroup">
          <Container>
            <Row>
              <Col sm={12}>
                <Row>
                  <Col sm={3}>
                    Start Date :
                    <DatePicker
                      onChange={onChange}
                      value={value}
                      className="date"
                    />
                  </Col>
                  <Col sm={3}>
                    End Date :
                    <DatePicker
                      onChange={onChange}
                      value={value}
                      className="date"
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </div>
        <div className="writeFormGroup">
          <input
            type="text"
            placeholder="Event Category"
            className="writeInput"
            autoFocus={true}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <div className="writeFormGroup">
          <input
            type="text"
            placeholder="Event Rewards"
            className="writeInput"
            autoFocus={true}
            onChange={(e) => setReward(e.target.value)}
          />
        </div>
        <div className="writeFormGroup">
          <input
            type="text"
            placeholder="Event Guest of Honour"
            className="writeInput"
            autoFocus={true}
            onChange={(e) => setGuest(e.target.value)}
          />
        </div>
        <div className="writeFormGroup">
          <textarea
            placeholder="Tell your story... Why one should sponser you??"
            type="text"
            className="writeInput writeText"
            onChange={(e) => setDesc(e.target.value)}
          ></textarea>
        </div>
        <button className="writeSubmit" type="submit">
          Publish
        </button>
      </form>
    </div>
  );
}
/*
    event name
    event place
    event start date - end date
    event type/cat
    event prizes
    event registrations
    event cheif guest if any
    event logo/poster/banner
    Why anyone should sponser the event/benefits 
    
*/
