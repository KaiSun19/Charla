import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Image from "next/image";
import Link from "next/link";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import { ListItemIcon, ListItemText } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { useCharlaContext } from "@/Contexts/UserContext";
import Avatar from "@mui/material/Avatar";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import Person2RoundedIcon from "@mui/icons-material/Person2Rounded";
import { useTheme } from "@mui/material/styles";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { useRouter } from "next/router";

import { ThemePaletteModeContext } from "@/pages/_app";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Navbar() {
  const { mobile, userDetails, setUserDetails, user, userIsLoading } =
    useCharlaContext();
  const themePaletteModeContext = React.useContext(ThemePaletteModeContext);
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

  const goToChat = () => {
    handleClose();
    router.push("/chat");
  };

  const handleSignOut = () => {
    handleClose();
    router.push("/");
    setUserDetails({});
    signOut(auth);
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
            {user ? (
              <IconButton onClick={handleSettingsClick}>
                <Avatar
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    fontSize: "16px",
                  }}
                  className="mobile-navbar-icon"
                >
                  {userDetails.initials}
                </Avatar>
              </IconButton>
            ) : userIsLoading ? (
              <Skeleton
                baseColor="#6573C3"
                circle={true}
                height={24}
                width={24}
              />
            ) : (
              <IconButton href="/sign-in">
                <LoginRoundedIcon />
              </IconButton>
            )}
            <Menu
              id="settings-menu"
              anchorEl={menuAnchor}
              open={openMenu}
              onClose={handleClose}
              MenuListProps={{ "aria-labelledby": "basic-button" }}
            >
              <MenuItem onClick={goToChat}>Chat</MenuItem>
              <MenuItem onClick={handleClose}>Library</MenuItem>
              <MenuItem onClick={handleClose}>Dashboard</MenuItem>
              <MenuItem onClick={handleSignOut} sx={{ color: "error.main" }}>
                Sign out
              </MenuItem>
              <MenuItem
                onClick={() => {
                  themePaletteModeContext.toggleThemePaletteMode();
                  handleClose();
                }}
              >
                Toggle display mode
              </MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <IconButton onClick={() => router.push("/chat")} disableRipple>
              <Typography variant="h6">Chat</Typography>
            </IconButton>
            <IconButton onClick={() => router.push("/library")} disableRipple>
              <Typography variant="h6">Library</Typography>
            </IconButton>
            <IconButton onClick={() => router.push("/dashboard")} disableRipple>
              <Typography variant="h6">Dashboard</Typography>
            </IconButton>
            {user ? (
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
            ) : userIsLoading ? (
              <Skeleton
                baseColor="#6573C3"
                circle={true}
                height={24}
                width={24}
              />
            ) : (
              <Button variant="contained" href="/sign-in">
                Sign In
              </Button>
            )}
            <Menu
              id="user-menu"
              anchorEl={menuAnchor}
              open={openMenu}
              onClose={handleClose}
              MenuListProps={{ "aria-labelledby": "basic-button" }}
            >
              <MenuItem
                onClick={() => {
                  handleClose();
                  router.push(`/profile/${userDetails.username}`);
                }}
              >
                <ListItemIcon>
                  <Person2RoundedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Profile</ListItemText>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  themePaletteModeContext.toggleThemePaletteMode();
                  handleClose();
                }}
              >
                <ListItemIcon>
                  <DarkModeRoundedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Toggle display mode</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleSignOut}>
                <ListItemIcon>
                  <LogoutRoundedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Sign out</ListItemText>
              </MenuItem>
            </Menu>
          </>
        )}
      </Box>
    </Box>
  );
}
