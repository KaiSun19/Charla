import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Image from "next/image";
import Link from "next/link";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useCharlaContext } from "@/Contexts/UserContext";
import Avatar from "@mui/material/Avatar";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { useTheme } from "@mui/material/styles";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { useRouter } from "next/router";

export default function Navbar() {
  const { mobile, userDetails, setUserDetails, user } = useCharlaContext();
  const theme = useTheme();

  const router = useRouter();

  const [menuAnchor, setMenuAnchor] = useState(false);

  const openMenu = Boolean(menuAnchor);

  const handleSettingsClick = (event) => {
    if (user) {
      setMenuAnchor(event.currentTarget);
    }
  };
  const handleClose = () => {
    setMenuAnchor(false);
  };

  const handleSignOut = () => {
    handleClose();
    setUserDetails({});
    router.push("/");
    signOut(auth);
    sessionStorage.removeItem("user");
  };

  return (
    <Box className="navbar-container">
      <Box className="navbar-home">
        <Link href="/">
          <IconButton aria-label="delete">
            <Image
              src="/charla-icon-light.svg"
              alt="Charla icon"
              height={30}
              width={30}
            />
          </IconButton>
        </Link>
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
              sx={{
                backgroundColor: theme.palette.primary.main,
                fontSize: "16px",
              }}
              className="mobile-navbar-icon"
            >
              {userDetails.initials}
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
            <Button variant="outlined" color="inherit" href="/chat">
              Chat
            </Button>
            <Button variant="outlined" color="inherit">
              Library
            </Button>
            <Button variant="outlined" color="inherit">
              Dashboard
            </Button>
            <IconButton onClick={handleSettingsClick}>
              <Avatar
                sx={{
                  backgroundColor: "#6573C3",
                  width: "45px",
                  height: "45px",
                }}
              >
                {userDetails.initials}
              </Avatar>
            </IconButton>
            <Menu
              id="user-menu"
              anchorEl={menuAnchor}
              open={openMenu}
              onClose={handleClose}
              MenuListProps={{ "aria-labelledby": "basic-button" }}
            >
              <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
            </Menu>
          </>
        )}
      </Box>
    </Box>
  );
}
