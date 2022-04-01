import React, { useState } from 'react'
import logo from './logo.svg';
import './App.css';

function App() {
  const [result, setResult] = useState("")
  return (
    <div className="App">
    	
            <input type="text" onChange = {e => setResult(e.target.value)}/> 
            <input type="submit"/>
     
      <iframe src={result}> 
      nothing to show</iframe>
    </div>
  );
}

export default App;
