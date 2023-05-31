import React from 'react';
import Container from 'react-bootstrap/Container';

import VideoPlayer from './components/VideoPlayer';
import Sidebar from './components/Sidebar';
import Notifications from './components/Notifications';


const VideoChat = ( props ) => {

  // console.log("videochat",props);

  return (
    <div >
      <Container>
        <h1 className='display-3'>Video Chat</h1>
      </Container>
      <VideoPlayer />
      <Sidebar friendId={props.friendId} userName={props?.userName} />
        <Notifications />
    </div>
  );
};

export default VideoChat;
