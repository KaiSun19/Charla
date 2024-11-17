const { Box, Typography, IconButton, useTheme, Stack, Grid } = require("@mui/material");
import { useCharlaContext } from "@/Contexts/UserContext";
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import styled from "styled-components";

export default function SavedDrawer({handleDrawerOpen, conversationSaved}){

    const { deleteSavedPhrase} = useCharlaContext();
    
    const NoPaddingGridItemLeft = styled(Grid)({
        padding: "0.5rem 1rem",
        borderRadius: '1rem 0 0 0', 
        backgroundColor: '#5b6d9214', 
        borderBottom : '1px solid #5B6D92', 
        borderRight : '1px solid #5B6D92', 
        '& .MuiGrid-item': {padding: '0'}
    })

    const NoPaddingGridItemRight = styled(Grid)({
        padding: "0.5rem 1rem",
        borderRadius: '0 1rem 0 0', 
        backgroundColor: '#5b6d9214', 
        borderBottom : '1px solid #5B6D92', 
        '& .MuiGrid-item': {padding: '0'}
    })
      
    const theme = useTheme()
        return(
            <Stack direction="column" spacing={3} sx={{alignItems: "center", overflowY : 'scroll', marginTop : '1rem'}}>
                {conversationSaved.map((saved, index) => {
                    return(
                        <>
                        <Stack direction="row" sx={{alignItems: "center", width : '100%', padding : '0 1rem'}}>
                            <Typography style={{textAlign: 'start', color : '#5B6D92', width : '50%'}} variant = 'h6'>
                                {index + 1}
                            </Typography>
                            <Stack direction="row" spacing={2} sx={{justifyContent: "flex-end",alignItems: "center", height : '32px', width : '50%' }}>
                                <IconButton color = 'error' onClick= {()=> {deleteSavedPhrase(saved.conversation_index, saved.message_index, saved.phrase); handleDrawerOpen()}}>
                                    <DeleteOutlineRoundedIcon />
                                </IconButton>
                            </Stack>
                        </Stack>
                        <Grid container spacing={2} sx={{ width: '100%', border : `1px solid ${theme.palette.primary.main}`, borderRadius : '1rem', margin : '0.5rem 0 1rem 0'}} key = {`saved-grid-${index}`}>
                            <NoPaddingGridItemLeft item xs={6}>
                                <Typography style={{textAlign: 'center', color : '#5B6D92' }} variant = 'h6'>
                                    Phrase
                                </Typography>
                            </ NoPaddingGridItemLeft>
                            <NoPaddingGridItemRight item xs={6}>                                
                                <Typography style={{textAlign: 'center', color : '#5B6D92' }} variant = 'h6'>
                                    Translation
                                </Typography>
                            </NoPaddingGridItemRight>
                            <Grid item xs={6} sx = {{borderRight: '1px solid #5B6D92'}}>
                                <Typography style={{ textAlign: 'start', padding : '0.5rem' }}>{saved.phrase}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography sstyle={{ textAlign: 'start', padding : '0.5rem' }}>{saved.translation}</Typography>
                            </Grid>
                        </Grid>
                        </>
                    )
                }
                )}
            </Stack>
        )
}
