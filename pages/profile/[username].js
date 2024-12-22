import { useCharlaContext } from "@/Contexts/UserContext";
import {
  Box,
  Typography,
  IconButton,
  Stack,
  TextField,
  Chip,
  Grid,
  LinearProgress,
  ClickAwayListener,
  InputAdornment,
} from "@mui/material";

import { Interests } from "@/Constants";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AddRounded, CheckCircleRounded } from "@mui/icons-material";

export default function Profile() {
  const { userDetails, updateUserDetails, mobile } = useCharlaContext();

  const [newBio, setNewBio] = useState('');
  const [bioStrength, setBioStrength] = useState([])
  const [newInterest, setNewInterest] = useState('');

  const handleNewInterestChange = (e) => {
    setNewInterest(e.target.value);
  };

  const handleAddInterest = () => {
    updateUserDetails('interests', newInterest)
    setNewInterest('');
  };

  const handleAddInterestChip  = (interest) => {
    updateUserDetails('interests', interest)
  }

  const handleDeleteInterestChip = (interest) => {
    updateUserDetails('interests-delete', interest)
  }


  const handleBioChange = (e) => {
    setNewBio(e.target.value);
  }

  const saveBioChange = (e) => {
    if(!e.target.classList.contains('MuiBox-root')){
      return;
    }
    updateUserDetails('bio', newBio)
  }

  const calcBioStrength = () => {
    if(newBio.length < 100){
      return ['Poor', '#ef4444', 20];
    }
    if(newBio.length < 300){
      return ['Enough', '#f59e0b', 50];
    }
    if(newBio.length > 500 ){
      return ['Detailed', '#16a34a', 100];
    }
    
  }

  useEffect(() => {
    setNewBio(userDetails.bio)
    console.log(userDetails);
  }, [userDetails]);

  useEffect(()=>{
    if(newBio){
      setBioStrength(calcBioStrength())
    }
  }, [newBio])

  if (userDetails) {
    return (
      <Box sx = {{flexGrow : 1}}>
        <Grid container columnSpacing={2} rowSpacing={1} sx = {{width : '100%', height : '100%'}}>
          <Grid item xs={12} md={6}>
            <Box sx = {{padding : '1rem', marginTop : mobile ? '2rem' : '4rem'}}>
              <Typography variant = 'h3' sx = {{marginBottom : '1rem', fontWeight : 500}}>
                Welcome back , 
              </Typography>
              <Typography variant="h3" sx = {{fontWeight : 500}}>
                {userDetails.username}
              </Typography>

              <Typography variant={mobile ? 'body1' : 'h6'} sx = {{marginTop : '1rem'}}>
                here you can describe yourself so you can have more
                personalized conversations with Charla . here’s what you’ve completed so far
              </Typography>

              <Box sx = {{marginTop : '2rem', display : 'flex', gap : '2rem', justifyContent  : 'flex-start', alignItems : 'center'}}>
                <Box sx = {{display : 'flex', alignItems : 'center', gap : '0.5rem'}}>
                  <CheckCircleRounded />
                  <Typography variant='h6'>
                    Introduction
                  </Typography>
                </Box>

                <Box sx = {{display : 'flex', alignItems : 'center', gap : '0.5rem'}}>
                  <CheckCircleRounded />
                  <Typography variant='h6'>
                    Interests
                  </Typography>
                </Box>
              </Box>

              <Box sx = {{marginTop : '1rem', display : 'flex', alignItems : 'center', gap : '0.5rem', width : '100%'}}>
                <LinearProgress variant="determinate" value={100} sx = {{backgroundColor : '#d5e3e6', height : '30px', borderRadius : '1rem', width :'70%'}}/>
                <Typography variant="h6" sx = {{display: 'flex', flexGrow : 1, justifyContent : 'center'}}>
                  100%
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item  xs={0} md={6} sx = {{display : mobile ? 'none' : 'block'}}>
            <Box sx = {{padding : '1rem', marginTop : mobile ? '2rem' : '4rem' ,overflow : 'hidden'}}>
              <Image src = "/charla-filler.svg" width={1000} height = {300} />
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx = {{ padding : '1rem' , width : '100%', height : '100%',  display : 'flex', gap : '1rem' , flexDirection : 'column', justifyContent : 'space-between'}}>
              <Typography variant={mobile ? 'h6' : "h4"} >Introduction </Typography>
              <ClickAwayListener onClickAway={saveBioChange}> 
                <TextField multiline variant="outlined" onChange={handleBioChange} value = {newBio} rows = {10} sx = {{width : '100%'}}/>
              </ClickAwayListener>
              <Box sx = {{marginTop : '1rem', display : 'flex', alignItems : 'center', gap : '0.5rem', width : '100%'}}>
                <LinearProgress variant="determinate" value={bioStrength[2]} sx = {{height : '15px', borderRadius : '1rem', width :'70%', '& .MuiLinearProgress-bar': {
                    backgroundColor: bioStrength[1]
                  }}}/>
                <Typography variant="h6" sx = {{display: 'flex', flexGrow : 1, justifyContent : 'center'}}>
                  {bioStrength[0]}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={8} >
            <Box sx = {{ padding : '1rem' , width : '100%', height : '100%', display : 'flex', gap : '1rem' , flexDirection : 'column', justifyContent : 'space-between'}}>
              <Typography variant={mobile ? 'h6' : "h4"} >Interests </Typography>
              <Box sx = {{marginTop : '1rem', display : 'flex', flexDirection : 'row', justifyContent : 'flex-start', alignItems : 'flex-start', flexWrap : 'wrap'}}>
                  { 
                    Interests.map((interest,i) => {
                      if(userDetails.interests.includes(interest)){
                        return(<Chip label={interest} color='primary' variant="filled" key={`interest-chip-${i}`} sx = {{width : 'fit-content', margin : '0.5rem', padding : '0.5rem'}}
                                      onClick={() => handleDeleteInterestChip(interest)}/>)
                      }
                      return(<Chip label={interest} color='primary' variant="outlined" key={`interest-chip-${i}`} sx = {{width : 'fit-content', margin : '0.5rem', padding : '0.5rem'}}
                                      onClick={() => handleAddInterestChip(interest)}/>)
                    })
                  }
              </Box>
              <Box sx = {{marginTop : '0.5rem', display : 'flex', flexDirection : 'row', justifyContent : 'flex-start', alignItems : 'center', gap : '1rem'}}>
                <Typography variant='body1' sx = {{fontWeight : 500}}>Add more : </Typography>
                <TextField variant="outlined" value={newInterest} onChange={handleNewInterestChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleAddInterest} edge="end" disabled={newInterest.length <= 0}>
                            <AddRounded />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  }
}
