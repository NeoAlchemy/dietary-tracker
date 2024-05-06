import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';


export default function History() {
  
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
        <div style={{ marginTop: "70px"}}>History</div>
    </ThemeProvider>
  );
}
