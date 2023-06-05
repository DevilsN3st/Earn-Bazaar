import React, { useState, useContext, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';

import { CopyToClipboard } from 'react-copy-to-clipboard';

import { SocketContext } from '../Context';


const Sidebar = ({ userName, friendId }) => {
  const { me, callAccepted, setName, callEnded, leaveCall, callUser } = useContext(SocketContext);
  const [idToCall, setIdToCall] = useState('');

  useEffect(() => { 
    setName(userName); 
  }, [userName]);

  // console.log(userName);  

  return (
    <Container >
      <Container>
        <form noValidate autoComplete="off">
          <Row container >
            <Row item xs={1} md={1} >
              <h1 className='display-6' >{userName}
              </h1>
              {/* <CopyToClipboard text={me} >
                <Button variant="primary" >
                  Copy Your ID
                </Button>
              </CopyToClipboard> */}
            </Row>
            <Row item xs={1} md={1} >
              <h1 className='display-6' >Make a call</h1>
              {/* <input label="ID to call" value={idToCall} onChange={(e) => setIdToCall(e.target.value)} /> */}
              {callAccepted && !callEnded ? (
                <Button onClick={leaveCall}>
                  Hang Up
                </Button>
              ) : (
                <Button onClick={() => callUser(friendId)} >
                  Call
                </Button>
              )}
            </Row>
          </Row>
        </form>
      </Container>
    </Container>
  );
};

export default Sidebar;
