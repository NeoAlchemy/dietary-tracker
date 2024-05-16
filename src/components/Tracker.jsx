import * as React from 'react';
import { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

export default function Tracker() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState({name: "", volume: ""});
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

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
    fetch(`/api/dietary?input=${input}`)
      .then(response => response.json())
      .then(data => {
        setLoading(false)
        setOpen(true)
        // Handle data from API response
        if (!data.error) { 
          setData(data)
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

  const handleConfirm = () => {
    setOpen(false)
    data.date = new Date()
    fetch('/api/dietary', {
        method: "POST",
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify(data),
      })
      .then(response => response.json())
      .then(data => {
        console.log(data)
      })
  }
  
  return (
    <ThemeProvider theme={darkTheme}>
      <div style={{ marginTop: "70px"}}>
        <Dialog onClose={handleClose} open={open}>
          <DialogTitle>Food Item</DialogTitle>
          <Typography variant="span" component="div" sx={{textAlign: 'center'}}>{data.volume} ounce of {data.name}</Typography>
          <DialogActions>
            <Button onClick={handleClose}>Retry</Button>
            <Button onClick={handleConfirm} autoFocus>Confirm</Button>
        </DialogActions>
        </Dialog>
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
