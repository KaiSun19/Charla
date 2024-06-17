import { useCharlaContext } from "@/Contexts/UserContext";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React, { useState } from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { convertClassname } from "@/Utils";
import CreateChatModal from "../CreateChatModal/CreateChatModal";
import { useTheme } from "@emotion/react";

import { CssBaseline } from "@mui/material";

export default function ChatNavigation() {
  const {
    conversations,
    mobile,
    handleNav,
    setCurrentConversation,
    deleteConversation,
  } = useCharlaContext();

  const theme = useTheme();

  const [modalOpen, setModalOpen] = useState(false);

  const handleModalClose = () => {
    setModalOpen(false);
  };

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
        sx={{ backgroundColor: theme.palette.background.paper }}
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
        <OutlinedInput
          placeholder=""
          className="outlined-input record-input"
          color="primary"
          // value={userInput}
          // onChange={handleUserInput}
          endAdornment={
            <InputAdornment position="end" sx={{ paddingRight: "2%" }}>
              <SearchRoundedIcon />
            </InputAdornment>
          }
          sx={{
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              border: "1px solid #292929",
            },
          }}
        />
        <Button
          variant="outlined"
          color="inherit"
          className="chat-navigation-button"
          sx={{ border: `1px solid ${theme.palette.divider} ` }}
          onClick={() => {
            setModalOpen(true);
          }}
        >
          Start a chat here
        </Button>
        {conversations.map((conversation, index) => {
          return (
            <Box
              className="chat-nav-item"
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
      </Box>
    </>
  );
}
