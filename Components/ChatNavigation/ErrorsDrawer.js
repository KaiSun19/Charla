const { Box, Typography, IconButton, useTheme, Stack, Grid } = require("@mui/material");
import { useCharlaContext } from "@/Contexts/UserContext";
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import styled from "styled-components";

export default function ErrorsDrawer({handleDrawerOpen, errors}){

    const {currentConversation, conversations, handleConversationsUpdate} = useCharlaContext();

    const getMessageOfError = (phrase) => {
        return currentConversation.chat.filter((message) => {
            return message.errors && message.errors.some(error => error.Phrase === phrase);
        });
    };

    const NoPaddingGridItemLeft = styled(Grid)({
        padding: "0.5rem 1rem",
        borderRadius: '1rem 0 0 0', 
        backgroundColor: '#E5737314', 
        borderBottom : '1px solid #E57373', 
        borderRight : '1px solid #E57373', 
        '& .MuiGrid-item': {padding: '0'}
    })

    const NoPaddingGridItemRight = styled(Grid)({
        padding: "0.5rem 1rem",
        borderRadius: '0 1rem 0 0', 
        backgroundColor: '#E5737314', 
        borderBottom : '1px solid #E57373', 
        '& .MuiGrid-item': {padding: '0'}
    })

    const handleErrorCorrection = (phrase, correction) => {
        const messages = getMessageOfError(phrase);
        if(messages.length > 0){
            const [message] = messages;
            const messageIndex = currentConversation.chat.indexOf(message)
            let updatedChat = currentConversation.chat;
            updatedChat = [
                ...updatedChat.slice(0, messageIndex),
                {
                ...updatedChat[messageIndex],
                message: message.message.replace(phrase, correction),
                errors: message.errors.filter(({ Phrase }) => Phrase !== phrase),
                },
                ...updatedChat.slice(messageIndex + 1),
            ];
            let updatedConversations = [
                {
                ...currentConversation,
                chat: updatedChat,
                },
                ...conversations.slice(1),
            ];
            handleConversationsUpdate(updatedConversations);
        }
      };
      
    const theme = useTheme()
        return(
            errors.map((error, index) => {
                return(
                    <>
                    <Stack direction="row" sx={{alignItems: "center", width : '100%', padding : '0 1rem'}}>
                        <Typography style={{textAlign: 'start', color : '#E57373', width : '50%'}} variant = 'h6'>
                            {index + 1}
                        </Typography>
                        <Stack direction="row" spacing={2} sx={{justifyContent: "flex-end",alignItems: "center", height : '32px', width : '50%' }}>
                            <IconButton color = 'error' onClick= {()=> {handleErrorCorrection(error.Phrase, error.Correction); handleDrawerOpen()}}>
                                <DoneRoundedIcon />
                            </IconButton>
                        </Stack>
                    </Stack>
                    <Grid container spacing={2} sx={{ width: '100%', border : `1px solid #e57373`, borderRadius : '1rem', margin : '0.5rem 0 1rem 0'}} key = {`saved-grid-${index}`}>
                        <NoPaddingGridItemLeft item xs={6} sx = {{padding : '1rem'}}>
                            <Typography style={{textAlign: 'center', color : '#E57373', margin : '0.5rem 0'}} variant = 'h6'>
                                Phrase
                            </Typography>
                        </ NoPaddingGridItemLeft>
                        <NoPaddingGridItemRight item xs={6} sx = {{padding : '1rem'}}>                                
                            <Typography style={{textAlign: 'center', color : '#E57373', margin : '0.5rem 0' }} variant = 'h6'>
                                Correction
                            </Typography>
                        </NoPaddingGridItemRight>
                        <Grid item xs={6} sx = {{borderRight: '1px solid #E57373', borderBottom: '1px solid #E57373'}}>
                            <Typography style={{ textAlign: 'start', margin : '1rem' }}>{error.Phrase}</Typography>
                        </Grid>
                        <Grid item xs={6} sx = {{borderBottom: '1px solid #E57373'}}>
                            <Typography style={{ textAlign: 'start', margin : '1rem' }}>{error.Correction}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography style={{ textAlign: 'start', margin : '1rem' }}>{error.Error}</Typography>
                        </Grid>
                    </Grid>
                    </>
                )
            }
            )
        )
}