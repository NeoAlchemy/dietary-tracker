import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';


export default function Dashboard() {
  
  const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#D98723',
        },
    },
  }); 
  
  return (
    <ThemeProvider theme={darkTheme}>
        <div style={{ marginTop: "70px"}}>
          <Typography variant="h3" component="h2" align="center" sx={{ color: 'white' }}>
            Dashboard
          </Typography> 
        </div>
    </ThemeProvider>
  );
}
