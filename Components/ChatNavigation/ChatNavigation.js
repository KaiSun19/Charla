import { useCharlaContext } from "@/Contexts/UserContext";
import {
  Box,
  Typography,
  IconButton,
  Divider,
  Stack,
  Drawer,
} from "@mui/material";
import React, { useState } from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import PriorityHighRoundedIcon from "@mui/icons-material/PriorityHighRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import KeyboardDoubleArrowLeftRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowLeftRounded';
import { convertClassname } from "@/Utils";
import CreateChatModal from "../CreateChatModal/CreateChatModal";

import { CssBaseline } from "@mui/material";
import { SidebarDrawerStyles } from "@/Constants";
import ConversationsDrawer from "./ConversationsDrawer";

export default function ChatNavigation() {
  const {
    mobile,
  } = useCharlaContext();

  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerInfo , setDrawerInfo] = useState('conversations')

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleDrawerOpen = (e, drawerType) => {
    setDrawerInfo(drawerType);
    setDrawerOpen(!drawerOpen);
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
              onClick={handleDrawerOpen}
            >
              <CloseRoundedIcon />
            </IconButton>
          </Box>
        )}
        <Stack
          direction="column"
          divider={<Divider orientation="horizontal" flexItem />}
          spacing={mobile ? 2 : 3}
        >
          <IconButton>
            <AddRoundedIcon
              className={mobile ? "icon-m" : "icon-l"}
              sx={{ color: "primary.main" }}
            />
          </IconButton>
          <IconButton onClick={(e) => {
            handleDrawerOpen(e, 'conversations')}}>
            <AccessTimeRoundedIcon
              className={mobile ? "icon-m" : "icon-l"}
              sx={{ color: "primary.main" }}
            />
          </IconButton>
          <IconButton>
            <BookmarkBorderRoundedIcon
              className={mobile ? "icon-m" : "icon-l"}
              sx={{ color: "primary.main" }}
            />
          </IconButton>
          <IconButton>
            <PriorityHighRoundedIcon
              className={mobile ? "icon-m" : "icon-l"}
              sx={{ color: "primary.main" }}
            />
          </IconButton>
        </Stack>
      </Box>
      <Drawer open={drawerOpen} onClose={handleDrawerOpen} hideBackdrop={true} elevation={0} ModalProps={{sx: {width : '30%', left : '6%', top:'10%'}}} PaperProps={{sx : SidebarDrawerStyles}}>
        <Stack direction='row' className="nav-sidebar-header">
          <Typography variant = 'h6' sx = {{fontWeight : 'bold'}}>
            Chat navigation
          </Typography>
          <IconButton onClick={handleDrawerOpen}>
            <KeyboardDoubleArrowLeftRoundedIcon className="icon-m"/>
          </IconButton>
        </Stack>
        {
          drawerInfo === 'conversations' ?
          (<ConversationsDrawer handleDrawerOpen={handleDrawerOpen} />) : 
          ''
        }
      </Drawer>
    </>
  );
}
