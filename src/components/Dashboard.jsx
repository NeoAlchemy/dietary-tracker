import * as React from 'react';
import { useEffect, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Masonry from '@mui/lab/Masonry';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(0.5),
  textAlign: 'center',
  margin: 'none',
  backgroundColor: 'transparent',
  color: 'transparent'
}));

export default function Dashboard() {

  const [caffeineTotal, setCaffeineTotal] = useState('--');
  const [waterTotal, setWaterTotal] = useState('--');

  useEffect(() => {
    fetch(`/api/dashboard?occurance=DAILY`)
      .then(response => response.json())
      .then(data => {
        if (!data.error) { 
          setCaffeineTotal(data.caffeineTotal);
          setWaterTotal(data.waterTotal)
          
        } else {
          alert(data.error)
        }
      })
      .catch(error => {
        // Handle errors
        alert("error")
        console.error('Error fetching data:', error);
      });
  }, []);
  
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
          <Typography variant="h3" component="h2" align="center" sx={{ color: 'white'}}>
            Dashboard
          </Typography>
          <Masonry columns={2} spacing={2}>
            <Item>
              <Card sx={{ backgroundColor: '#04593A' }}>
                <CardContent>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    Caffeine Monitoring Widget
                  </Typography>
                  <Typography variant="h5" component="div">
                    Current Caffeine intake
                  </Typography>
                  <Typography variant="h3" component="div">
                    {caffeineTotal}mg
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">Edit</Button>
                </CardActions>
              </Card>
            </Item>
            <Item>
              <Card sx={{ backgroundColor: '#F2AE2E' }}>
                <CardContent>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    Water Monitoring Widget
                  </Typography>
                  <Typography variant="h5" component="div">
                    Daily Water Intake Goal
                  </Typography>
                  <Typography variant="h3" component="div">
                    {waterTotal} ounces
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">Edit</Button>
                </CardActions>
              </Card>
            </Item>
            <Item>
              <Card sx={{ backgroundColor: '#F25774' }}>
                <CardContent>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    Sugar Monitoring Widget
                  </Typography>
                  <Typography variant="h5" component="div">
                    Daily Snacks Goal
                  </Typography>
                  <Typography variant="h3" component="div">
                    30mg
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">Edit</Button>
                </CardActions>
              </Card>
            </Item>
            <Item>
              <Card sx={{ backgroundColor: '#04593A' }}>
                <CardContent>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    Protein Monitoring Widget
                  </Typography>
                  <Typography variant="h5" component="div">
                    Daily Protein Goal
                  </Typography>
                  <Typography variant="h3" component="div">
                    224g
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">Edit</Button>
                </CardActions>
              </Card>
            </Item>
            <Item>
              <Card sx={{ backgroundColor: '#F2AE2E' }}>
                <CardContent>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    Fruits and Vegtables Monitoring Widget
                  </Typography>
                  <Typography variant="h5" component="div">
                    Daily Fruits and Vegtable Intake Goal
                  </Typography>
                  <Typography variant="h3" component="div">
                    4 of 5 servings
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">Edit</Button>
                </CardActions>
              </Card>
            </Item>
          </Masonry> 
        </div>
    </ThemeProvider>
  );
}
