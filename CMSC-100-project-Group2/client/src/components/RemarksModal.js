import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Table  from 'react-bootstrap/Table';

export default function RemarksModal(props) {
    if (props.remarks.length === 0) {
        return (
          <Modal {...props} aria-labelledby="contained-modal-title-vcenter">
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Application Remarks
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="alert alert-info">No remarks available.</div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
          </Modal>
        );
      }

    return (
          <Modal {...props} aria-labelledby="contained-modal-title-vcenter">
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Application Remarks
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="show-grid">
              <Container>
                <Table striped>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Commenter</th>
                      <th>Remark</th>
                    </tr>
                  </thead>
                  <tbody>
                    {props.remarks.map((remark, i) => (
                      <tr key={i}>
                        <td>
                          {new Date(remark.date).toLocaleDateString('en-US', {
                            month: 'long',
                            day: '2-digit',
                            year: 'numeric'
                          })}
                        </td>
                        <td>
                          {remark.commenterFName} {remark.commenterMName} {remark.commenterLName}
                        </td>
                        <td>{remark.remark}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Container>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
          </Modal>
      );}