import './App.css';
import React from 'react';
import {Routes, Route} from 'react-router-dom'
import PostList from '../pages/PostList';

function App() {
  return (
    <React.Fragment>
      <Routes>
        <Route path='/' element={<PostList />} />
      </Routes>
    </React.Fragment>
  );
}

export default App;
