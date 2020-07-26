import React, {useState, useEffect} from 'react';

//material UI
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

// amplify
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import Amplify, { Auth } from 'aws-amplify';
import Storage from '@aws-amplify/storage';
import aws_exports from './aws-exports';
Amplify.configure(aws_exports);

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
  },
  control: {
    padding: theme.spacing(2),
  },
}));



function App() {
  const classes = useStyles();
  const [uploadPct, setUploadPct] = useState(0);
  const [uploadPctTxt, setUploadPctTxt] = useState('');
  
  console.log('Auth user', Auth.user);
  
  function calculatePct(fileSize, Upload){
     const total = (Upload/fileSize)*100;
     setUploadPct(Number((total).toFixed(0)));
     setUploadPctTxt(Number((total).toFixed(0)) + '%');
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
    
    
      <Grid container className={classes.root} spacing={2}>
        <Grid item xs={12}>
           <Grid container justify="center" spacing={2}>
                <Grid item key={1} justify="center" xs={2}>
                   <Paper className={classes.paper}>
                     S3 file manager
                    </Paper>
                    <Paper className={classes.paper} >
                     <AmplifySignOut /> 
                     </Paper>
                </Grid>
                
                <Grid item item key={2} justify="center" xs={10} >
                 <Paper className={classes.paper} >
                       Upload file: 
                        <input
                            type="file" 
                            onChange={(evt) => onChange(evt)}
                        />
                        {uploadPctTxt}
                    </Paper>
                </Grid>
          </Grid>
        </Grid>
    </Grid>
    
      <header className="App-header">
        <p>
         
        </p>
      </header>
    </div>
  );
}
export default withAuthenticator(App);
