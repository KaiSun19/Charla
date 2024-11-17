const { Box, Typography, IconButton, Menu, MenuItem, ListItemIcon, ListItemText, useTheme, Stack } = require("@mui/material");
import { useCharlaContext } from "@/Contexts/UserContext";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";

const limitLastMessage = (message) => {
    const words = message.split(" ");
    if (words.length <= 50) {
      return message;
    }
    return words.slice(0, 50).join(" ") + "...";
};

const sortConversationsByDate = (conversations) => {
    const sorted = {'Today' : [], 'Last week' : [], 'Last month' : []}
    let today = new Date()
    let last_week = new Date();
    let month = new Date()
    last_week =  last_week.setDate(last_week.getDate() - 7);
    month = month.setMonth(month.getMonth() - 1);
    conversations.map((convo, i) => {
        let lastAttempted = convo.chat_details.last_attempted instanceof Date ? 
          convo.chat_details.last_attempted : convo.chat_details.last_attempted.toDate() ;
        if(lastAttempted > today){
            sorted['Today'].push(convo)
        }
        else if(lastAttempted > last_week){
            sorted['Last week'].push(convo)
        }
        else if(lastAttempted > month){
            sorted['Last month'].push(convo)
        }
        else{
          sorted[lastAttempted.toDateString()]  = [convo]
        }
    })
    return sorted;
}

export default function ConversationsDrawer({
    handleDrawerOpen}){

    const {
        conversations,
        currentConversation,
        setCurrentConversation,
        } = useCharlaContext();
      
    const theme = useTheme()
    
    let sortedConversations = sortConversationsByDate(conversations.map((convo, i ) => {
      if(i == 0){
        return convo
      }
        return({ 
            ...convo , 
            last_attempted : new Date(convo.chat_details.last_attempted.toDate())})
        }
    ).sort((a, b) => {return b.last_attempted - a.last_attempted})
    )

    return(
      Object.entries(sortedConversations).map(([date , convos]) => {
        if(convos.length > 0 ){
          return (
            <Stack direction="column" spacing={1} sx={{justifyContent: "center",alignItems: "center"}}>
              <Typography variant='body1' color = {theme.palette.grey['700']} sx = {{padding : '3%', width: '100%', textAlign : 'left'}}>
                {date}
              </Typography>
              
                {conversations.map((conversation, index) => {
                  return(
                    <Box
                      className="chat-nav-item"
                      id={conversation === currentConversation && "chat-nav-item-first"}
                      onClick={() => {
                        setCurrentConversation(conversation);
                      }}
                      key={`chat-nav-item-${index}`}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{ marginBottom: "5px" }}
                          onClick={() => {
                            setCurrentConversation(conversation);
                            handleDrawerOpen();
                          }}
                        >
                          {conversation.title}
                        </Typography>
                        <IconButton
                          className="nav-item-action-button"
                          onClick={(e) => {
                            handleNavItemMenuClick(e);
                          }}
                        >
                          <MoreVertRoundedIcon />
                        </IconButton>
                      </Box>
                      <Typography
                        variant="body1"
                        onClick={() => {
                          setCurrentConversation(conversation);
                          handleDrawerOpen();
                        }}
                      >
                        {limitLastMessage(
                          conversation.chat[conversation.chat.length - 1].message
                        )}
                      </Typography>
                  </Box>
                  )
                })}
               </Stack>
          );
        }
      })
    )
  }