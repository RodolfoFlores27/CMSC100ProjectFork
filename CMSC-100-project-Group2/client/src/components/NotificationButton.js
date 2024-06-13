import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';

function NotificationButton(props) {
  const {notifIds, student} = props;
  const [show, setShow] = useState(false);

  const [notifications, setNotifications] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const payload = {
      userId: student._id
    }
    const queryString = new URLSearchParams(payload).toString();
    const url = `http://localhost:3001/get-user-notifications?${queryString}`;
    axios.get(url)
    .then((response) => setNotifications(response.data.notifications))
    .catch(err => console.log(err.message));
  }, []);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Notifications
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Notifications</Modal.Title>
        </Modal.Header>
        <Modal.Body>


          {notifications.length === 0 
            ? <p>No notifications!</p>
            : <div>
              {notifications.map((notif, index) => {
                return <p key={index}>{notif.date} {notif.notificationMessage}</p>
              })}
            </div>
          }
          



        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default NotificationButton;