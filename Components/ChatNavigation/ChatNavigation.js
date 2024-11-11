import { useCharlaContext } from "@/Contexts/UserContext";
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Stack,
  Drawer,
} from "@mui/material";
import React, { useState } from "react";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';
import PriorityHighRoundedIcon from '@mui/icons-material/PriorityHighRounded';
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { convertClassname } from "@/Utils";
import CreateChatModal from "../CreateChatModal/CreateChatModal";

import { CssBaseline } from "@mui/material";

export default function ChatNavigation() {
  const {
    conversations,
    mobile,
    handleNav,
    currentConversation,
    setCurrentConversation,
    deleteConversation,
  } = useCharlaContext();

  const [modalOpen, setModalOpen] = useState(false);
  const [conversationsDrawerOpen, setConversationsDrawerOpen] = useState(false);

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleConversationsDrawerOpen = (e) => {
    setConversationsDrawerOpen(!conversationsDrawerOpen);
  }

  const limitLastMessage = (message) => {
    const words = message.split(" ");
    if (words.length <= 50) {
      return message;
    }
    return words.slice(0, 50).join(" ") + "...";
  };

  //TODO: this is still not working, its always the last conversation being passed into the component ??

  function NavItemMenu({ conversation }) {
    return (
      <Menu
        id="nav-item-menu"
        anchorEl={menuAnchor}
        open={openMenu}
        onClose={handleClose}
        MenuListProps={{ "aria-labelledby": "basic-button" }}
      >
        <MenuItem
          onClick={() => {
            deleteConversation(conversation.chat_details.last_attempted);
            handleNav();
          }}
        >
          <ListItemIcon>
            <DeleteRoundedIcon fontSize={mobile && "small"} color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    );
  }

  const [menuAnchor, setMenuAnchor] = useState(false);

  const openMenu = Boolean(menuAnchor);

  const handleNavItemMenuClick = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setMenuAnchor(false);
  };

  return (
    <>
      <CssBaseline />
      <Box
        className={`${convertClassname(mobile, "chat-nav-container", true)}`}
      >
        <CreateChatModal
          modalOpen={modalOpen}
          handleModalClose={handleModalClose}
        />
        {mobile && (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "-5%",
            }}
          >
            <IconButton
              onClick={() => {
                handleNav();
              }}
            >
              <CloseRoundedIcon />
            </IconButton>
          </Box>
        )}
        <Stack direction = 'column' divider={<Divider orientation="horizontal" flexItem />} spacing={mobile ? 2 : 3}>
          <IconButton>
            <AddRoundedIcon className={mobile ? 'icon-m' : 'icon-l'} sx = {{color : 'primary.main'}}/>
          </IconButton>
          <IconButton onClick={handleConversationsDrawerOpen}>
            <AccessTimeRoundedIcon className={mobile ? 'icon-m' : 'icon-l'} sx = {{color : 'primary.main'}}/>
          </IconButton>
          <IconButton>
            <BookmarkBorderRoundedIcon className={mobile ? 'icon-m' : 'icon-l'} sx = {{color : 'primary.main'}}/>
          </IconButton>
          <IconButton>
            <PriorityHighRoundedIcon className={mobile ? 'icon-m' : 'icon-l'} sx = {{color : 'primary.main'}}/>
          </IconButton>
        </Stack>
        <Drawer open={conversationsDrawerOpen} onClose={handleConversationsDrawerOpen}>
          {conversations.map((conversation, index) => {
            return (
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
                      handleNav();
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
                  <NavItemMenu conversation={conversation} />
                </Box>
                <Typography
                  variant="body1"
                  onClick={() => {
                    setCurrentConversation(conversation);
                    handleNav();
                  }}
                >
                  {limitLastMessage(
                    conversation.chat[conversation.chat.length - 1].message,
                  )}
                </Typography>
              </Box>
            );
          })}
        </Drawer>
      </Box>
    </>
  );
}
