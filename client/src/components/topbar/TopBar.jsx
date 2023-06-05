import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosBaseURL from "../../pages/httpCommon";
import { Context } from "../../context/Context";
import "./topbar.css";
import logoUrl from "../assets/logo.svg";
import Avatar from "react-avatar";
import { LinkContainer } from "react-router-bootstrap";
// import Container from "react-bootstrap/esm/Container";
// import Row from "react-bootstrap/esm/Row";
// import Col from "react-bootstrap/esm/Col";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import NotificationIcon from "../notifications/NotificationIcon";

export default function TopBar() {
  const { user, token, dispatch } = useContext(Context);
  const [notifications, setNotifications] = useState([]);
  // const PF = `${process.env.REACT_APP_AXIOS_BASEURL}/images/` || "http://localhost:5000/images/";

  useEffect(() => { 
    const getNotifications = async () => {  
      const res = await axiosBaseURL.get(`/notifications/${user._id}`);
      setNotifications(res.data);

    };
    if(token !== null)getNotifications();
  }, [token, user]);

  console.log(notifications);
  console.log(token);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    console.log("logout")
  };
  return (
    <div className="top">
      <Navbar
        sticky="top"
        collapseOnSelect
        expand="sm"
        bg="dark"
        variant="dark"
        className="nav-sm"
        height="30"
      >
        <LinkContainer to="/">
          <Navbar.Brand>
            EarnBazaar
            <img
              alt=""
              src={logoUrl}
              width="35"
              height="35"
              className="d-inline-block align-top"
            />{" "}
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto topCenter topList">
            <LinkContainer to="/home">
              <Nav.Link className="topListItem">HOME</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/write">
              <Nav.Link className="topListItem">WRITE</Nav.Link>
            </LinkContainer>
            {!user && (
              <LinkContainer to="/login">
                <Nav.Link className="topListItem">LOGIN</Nav.Link>
              </LinkContainer>
            )}
            {!user && (
              <LinkContainer to="/register">
                <Nav.Link className="topListItem">REGISTER</Nav.Link>
              </LinkContainer>
            )}
            {user && (
              <LinkContainer to="/messenger">
                <Nav.Link className="topListItem">MESSAGE</Nav.Link>
              </LinkContainer>
            )}
          </Nav>

          <Nav className="topRight">
            {user && (
              <>
                <NavDropdown
                  title={<NotificationIcon />}
                  id="collasible-nav-dropdown"
                >
                  {notifications?.map((notification) => (
                    <NavDropdown.Item key={notification._id} >
                      received a messsage from {notification.userFrom} at {notification.updatedAt}
                    </NavDropdown.Item>
                  ))}
                    <NavDropdown.Item >
                      Clear notifications
                    </NavDropdown.Item>
                </NavDropdown>
                
                <NavDropdown title={"Profile"} id="collasible-nav-dropdown">
                  <NavDropdown.Item>
                    <Link to="/settings" className="txt-dec">
                      <Avatar
                        className="avatar"
                        color={Avatar.getRandomColor("sitebase")}
                        size="35"
                        name={user.username}
                        round={true}
                      />{" "}
                      {user.username}
                    </Link>
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    LOGOUT
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}
