import React, { useState } from 'react';
import SubmissionForm from './components/SubmissionForm';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="App">
      <header>
        <h1>User Submission System</h1>
        <button onClick={() => setIsAdmin(!isAdmin)}>
          {isAdmin ? 'Switch to User View' : 'Switch to Admin View'}
        </button>
      </header>

      <main>
        {isAdmin ? <AdminDashboard /> : <SubmissionForm />}
      </main>
    </div>
  );
}

export default App;
