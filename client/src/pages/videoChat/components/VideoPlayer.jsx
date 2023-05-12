import React, { useContext } from 'react';

import { SocketContext } from '../Context';
import Row from 'react-bootstrap/esm/Row';
import Container from 'react-bootstrap/esm/Container';

const VideoPlayer = () => {
  const { name, callAccepted, myVideo, userVideo, callEnded, stream, call } = useContext(SocketContext);

  return (
    <Container>
      {stream && (
        <Container>
          <Row xs={10}>
            <h1 className='display-6'>{name || 'Name'}</h1>
            <video playsInline muted ref={myVideo} autoPlay />
          </Row>
        </Container>
      )}
      {callAccepted && !callEnded && (
        <Container>
          <Row  xs={10}>
            <h1 className='display-6'>{call.name || 'Name'}</h1>
            <video playsInline ref={userVideo} autoPlay  />
          </Row>
        </Container>
      )}
    </Container>
  );
};

export default VideoPlayer;
