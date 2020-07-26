import React, {useState, useEffect} from 'react';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
import Amplify, { Auth } from 'aws-amplify';
import Storage from '@aws-amplify/storage'

import aws_exports from './aws-exports'
Amplify.configure(aws_exports);
//Storage.configure({ level: 'private' });

function App() {
  
  const [uploadPct, setUploadPct] = useState(0);
  
  console.log('Auth user', Auth.user);
  
  function calculatePct(fileSize, Upload){
     const total = (Upload/fileSize)*100;
     setUploadPct(Number((total).toFixed(0)));
  }
  
  function onChange(e) {
      const file = e.target.files[0];
      console.log('file',  e.target.files);
      console.log('file meta', {
          size: file.size,
          level: 'private',
          contentType: file.type,
          metadata: { uploader: 's3-file-manager', username: Auth.user.attributes.email}
      });
      
       Storage.vault.put(
          file.name, 
          file, {
          level: 'private',
          contentType: file.type,
          metadata: { uploader: 's3-file-manager', 
                      username: Auth.user.attributes.email
                    },
          progressCallback(progress) {
          calculatePct(progress.total, progress.loaded);  
          console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
        },
      })
      .then (result => 
          console.log('success', result)
        )
      .catch(err => console.log('error', err));
  }

  return (
    <div className="App">
    
      <header className="App-header">
        <p>
          S3 file manager
        </p>
      </header>
      <input
              type="file" 
              onChange={(evt) => onChange(evt)}
          />
          
          {uploadPct}%
          <AmplifySignOut /> 
    </div>
  );
}
export default withAuthenticator(App);
