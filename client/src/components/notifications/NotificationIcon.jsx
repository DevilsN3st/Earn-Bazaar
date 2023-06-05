import NotificationBadge, { Effect } from "react-notification-badge";
import { IoSearch, IoNotificationsSharp, IoCaretDown } from "react-icons/io5";

const NotificationIcon = () => {
  return (
    <>
      <NotificationBadge count={0} effect={2} />
      <IoNotificationsSharp color="white" />
    </>
  );
};

export default NotificationIcon;
