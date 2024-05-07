import * as React from 'react';
import { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function Tracker() {
  const [input, setInput] = useState('');

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
    fetch(`/api/message?input=${input}`)
      .then(response => response.json())
      .then(data => {
        // Handle data from API response
        if (!data.error) { 
          alert(" a " + data.volume + " " + data.unit + " " + data.name+" has " + data.caffeine + " mg of caffeine");
        } else {
          alert(data.error)
        }
      })
      .catch(error => {
        // Handle errors
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
      <Button variant="contained" onClick={handleSubmit} style={{ marginLeft: 'auto', display: 'block' }}>Submit</Button>
    </ThemeProvider>
  );
}
