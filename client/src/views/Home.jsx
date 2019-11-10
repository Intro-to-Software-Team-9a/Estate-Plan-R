import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Home.css';
import axios from 'axios';

function Home() {
  var id = 5;

  return (
    <Container className="pt-4">
      <Link to="/questionnaire"><Button variant="outline-dark">Get Started</Button></Link>
      <p>This is the app home page.</p>
      <p><Link to="/create-account">Create an account</Link></p>
	  <p><button type="button" onClick={() => axios.post('/api/pdf', { id })}>Download</button></p>
    </Container>
  );
}

export default Home;
