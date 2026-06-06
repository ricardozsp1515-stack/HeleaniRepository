//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
//import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Daisy_test from "./components/Daisy_test"

function App() {

  return (
    <>

      <Router>
        <Routes>
          <Route path="/test" element={<Daisy_test></Daisy_test>}></Route>
        </Routes>
      </Router>

    </>
  )
}

export default App
