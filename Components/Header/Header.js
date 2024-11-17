import { Box, Divider, Stack, Typography, useTheme } from "@mui/material";
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
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import Person2RoundedIcon from "@mui/icons-material/Person2Rounded";
import ChatBubbleRoundedIcon from "@mui/icons-material/ChatBubbleRounded";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { useRouter } from "next/router";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Navbar() {
  const { mobile, userDetails, setUserDetails, user, userIsLoading } =
    useCharlaContext();

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

  const goToDictionary = () => {
    handleClose();
    router.push("/dictionary");
  };

  const goToProfile = () => {
    handleClose();
    router.push(`/profile/${userDetails.username}`);
  };

  const goToAddPhrase = () => {
    handleClose();
    router.push(`/dictionary?quick_add=true`);
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
      <Box className={`navbar-buttons ${user ?? "sign-in-only"}`}>
        {mobile ? (
          <>
            {user ? (
              <IconButton onClick={handleSettingsClick}>
                <Avatar
                  sx={{
                    fontSize: "16px",
                    backgroundColor: "primary.main",
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
              <Stack direction="row" gap="1rem">
                <Button
                  variant="contained"
                  href="/sign-in"
                  sx={{ borderRadius: "2rem" }}
                >
                  Sign In
                </Button>
              </Stack>
            )}
            <Menu
              id="navbar-profile-menu"
              anchorEl={menuAnchor}
              open={openMenu}
              onClose={handleClose}
              MenuListProps={{ "aria-labelledby": "basic-button" }}
            >
              <MenuItem onClick={goToProfile}>
                <ListItemIcon>
                  <Person2RoundedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Profile</ListItemText>
              </MenuItem>
              <MenuItem onClick={goToAddPhrase}>
                <ListItemIcon>
                  <AutoAwesomeRoundedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Quick add</ListItemText>
              </MenuItem>
              <MenuItem onClick={goToChat}>
                <ListItemIcon>
                  <ChatBubbleRoundedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Chat</ListItemText>
              </MenuItem>
              <MenuItem onClick={goToDictionary}>
                <ListItemIcon>
                  <BookmarkRoundedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Dictionary</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleSignOut} sx={{ color: "error.main" }}>
                Sign out
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={() => {
                  handleClose();
                }}
              >
                Toggle display mode
              </MenuItem>
            </Menu>
          </>
        ) : (
          <>
            {user && (
              <>
                <IconButton
                  onClick={() => router.push("/chat")}
                  disableRipple
                  className="navbar-chat-button"
                >
                  <Typography variant="h6">Chat</Typography>
                </IconButton>
                <IconButton
                  onClick={() => router.push("/dictionary")}
                  disableRipple
                  className="navbar-dictionary-button"
                >
                  <Typography variant="h6">Dictionary</Typography>
                </IconButton>
              </>
            )}
            {user ? (
              <IconButton onClick={handleSettingsClick}>
                <Avatar
                  sx={{
                    width: "45px",
                    height: "45px",
                    backgroundColor: "primary.main",
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
              <Button
                variant="contained"
                href="/sign-in"
                sx={{ borderRadius: "2rem" }}
              >
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
              <MenuItem onClick={goToProfile}>
                <ListItemIcon>
                  <Person2RoundedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Profile</ListItemText>
              </MenuItem>
              <MenuItem onClick={goToAddPhrase}>
                <ListItemIcon>
                  <AutoAwesomeRoundedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Quick add</ListItemText>
              </MenuItem>
              <MenuItem
                onClick={() => {
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
