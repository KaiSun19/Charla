import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import Link from "next/link";
import IconButton from "@mui/material/IconButton";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <Box className="navbar-container">
      <Box className="navbar-menu">
        <IconButton
          aria-label="delete"
          sx={{ color: "white" }}
          onClick={() => {
            setOpenMenu(true);
          }}
        >
          <MenuRoundedIcon sx={{ width: "36px", height: "36px" }} />
        </IconButton>
      </Box>
      <Box className="navbar-title">
        <Typography variant="h4">Charla</Typography>
      </Box>
      <Drawer
        anchor="left"
        open={openMenu}
        onClose={() => {
          setOpenMenu(false);
        }}
        className="drawer-container"
        sx={{ backgroundColor: "#1a181d" }}
      >
        <Box role="presentation">
          <List className="drawer-list">
            {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
              <ListItem key={text} disablePadding className="drawer-list-item">
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
