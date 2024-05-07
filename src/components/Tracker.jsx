import * as React from 'react';
import { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import Typography from '@mui/material/Typography';

export default function Tracker() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = React.useState(false);

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
          main: '#D98723'
      },
      text: {
        primary: '#fff' // Setting text color to white
     }
    },
  }); 

  const handleSubmit = () => {
    setLoading(true)
    fetch(`/api/message?input=${input}`)
      .then(response => response.json())
      .then(data => {
        setLoading(false)
        // Handle data from API response
        if (!data.error) { 
          alert(" a " + data.volume + " " + data.unit + " " + data.name+" has " + data.caffeine + " mg of caffeine");
        } else {
          alert(data.error)
        }
      })
      .catch(error => {
        // Handle errors
        setLoading(false)
        alert("error")
        console.error('Error fetching data:', error);
      });
  };
  
  return (
    <ThemeProvider theme={darkTheme}>
      <div style={{ marginTop: "70px"}}>
        <Typography variant="h3" component="h2" align="center" sx={{ color: 'white' }}>
          Track Food Item
        </Typography> 
        <Typography variant="body1" component="p" paragraph="true" sx={{ color: 'white' }}>
          Use natural language to input the food, size, and when for each food item
        </Typography>
        <TextField
          id="outlined-multiline-static"
          label="What did you eat/drink?"
          multiline
          fullWidth
          rows={4}
          variant="filled"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      <LoadingButton
        onClick={handleSubmit}
        loading={loading}
        variant="contained"
        sx={{ display: 'block', marginLeft: 'auto'}}
      >
        <span>Submit</span>
      </LoadingButton>
    </ThemeProvider>
  );
}
