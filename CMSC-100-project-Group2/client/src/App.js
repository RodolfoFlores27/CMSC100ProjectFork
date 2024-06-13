import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import Login from './pages/Login/Login.js';
import Register from './pages/Register/Register.js';
import Dashboard from './pages/Dashboard/Dashboard.js';
import NavBar from './components/Navbar.js';
import Student from './pages/Login/studentpage.js';
import Approver from './pages/Login/approverpage.js';
import ClearanceOfficer from './pages/Login/clearanceOfficer.js';
import Admin from './pages/Login/adminpage.js';
function App() {
  return (
    <div className="App">
      <Router>
      
      <NavBar />
   
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/studentpage" element={<Student />}/>
        <Route path="/approverpage" element={<Approver />}/>
        <Route path="/clearanceOfficer" element={<ClearanceOfficer />}/>
        <Route path="/adminpage" element={<Admin/>}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/dashboard" element={<Dashboard />}/>

      </Routes>
     
      </Router>
    </div>
  );
}

export default App;