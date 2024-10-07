import React, { useState, useEffect } from "react";
import axios from "axios";
import Nav from "../components/Nav";
import notif from "../styles/Notifications.module.css";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/loading.json";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [accepted, setAccepted] = useState({});
  const [isloading, setIsloading] = useState(false);

  const handleAccept = async (id) => {
    try {
      const res = await axios.post(
        `/api/accept/${id}`,
        {},
        { withCredentials: true }
      );
      if (res.data.mssg === "Already friends" || res.data.friend === "yes") {
        setAccepted((prevAccepted) => ({
          ...prevAccepted,
          [id]: true,
        }));
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsloading(true);
      try {
        const res = await axios.get("/api/notifications", {
          withCredentials: true,
        });
        setNotifications(res.data);
        const initialAcceptedStatus = res.data.reduce((acc, notif) => {
          acc[notif.sender._id] = notif.isaccepted || false;
          return acc;
        }, {});
        setAccepted(initialAcceptedStatus);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setIsloading(false);
      }
    };
    fetchNotifications();
  }, []); // Use an empty dependency array to run only on mount

  return (
    <>
      <div className={notif.notifications}>
        {isloading ? (
           <Lottie animationData={loadingAnimation} loop />
        ) : notifications.length === 0 ? (
          <p>No notifications</p>
        ) : (
          <ul>
            {notifications.map((notifi) => (
              <li key={notifi._id} className={notif.notif}>
                <img
                  src={notifi.sender.profilepic?.url || "default_image.png"}
                  alt="Notification"
                />
                <div className={notif.notifContent}>
                  <h5>
                    {new Date(notifi.createdAt).toDateString()}
                    &nbsp;&nbsp;&nbsp;
                    {new Date(notifi.createdAt).toLocaleTimeString()}
                  </h5>

                  {notifi.type === "follow" && (
                    <div className={notif.follow}>
                      <p>{notifi.sender.fullname} sent you a Friend Request</p>
                      {accepted[notifi.sender._id] ? (
                        <p>Already friends</p>
                      ) : (
                        <button
                          onClick={() => handleAccept(notifi.sender._id)}
                          disabled={accepted[notifi.sender._id]}
                        >
                          {accepted[notifi.sender._id] ? "Accepted" : "Accept"}
                        </button>
                      )}
                    </div>
                  )}

                  {notifi.type === "like" && (
                    <div className={notif.like}>
                      <p>{notifi.message}</p>
                    </div>
                  )}

                  {notifi.type === "comment" && (
                    <div className={notif.comment}>
                      <p>{notifi.message}</p>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Nav />
    </>
  );
}
