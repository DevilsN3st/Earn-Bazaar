import React from 'react';
import Container from 'react-bootstrap/Container';

import VideoPlayer from './components/VideoPlayer';
import Sidebar from './components/Sidebar';
import Notifications from './components/Notifications';


const VideoChat = () => {

  return (
    <div >
      <Container>
        <h1 className='display-3'>Video Chat</h1>
      </Container>
      <VideoPlayer />
      <Sidebar>
        <Notifications />
      </Sidebar>
    </div>
  );
};

export default VideoChat;
