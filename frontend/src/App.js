import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Tweet from './components/Tweet';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <div className='app'>
      <Router>
        <ToastContainer />
        <Routes>
          <Route exact path="/" element={<Login />}></Route>
          <Route exact path="/Login" element={<Login />}></Route>
          <Route exact path="/Register" element={<Register />}></Route>
          <Route exact path="/Home" element={<Home/>}></Route>
          <Route exact path="/Tweet" element={<Tweet/>}></Route>
          <Route exact path="/Sidebar" element={<Sidebar/>}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
