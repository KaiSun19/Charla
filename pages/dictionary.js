import { useCharlaContext } from "@/Contexts/UserContext";
import {
  Box,
  Typography,
  IconButton,
  Stack,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Modal,
  InputLabel,
  Select,
  Input,
  ButtonGroup,
  Button,
} from "@mui/material";

import React, { useEffect, useState, useRef } from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { modalStyle } from "@/Constants";

export default function Dictionary() {
  const {
    userDetails,
    mobile,
    savedPhrases,
    setSavedPhrases,
    createUpdatedConversations,
    handleConversationsUpdate,
    conversations,
  } = useCharlaContext();

  const [menuAnchor, setMenuAnchor] = useState(false);
  const selectedIndex = useRef(null);

  const menuOpen = Boolean(menuAnchor);

  const openPivotMenu = (e, i) => {
    selectedIndex.current = i;
    setMenuAnchor(e.currentTarget);
  };

  const handleMenuClose = (e) => {
    selectedIndex.current = null;
    setMenuAnchor(false);
  };

  const [modalOpen, setModalOpen] = useState(false);

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const deleteSavedPhrase = () => {
    if (selectedIndex.current !== null) {
      if (!savedPhrases[selectedIndex.current].conversation_index) {
        setSavedPhrases((prev) => {
          return prev.filter((item, i) => i !== selectedIndex.current);
        });
      } else {
        let { conversation_index, message_index, phrase } =
          savedPhrases[selectedIndex.current];
        let selectedMessage =
          conversations[conversation_index].chat[message_index];
        let updatedConversations = createUpdatedConversations({
          index: conversation_index,
          messageIndex: message_index,
          message: {
            ...selectedMessage,
            saved: selectedMessage.saved.filter(({ text }) => {
              text !== phrase;
            }),
          },
        });
        handleConversationsUpdate(updatedConversations);
      }
    }
    handleMenuClose();
  };

  function AddPhrasesModal({ modalOpen, handleModalClose }) {
    let singlePhrase = {
      phrase: "",
      translation: "",
    };
    const [phrases, setPhrases] = useState([singlePhrase]);

    const addPhraseBox = () => {
      setPhrases((currentPhrases) => {
        return [...currentPhrases, singlePhrase];
      });
    };

    const handleUpdatePhrases = () => {
      let newPhrases = phrases.filter(
        (phrase) => phrase.phrase !== "" && phrase.translation !== ""
      );
      newPhrases = newPhrases.map((phrase) => {
        return { conversation_index: null, message_index: null, ...phrase };
      });
      setSavedPhrases((savedPhrases) => {
        return [...savedPhrases, ...newPhrases];
      });
      handleModalClose();
    };

    return (
      <Modal open={modalOpen} onClose={handleModalClose}>
        <Box sx={{ ...modalStyle, ...(mobile ? { width: "80%" } : {}) }}>
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={1}
            sx={{ minWidth: "100%" }}
          >
            {phrases.map((item, i) => {
              return (
                <Stack
                  direction="column"
                  justifyContent=""
                  alignItems="flex-start"
                  spacing={1}
                  key={`add-phrases-component-${i}`}
                  sx={{
                    width: "100%",
                    padding: "1rem",
                    border: `1px solid #1976d2`,
                    borderRadius: "10px",
                  }}
                >
                  <Typography variant="h6" color="text.secondary">
                    {i}
                  </Typography>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={1}
                    sx={{ width: "100%" }}
                  >
                    <Input
                      sx={{ width: "45%" }}
                      placeholder="Phrase"
                      value={phrases[i].phrase}
                      onChange={(e) => {
                        setPhrases((phrases) => {
                          return [
                            ...phrases.slice(0, i),
                            {
                              phrase: e.target.value,
                              translation: phrases[i].translation,
                            },
                            ...phrases.slice(i + 1),
                          ];
                        });
                      }}
                      required
                    />
                    <Input
                      sx={{ width: "45%" }}
                      placeholder="Translation"
                      value={phrases[i].translation}
                      onChange={(e) => {
                        setPhrases((phrases) => {
                          return [
                            ...phrases.slice(0, i),
                            {
                              phrase: phrases[i].phrase,
                              translation: e.target.value,
                            },
                            ...phrases.slice(i + 1),
                          ];
                        });
                      }}
                      required
                    />
                  </Stack>
                </Stack>
              );
            })}
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={1}
              sx={{ marginTop: "2rem", width: "100%" }}
            >
              <Box>
                <Button
                  variant="text"
                  startIcon={<AddRoundedIcon />}
                  onClick={addPhraseBox}
                  disabled={phrases.length >= 5 ? true : false}
                >
                  <Typography variant="body1">Add more</Typography>
                </Button>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row-reverse",
                  width: "100%",
                }}
              >
                <Button variant="contained" onClick={handleUpdatePhrases}>
                  <Typography variant="body1">Submit</Typography>
                </Button>
              </Box>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    );
  }

  if (userDetails) {
    return (
      <>
        <AddPhrasesModal
          modalOpen={modalOpen}
          handleModalClose={handleModalClose}
        />
        <Stack
          className="dictionary-container"
          direction="column"
          justifyContent="center"
          alignItems="start"
          spacing={3}
        >
          <Box className="dictionary-hero">
            <Typography
              variant={!mobile ? "h1" : "h3"}
              sx={{
                color: "#1976d2",
                ...(mobile && { marginTop: "1rem" }),
              }}
            >
              Dictionary
            </Typography>
          </Box>
          <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            spacing={2}
            className="add-saved-container"
          >
            <Typography
              variant={!mobile ? "h6" : "body1"}
              sx={{
                ...(mobile && { marginTop: "1rem" }),
              }}
            >
              Add Saved
            </Typography>
            <IconButton
              color="primary"
              onClick={() => {
                setModalOpen(true);
              }}
            >
              <AddRoundedIcon sx={{ width: "2rem", height: "2rem" }} />
            </IconButton>
          </Stack>
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography
                      variant={!mobile ? "h6" : "body1"}
                      color="primary"
                    >
                      Phrase
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant={!mobile ? "h6" : "body1"}
                      color="primary"
                    >
                      Translation
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography
                      variant={!mobile ? "h6" : "body1"}
                      color="primary"
                    >
                      Actions
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {savedPhrases.map((item, i) => (
                  <TableRow
                    key={`phrase-${i}`}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell scope="row">
                      <Typography variant="body1">{item.phrase}</Typography>
                    </TableCell>
                    <TableCell scope="row">
                      <Typography variant="body1">
                        {item.translation}
                      </Typography>
                    </TableCell>
                    <TableCell align="center" scope="row">
                      <IconButton
                        onClick={(e) => {
                          openPivotMenu(e, i);
                        }}
                      >
                        <MoreVertRoundedIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Menu
              anchorEl={menuAnchor}
              open={menuOpen}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={deleteSavedPhrase}>
                <ListItemIcon>
                  <DeleteOutlineRoundedIcon fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText>Delete</ListItemText>
              </MenuItem>
              <MenuItem>Dictionary</MenuItem>
            </Menu>
          </TableContainer>
        </Stack>
      </>
    );
  }
}
