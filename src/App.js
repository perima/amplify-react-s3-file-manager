import React from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          S3 file manager
        </p>

      </header>
    </div>
  );
}

export default withAuthenticator(App)
