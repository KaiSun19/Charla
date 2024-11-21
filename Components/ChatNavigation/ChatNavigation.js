import { useCharlaContext } from "@/Contexts/UserContext";
import {
  Box,
  Typography,
  IconButton,
  Divider,
  Stack,
  Drawer,
  Badge,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import PriorityHighRoundedIcon from "@mui/icons-material/PriorityHighRounded";
import KeyboardDoubleArrowLeftRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowLeftRounded';
import { convertClassname } from "@/Utils";
import CreateChatModal from "../CreateChatModal/CreateChatModal";

import { CssBaseline } from "@mui/material";
import { SidebarDrawerStyles } from "@/Constants";
import ConversationsDrawer from "./ConversationsDrawer";
import SavedDrawer from "./SavedDrawer";
import ErrorsDrawer from "./ErrorsDrawer";
import ChatNavigationMobile from "./ChatNavigationMobile";

export default function ChatNavigation() {
  const {
    mobile,
    savedPhrases,
    conversations,
    currentConversation,
    drawerInfo,
    drawerOpen,
    drawerTitle,
    handleDrawerOpen
  } = useCharlaContext();

  const [conversationSaved, setConversationSaved] = useState([]);
  const [conversationErrors, setConversationErrors] = useState([])

  useEffect(()=>{
    setConversationSaved(savedPhrases.filter(({conversation_index}) => conversation_index === conversations.indexOf(currentConversation)))
  }, [savedPhrases])

  useEffect(()=>{
    if(currentConversation){
      setConversationErrors(currentConversation.chat.filter(({errors}) => errors.length  > 0 ).map(({errors}) => errors).flat())
    }
  }, [currentConversation])

  if(mobile){
    return <ChatNavigationMobile conversationSaved={conversationSaved} conversationErrors={conversationErrors}/>
  }
  return (
    <>
      <CssBaseline />
      <Box
        className={`${convertClassname(mobile, "chat-nav-container", true)}`}
      >
        <Stack
          direction="column"
          alignItems='flex-start'
          divider={<Divider orientation="horizontal" flexItem />}
          spacing={3}
          sx = {{padding : '2% 1%'}}
        >
          <IconButton onClick={(e) => {handleDrawerOpen(e, 'newConversation','New chat')}} sx = {{borderRadius : '10%'}}>
            <Stack  direction="row" spacing={1} sx={{justifyContent: "center",alignItems: "center"}}>
              <AddRoundedIcon
                className="icon-m"
                sx={{ color: "primary.main" }}
              />
              <Typography variant='body1' sx = {{color: "primary.main", whiteSpace : 'no-wrap'}}>
                New
              </Typography>
            </Stack>
          </IconButton>
          <IconButton onClick={(e) => {
            handleDrawerOpen(e, 'conversations', 'Chat navigation')}} sx = {{borderRadius : '10%'}}>
            <Stack  direction="row" spacing={1} sx={{justifyContent: "center",alignItems: "center"}}>
              <AccessTimeRoundedIcon
                className="icon-m"
                sx={{ color: "primary.main" }}
              />
              <Typography variant='body1' sx = {{color: "primary.main", whiteSpace : 'no-wrap'}}>
                History
              </Typography>
            </Stack>
          </IconButton>
          <Badge badgeContent={conversationSaved.length} color='saved' invisible={conversationSaved.length === 0}>
            <IconButton onClick={(e) => {
              handleDrawerOpen(e, 'saved', 'Saved')}} sx = {{borderRadius : '10%'}}>
              <Stack  direction="row" spacing={1} sx={{justifyContent: "center",alignItems: "center"}}>
                <BookmarkBorderRoundedIcon
                  className="icon-m"
                  sx={{ color: "primary.main" }}
                />
                <Typography variant='body1' sx = {{color: "primary.main", whiteSpace : 'no-wrap'}}>
                  Saved
                </Typography>
              </Stack>
            </IconButton>
          </Badge >
          <Badge badgeContent={conversationErrors.length} color='errors' invisible={conversationErrors.length === 0}>
            <IconButton onClick={(e) => {
              handleDrawerOpen(e, 'errors', 'Errors')}} sx = {{borderRadius : '10%'}}>
              <PriorityHighRoundedIcon
                className="icon-m"
                sx={{ color: "primary.main" }}
              />
              <Typography variant='body1' sx = {{color: "primary.main", whiteSpace : 'no-wrap'}}>
                Errors
              </Typography>
            </IconButton>
          </Badge>
        </Stack>
      </Box>
      <Drawer open={drawerOpen} onClose={handleDrawerOpen} hideBackdrop={true} elevation={0} ModalProps={{sx: {width : '30%', left : '9.4%', top:'10%', overflowY : 'scroll'}}} PaperProps={{sx : {...SidebarDrawerStyles}}}>
        <Stack direction='row' className="nav-sidebar-header">
          <Typography variant = 'h6' sx = {{fontWeight : 'bold'}}>
            {drawerTitle}
          </Typography>
          <IconButton onClick={handleDrawerOpen}>
            <KeyboardDoubleArrowLeftRoundedIcon className="icon-m"/>
          </IconButton>
        </Stack>
        {
          drawerInfo === 'conversations' ?
          (<ConversationsDrawer handleDrawerOpen={handleDrawerOpen} />) : 
          drawerInfo === 'newConversation' ? 
          (<CreateChatModal handleDrawerOpen={handleDrawerOpen}/>) : 
          drawerInfo === 'saved' ?
          (<SavedDrawer handleDrawerOpen={handleDrawerOpen} conversationSaved={conversationSaved} />) : 
          drawerInfo === 'errors' ? 
          (<ErrorsDrawer handleDrawerOpen={handleDrawerOpen} errors={conversationErrors} />) : 
          ""
        }
      </Drawer>
    </>
  );
}
