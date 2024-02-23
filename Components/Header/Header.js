import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Image from "next/image";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useCharlaContext } from "@/Context";
import Avatar from "@mui/material/Avatar";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

export default function Navbar() {
  const { mockUserInitials, mobile } = useCharlaContext();

  const [menuAnchor, setMenuAnchor] = useState(false);

  const openMenu = Boolean(menuAnchor);

  const handleSettingsClick = (event) => {
    setMenuAnchor(event.currentTarget);
  };
  const handleClose = () => {
    setMenuAnchor(false);
  };

  return (
    <Box className="navbar-container">
      <Box className="navbar-home">
        <IconButton
          aria-label="delete"
          sx={{ color: "white" }}
          onClick={() => {
            setOpenMenu(true);
          }}
        >
          <Image
            src="/charla-icon-light.svg"
            alt="Charla icon"
            height={30}
            width={30}
          />
        </IconButton>
        <Box className="navbar-title">
          <Typography variant={mobile ? "h5" : "h4"}>Charla</Typography>
        </Box>
      </Box>
      <Box className="navbar-buttons">
        {mobile ? (
          <>
            <IconButton onClick={handleSettingsClick}>
              <SettingsOutlinedIcon />
            </IconButton>
            <Avatar
              sx={{ backgroundColor: "#6573C3", fontSize: "16px" }}
              className="mobile-navbar-icon"
            >
              {mockUserInitials}
            </Avatar>
            <Menu
              id="settings-menu"
              anchorEl={menuAnchor}
              open={openMenu}
              onClose={handleClose}
              MenuListProps={{ "aria-labelledby": "basic-button" }}
            >
              <MenuItem onClick={handleClose}>Chat</MenuItem>
              <MenuItem onClick={handleClose}>Library</MenuItem>
              <MenuItem onClick={handleClose}>Dashboard</MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <Button variant="outlined" color="inherit">
              Chat
            </Button>
            <Button variant="outlined" color="inherit">
              Library
            </Button>
            <Button variant="outlined" color="inherit">
              Dashboard
            </Button>
            <Avatar
              sx={{ backgroundColor: "#6573C3", width: "45px", height: "45px" }}
            >
              {mockUserInitials}
            </Avatar>
          </>
        )}
      </Box>
    </Box>
  );
}
