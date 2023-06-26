import NotificationBadge, { Effect } from "react-notification-badge";
import { IoNotificationsSharp,  } from "react-icons/io5";

const NotificationIcon = ({notificationCount}) => {
  
  return (
    <>
      <NotificationBadge count={notificationCount} effect={Effect.SCALE} />
      <IoNotificationsSharp color="white" />
    </>
  );
};

export default NotificationIcon;
