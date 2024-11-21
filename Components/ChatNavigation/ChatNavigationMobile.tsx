import { useCharlaContext } from "@/Contexts/UserContext";
import {
  Badge,
  Box,
  Divider,
  Drawer,
  IconButton,
  Modal,
  Stack,
  Typography,
} from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import PriorityHighRoundedIcon from "@mui/icons-material/PriorityHighRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import ConversationsDrawer from "./ConversationsDrawer";
import CreateChatModal from "@/Components/CreateChatModal/CreateChatModal";
import SavedDrawer from "./SavedDrawer";
import ErrorsDrawer from "./ErrorsDrawer";

import React from "react";
import { Error, SavedPhrase } from "@/Utils/types";

interface Props {
  conversationSaved: SavedPhrase[];
  conversationErrors: Error[];
}

const modalStyle = {
  position: "absolute",
  minHeight: "100%",
  minWidth: "100%",
  bgcolor: "background.default",
  boxShadow: 24,
  p: 4,
  overflowY: "scroll",
};

const ChatNavigationMobile: React.FC<Props> = ({
  conversationSaved,
  conversationErrors,
}) => {
  const {
    chatNavDrawerMobileOpen,
    handleDrawerOpen,
    handleMobileNavigationOpen,
    drawerOpen,
    drawerInfo,
    drawerTitle,
  } = useCharlaContext();
  return (
    <>
      <Drawer
        open={chatNavDrawerMobileOpen}
        onClose={handleMobileNavigationOpen}
        anchor="bottom"
        sx={{ "& .MuiPaper-root": { borderRadius: "8px 8px 0 0" } }}
      >
        <Stack
          direction="column"
          alignItems="center"
          justifyContent="flex-start"
          divider={<Divider orientation="horizontal" flexItem />}
          spacing={3}
          sx={{ padding: "24px 1rem" }}
        >
          <IconButton
            onClick={(e) => {
              handleDrawerOpen(e, "newConversation", "New chat");
              handleMobileNavigationOpen(e);
            }}
            sx={{ borderRadius: "10%", marginTop: "1.5rem" }}
          >
            <Stack
              direction="row"
              spacing={1}
              sx={{ justifyContent: "center", alignItems: "center" }}
            >
              <AddRoundedIcon
                className="icon-m"
                sx={{ color: "primary.main" }}
              />
              <Typography
                variant="h6"
                sx={{ color: "primary.main", whiteSpace: "no-wrap" }}
              >
                New
              </Typography>
            </Stack>
          </IconButton>
          <IconButton
            onClick={(e) => {
              handleDrawerOpen(e, "conversations", "Chat navigation");
              handleMobileNavigationOpen(e);
            }}
            sx={{ borderRadius: "10%" }}
          >
            <Stack
              direction="row"
              spacing={1}
              sx={{ justifyContent: "center", alignItems: "center" }}
            >
              <AccessTimeRoundedIcon
                className="icon-m"
                sx={{ color: "primary.main" }}
              />
              <Typography
                variant="h6"
                sx={{ color: "primary.main", whiteSpace: "no-wrap" }}
              >
                History
              </Typography>
            </Stack>
          </IconButton>
          <Badge
            badgeContent={conversationSaved.length}
            color="saved"
            invisible={conversationSaved.length === 0}
          >
            <IconButton
              onClick={(e) => {
                handleDrawerOpen(e, "saved", "Saved");
                handleMobileNavigationOpen(e);
              }}
              sx={{ borderRadius: "10%" }}
            >
              <Stack
                direction="row"
                spacing={1}
                sx={{ justifyContent: "center", alignItems: "center" }}
              >
                <BookmarkBorderRoundedIcon
                  className="icon-m"
                  sx={{ color: "primary.main" }}
                />
                <Typography
                  variant="h6"
                  sx={{ color: "primary.main", whiteSpace: "no-wrap" }}
                >
                  Saved
                </Typography>
              </Stack>
            </IconButton>
          </Badge>
          <Badge
            badgeContent={conversationErrors.length}
            color="errors"
            invisible={conversationErrors.length === 0}
          >
            <IconButton
              onClick={(e) => {
                handleDrawerOpen(e, "errors", "Errors");
              }}
              sx={{ borderRadius: "10%" }}
            >
              <PriorityHighRoundedIcon
                className="icon-m"
                sx={{ color: "primary.main" }}
              />
              <Typography
                variant="h6"
                sx={{ color: "primary.main", whiteSpace: "no-wrap" }}
              >
                Errors
              </Typography>
            </IconButton>
          </Badge>
        </Stack>
      </Drawer>
      <Modal open={drawerOpen} sx={modalStyle} hideBackdrop={true}>
        <>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              padding: "0.375rem 1rem",
              alignItems: "center",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: "8px",
              marginBottom: "1rem",
            }}
          >
            <Typography variant="h6">{drawerTitle}</Typography>
            <IconButton onClick={handleDrawerOpen}>
              <CloseRoundedIcon />
            </IconButton>
          </Box>
          <Box>
            {drawerInfo === "conversations" ? (
              <ConversationsDrawer handleDrawerOpen={handleDrawerOpen} />
            ) : drawerInfo === "newConversation" ? (
              <CreateChatModal />
            ) : drawerInfo === "saved" ? (
              <SavedDrawer
                handleDrawerOpen={handleDrawerOpen}
                conversationSaved={conversationSaved}
              />
            ) : drawerInfo === "errors" ? (
              <ErrorsDrawer
                handleDrawerOpen={handleDrawerOpen}
                errors={conversationErrors}
              />
            ) : (
              ""
            )}
          </Box>
        </>
      </Modal>
    </>
  );
};

export default ChatNavigationMobile;
