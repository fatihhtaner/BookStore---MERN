import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Basket from './pages/Basket';
import store from './redux/store'
import { Provider } from 'react-redux'

function App() {
  return (
    <Provider store={store}>
      <div >
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/basket" element={<Basket />} />
          </Routes>
        </Router>
      </div>
    </Provider>
  );
}

export default App;
