import React, { useState, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';

import { CopyToClipboard } from 'react-copy-to-clipboard';

import { SocketContext } from '../Context';


const Sidebar = ({ children }) => {
  const { me, callAccepted, name, setName, callEnded, leaveCall, callUser } = useContext(SocketContext);
  const [idToCall, setIdToCall] = useState('');

  return (
    <Container >
      <Container>
        <form noValidate autoComplete="off">
          <Row container >
            <Row item xs={1} md={1} >
              <h1 className='display-6' >Account Info</h1>
              <input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
              <CopyToClipboard text={me} >
                <Button variant="primary" >
                  Copy Your ID
                </Button>
              </CopyToClipboard>
            </Row>
            <Row item xs={1} md={1} >
              <h1 className='display-6' >Make a call</h1>
              <input label="ID to call" value={idToCall} onChange={(e) => setIdToCall(e.target.value)} />
              {callAccepted && !callEnded ? (
                <Button onClick={leaveCall}>
                  Hang Up
                </Button>
              ) : (
                <Button onClick={() => callUser(idToCall)} >
                  Call
                </Button>
              )}
            </Row>
          </Row>
        </form>
        {children}
      </Container>
    </Container>
  );
};

export default Sidebar;
