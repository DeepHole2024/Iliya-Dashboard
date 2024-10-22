import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Header from './Components/Header';
import Content from './Components/Content';

function App() {
  return (
    <div className="App">
      <Content />
      {/* <Router>
        <Routes>
          <Route path="/" element={<Content />} />
          <Route path="/search/:query" element={<ArticleTable />} />
        </Routes>
      </Router> */}
    </div>
  );
}

export default App;
