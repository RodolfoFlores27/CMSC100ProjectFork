import './approverpage.css';
import Cookies from "universal-cookie";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { Dropdown, DropdownButton } from "react-bootstrap";
import RemarksModal from '../../components/RemarksModal';
import ApproverSearchBar from '../../components/ApproverSearchBar';
import ShowUserData from '../../components/showUserData';

export default function Approver() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");
  const [approver, setApprover] = useState(null); // user object
  const [advisees, setAdvisees] = useState([]); // array of users
  const [applications, setApplications] = useState([]); // changes frequently
  const [baseApplications, setBaseApplications] = useState([]); // constant, will be used for filtering and searching
  const RedirectingMessage = () => (
    <p className="text-muted mt-3">Redirecting to login shortly...</p>
  );
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Users setup
        const usersResponse = await axios.get("http://localhost:3001/get-all-users");
        const users = usersResponse.data.users;
  
        // set logged approver based on email item
        const approver = users.find((user) => user.email === email && user.userType === "Adviser");
        setApprover(approver);
  
        // set students who are advisees of the approver
        const advisees = users.filter((student) => student.adviser === approver._id);
        setAdvisees(advisees);
  
        const adviseeIds = advisees.map((advisee) => advisee._id); // will be used for only getting applications of advisees
  
        // Applications setup
        const applicationsResponse = await axios.get("http://localhost:3001/get-all-applications");
        const applications = applicationsResponse.data;
  
        // get all applications of students under logged adviser
        const filteredApplications = applications.filter((application) => {
          return application.status === "Pending" && application.step === 1 && adviseeIds.includes(application.studentId);
        });
  
        setApplications(filteredApplications);
        setBaseApplications([...filteredApplications]);
  
        console.log("Applications: ", filteredApplications);
        console.log("Approver: ", approver);
      } catch (error) {
        console.error("Error:", error);
      }
    };
  
    fetchData();
  }, [email]);
  useEffect(() => {
    const redirectTimeout = setTimeout(() => {
      if (!approver) {
        navigate("/login"); // Replace "/login" with your login page route
      }
    }, 3000); // Adjust the timeout value (in milliseconds) as needed

    return () => clearTimeout(redirectTimeout);
  }, [approver, navigate]);


  // Application select
  const [selectedRow, setSelectedRow] = useState(-1);
  const handleRowClick = (rowIndex, event) => {
    setSelectedRow(rowIndex);
  };

  // Application Remarks
  const [showRemarks, setShowRemarks] = useState(false);
  const handleShowRemarks = () => {
    if (selectedRow === -1) {
      alert("Please select an application.")
    } else {
      setShowRemarks(true);
    }
  };

  // Application approve
  const handleApproveClick = async (event) => {
    if (selectedRow === -1) {
      alert("Please select an application.");
    } else {
      alert("Application approved");

      try {
        // Update step
        await axios.post("http://localhost:3001/edit-application-step", {
          applicationId: applications[selectedRow]._id,
          step: 2,
          userId: applications[selectedRow].studentId,
          notificationMessage: `Your application to ${approver.firstName} ${approver.middleName} ${approver.lastName} has been updated.`,
        });

        // Update viewable applications for logged adviser
        const updatedApplications = applications.filter((application) => application._id !== applications[selectedRow]._id);
        setApplications(updatedApplications);
        setSelectedRow(-1);
      } catch (error) {
        console.log(error);
      }
    }
  };

  // For return button functionality
  const [isReturnClicked, setIsReturnClicked] = useState(false);
  const handleReturnClick = () => {
    if (selectedRow === -1) {
      alert("Please select an application.")
    } else {
      setIsReturnClicked(!isReturnClicked);
    }
  };

  // Returning applications with remarks
  const [remarksValue, setRemarksValue] = useState('');
  const handleReturnWithRemarks = async (event) => {
    event.preventDefault();

    if (remarksValue.trim() === "") {
      alert("Please provide a valid remark.");
    } else {
      const selectedApplication = applications[selectedRow];
      alert("Application returned with remarks");

      try {
        await axios.post("http://localhost:3001/edit-application-status", {
          applicationId: selectedApplication._id,
          status: "Open",
          notificationMessage: `Your application to ${approver.firstName} ${approver.middleName} ${approver.lastName} has been returned.`,
        });

        await axios.post("http://localhost:3001/add-remarks-to-application", {
          applicationId: selectedApplication._id,
          remark: remarksValue,
          commenterId: approver._id,
          commenterFName: approver.firstName,
          commenterMName: approver.middleName,
          commenterLName: approver.lastName,
        });

        // set applications without the returned application
        const updatedApplications = applications.filter((application) => application._id !== selectedApplication._id);
        setApplications(updatedApplications);
        setSelectedRow(-1);
      } catch (error) {
        console.log(error);
      }

      // Reset textbox
      setRemarksValue('');
      setIsReturnClicked(false);
    }
  };

  const handleSortByName = (event, order) => {
    event.preventDefault();

    const tempApplications = [...applications]
    
    tempApplications.sort((a, b) => {
      const studentA = advisees.find((student) => student._id === a.studentId);
      const studentB = advisees.find((student) => student._id === b.studentId);
      
      // Extract student names
      const nameA = `${studentA.firstName} ${studentA.middleName} ${studentA.lastName}`;
      const nameB = `${studentB.firstName} ${studentB.middleName} ${studentB.lastName}`;
    
      // Compare student names and return the sorting order
      if (order === "A-Z") { 
        if (nameA < nameB) {
        return -1; // nameA comes before nameB
        } else if (nameA > nameB) {
          return 1; // nameA comes after nameB
        }
        return 0; // names are equal 
      } 

      else if (order === "Z-A") {
        if (nameA > nameB) {
          return -1; // nameA comes after nameB
          } else if (nameA < nameB) {
            return 1; // nameA comes before nameB
          }
          return 0; // names are equal 
        } 
      return 0; // optional
    });
    setApplications(tempApplications)
  }

  const handleSortByDate = (event, order) => {
    event.preventDefault();

    const tempApplications = [...applications]

    tempApplications.sort((a, b) => {
      // Extract application dates
      const dateA = a.studentSubmission.date;
      const dateB = b.studentSubmission.date;
    
      // Compare application dates and return the sorting order
      if (order === "Newest") { 
        if (dateA > dateB) {
        return -1; // nameA comes before nameB
        } else if (dateA > dateB) {
          return 1; // nameA comes after nameB
        }
        return 0; // names are equal 
      } 

      else if (order === "Oldest") {
        if (dateA < dateB) {
          return -1; // nameA comes after nameB
          } else if (dateA < dateB) {
            return 1; // nameA comes before nameB
          }
          return 0; // names are equal 
        } 
      return 0; // optional
    });
    
    setApplications(tempApplications)
  }

  const [filterOptions, setFilterOptions] = useState([]);
  const handleFilter = (event, filterOption) => {
    // add filterOption
    if (event.target.checked) {
      setFilterOptions([...filterOptions, filterOption]);

    // remove filterOption
    } else {
      setFilterOptions(filterOptions.filter((item) => item !== filterOption));
    }
  };

  const [searchedApplications, setSearchedApplications] = useState([]);
  
  // useEffect for filterOptions changes
  useEffect(() => {
    // baseApplications === applications collected at the beginning

    let filters = [...filterOptions];
    let filteredApplications = [];
  
    console.log("Base applications: ", baseApplications);
    console.log("Filters: ", filters);
    console.log("Searched applications: ", searchedApplications);
  
    // return to original <= no filters, no searches
    if (filters.length === 0 && searchedApplications.length === 0) {
      // previous list was empty
      if (applications.length === 0) {
        filteredApplications = []
      }
      else {
        filteredApplications = baseApplications;
      }
    }

    // show searched applications, no filtrations
    else if (filters.length === 0 && searchedApplications.length !== 0) {
      filteredApplications = searchedApplications;
    } 
    
    // filter through baseApplications
    else if (filters.length !== 0 && searchedApplications.length === 0) {
      // previous list was empty
      if (applications.length === 0) {
        filteredApplications = []
      }
      else {
        filteredApplications = baseApplications.filter((application) => {
          return filters.includes(application.step) || filters.includes(application.status);
        });
      }
    }

    // filter through searched applications
    else if (filters.length !== 0 && searchedApplications.length !== 0) {
      filteredApplications = searchedApplications.filter((application) => {
        return filters.includes(application.step) || filters.includes(application.status);
      });
    }
    
    setApplications(filteredApplications);
  }, [filterOptions, searchedApplications]);

  const handleSearch = (searchedData) => {
    console.log("LOGGING SEARCH INFORMATION")

    console.log("Applications: ", applications)

    console.log("Data in handleSearch: ", searchedData)
    console.log("Advisees in handleSearch: ", advisees)

    const searchedDataIds = searchedData.map((object) => object.id)
    console.log("Searched Data Ids: ", searchedDataIds)

    const searchedApplications = baseApplications.filter((application) => {return searchedDataIds.includes(application.studentId)})

    setSearchedApplications(searchedApplications)
    console.log("Searched Applications: ", searchedApplications)

    console.log("END OF SEARCH INFORMATION")

    setApplications(searchedApplications); // Update applications array with filtered data
    };

  // Setup adviseeData
  const [adviseeData, setAdviseeData] = useState([])
  useEffect(() => {
    const adviseeDataHere = advisees.map((advisee) => ({
      id: advisee._id,
      name: advisee.firstName + " " + advisee.middleName + " " + advisee.lastName,
      studentNumber: advisee.studentNumber
    }));
    setAdviseeData(adviseeDataHere)
  }, [advisees]);

  console.log('adviseeData:', adviseeData);

  return (
    <Container>
      {approver ? (
        <>
          <Row className="mt-3">
          <ShowUserData />
          </Row>

          <Row>
            <ApproverSearchBar 
              data={adviseeData} 
              searchBy={["name", "studentNumber"]}
              onSearch={(searchedData) => handleSearch(searchedData)}>
            </ApproverSearchBar>
          </Row>

          <Row>
            <Col>
              <Row className="mb-3">
                  <DropdownButton title="Sort by Name" variant="secondary" size="lg">
                    <Dropdown.Item onClick={(event) => handleSortByName(event, "A-Z")}>A-Z</Dropdown.Item>
                    <Dropdown.Item onClick={(event) => handleSortByName(event, "Z-A")}>Z-A</Dropdown.Item>
                  </DropdownButton>
              </Row>

              <Row className="mb-3">
                <DropdownButton title="Sort by Date" variant="secondary" size="lg">
                  <Dropdown.Item onClick={(event) => handleSortByDate(event, "Newest")}>Newest</Dropdown.Item>
                  <Dropdown.Item onClick={(event) => handleSortByDate(event, "Oldest")}>Oldest</Dropdown.Item>
                </DropdownButton>
              </Row>
            </Col>

            <Col>
            <Form>
              <Form.Group controlId="stepsToFilter">
                <Form.Label style={{ fontSize: '20px', color:'white' ,backgroundColor:"#8D1436", borderRadius:"5px", padding:"4px"}}>Filter By Step</Form.Label>
                <Form.Check
                  type="checkbox"
                  id="step1"  
                  label="Step 1"
                  checked={filterOptions.includes(1)}
                  onChange={(event) => handleFilter(event, 1)}
                />
                <Form.Check
                  type="checkbox"
                  id="step2"
                  label="Step 2"
                  checked={filterOptions.includes(2)}
                  onChange={(event) => handleFilter(event, 2)}
                />
                <Form.Check
                  type="checkbox"
                  id="step3"
                  label="Step 3"
                  checked={filterOptions.includes(3)}
                  onChange={(event) => handleFilter(event, 3)}
                />
              </Form.Group>
            </Form>
            </Col>

            <Col>
            <Form>
              <Form.Group controlId="statusToFilter">
                <Form.Label style={{ fontSize: '20px', color:'white' ,backgroundColor:"#8D1436", borderRadius:"5px", padding:"4px"}}>Filter By Status</Form.Label>
                <Form.Check
                  type="checkbox"
                  id="status1"
                  label="Open"
                  checked={filterOptions.includes("Open")}
                  onChange={(event) => handleFilter(event, "Open")}
                />
                <Form.Check
                  type="checkbox"
                  id="status2"
                  label="Pending"
                  checked={filterOptions.includes("Pending")}
                  onChange={(event) => handleFilter(event, "Pending")}
                />
                <Form.Check
                  type="checkbox"
                  id="status3"
                  label="Closed"
                  checked={filterOptions.includes("Closed")}
                  onChange={(event) => handleFilter(event, "Closed")}
                />
                <Form.Check
                  type="checkbox"
                  id="status4"
                  label="Cleared"
                  checked={filterOptions.includes("Cleared")}
                  onChange={(event) => handleFilter(event, "Cleared")}
                />
              </Form.Group>
            </Form>
            </Col>
          </Row>

          <Row>
            <Row className="m-4 text-center">
              <h1>STUDENT APPLICATIONS</h1>
            </Row>
            
            <div style={{height: '200px', overflowY: 'auto'}}>
            <Table striped>  
              <thead style={{position: 'sticky', top: '0', backgroundColor: '#fff'}}>
                <tr>
                  <th>Name</th>
                  <th>Student Number</th>
                  <th>Date</th>
                  <th>Submission Link</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application, i) => {
                  const student = advisees.find((student) => student._id === application.studentId);
                  return (
                    <tr key={application._id} className={selectedRow === i ? "selected-row" : ""} onClick={(event) => handleRowClick(i, event)}>
                      <td>{student.firstName} {student.middleName} {student.lastName}</td>
                      <td>{student.studentNumber}</td>
                      <td>{new Date(application.studentSubmission.date).toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' })}</td>
                      <td>{application.studentSubmission.link}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            </div>
          </Row>

          <Row className="ml-auto float-end">
            <ButtonToolbar aria-label="Toolbar with button groups">
              <ButtonGroup className="me-2" aria-label="Third group">
                <Button variant="info" id="show-remarks-button" onClick={handleShowRemarks}>Show Remarks</Button>
              </ButtonGroup>
              <ButtonGroup className="me-2" aria-label="First group">
                <Button variant="secondary" id="return-button" onClick={handleReturnClick}>Return</Button>
              </ButtonGroup>
              <ButtonGroup className="me-2" aria-label="Second group">
                <Button variant="success" id="approve-button" onClick={handleApproveClick}>Approve</Button>
              </ButtonGroup>
            </ButtonToolbar>
          </Row>

          <RemarksModal
            show={showRemarks}
            onHide={() => setShowRemarks(false)}
            remarks={selectedRow !== -1 ? applications[selectedRow]?.remarks || [] : []}
          />

          {isReturnClicked && (
            <Row>
              <Form>
                <Form.Group className="mb-3" controlId="formRemarks">
                  <Form.Label>Remarks</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter remarks here."
                    value={remarksValue}
                    onChange={(event) => setRemarksValue(event.target.value)}
                  />
                </Form.Group>
                <Button className="me-2" variant="secondary" onClick={handleReturnClick}>Cancel</Button>
                <Button className="me-2" variant="primary" type="submit" onClick={handleReturnWithRemarks}>
                  Submit
                </Button>
              </Form>
            </Row>
          )}
        </>
      ) : (
        <Container className="d-flex flex-column align-items-center justify-content-center mt-5">
          <h5 className="text-danger">Authorization Error</h5>
          <RedirectingMessage />
        </Container>
      )}
    </Container>
  );
}