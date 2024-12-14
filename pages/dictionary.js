import { CharlaProvider, useCharlaContext } from "@/Contexts/UserContext";
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
  CssBaseline,
  TablePagination,
} from "@mui/material";

import AddPhrasesModal from "../Components/AddPhrasesModal/AddPhrasesModal";
import FlashcardsModal from "../Components/FlashcardsModal"

import React, { useEffect, useState, useRef} from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import { StyleRounded, DeleteOutlineRounded} from "@mui/icons-material";
import { useRouter } from "next/router";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

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

  const router = useRouter();
  const { query } = router;

  const [menuAnchor, setMenuAnchor] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [flashcardsOpen, setFlashcardsOpen] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleFlashcardsClose = () => {
    setFlashcardsOpen(false)
  }
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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

  useEffect(()=> {
    if(query.quick_add){
      setModalOpen(true)
    }
  }, [query.quick_add])

  if (userDetails) {
    return (
      <>
      <CharlaProvider>
        <CssBaseline />
        <AddPhrasesModal
          modalOpen={modalOpen}
          handleModalClose={handleModalClose}
        />
        <FlashcardsModal 
          modalOpen={flashcardsOpen}
          handleModalClose={handleFlashcardsClose}
          savedPhrases={savedPhrases}
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
                color: "#5B6D92",
                ...(mobile && { marginTop: "1rem" }),
              }}
            >
              Dictionary
            </Typography>
          </Box>
          <Stack direction="row" spacing={2} sx={{justifyContent: "center",alignItems: "center"}}>
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
            {
              savedPhrases.length > 0 ? 
              (
                <Stack
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="center"
                  spacing={2}
                  className="add-saved-container flashcard-container"
                >
                  <Typography
                    variant={!mobile ? "h6" : "body1"}
                    sx={{
                      ...(mobile && { marginTop: "1rem" }),
                    }}
                  >
                    Flashcards
                  </Typography>
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setFlashcardsOpen(true);
                    }}
                  >
                    <StyleRounded sx={{ width: "2rem", height: "2rem",color : 'white' }} />
                  </IconButton>
                </Stack>
              ): 
              (
                <Skeleton height={60} width={200} />
              ) 
            }
          </Stack>
          <TableContainer sx = {{border: `1px solid #5B6D92` , padding : '1rem', borderRadius : '8px'}}>
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
                {savedPhrases.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, i) => {
                  if(i < rowsPerPage){
                    return (
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
                    )
                  }
                }
                )}
              </TableBody>
            </Table>
            <Menu
              anchorEl={menuAnchor}
              open={menuOpen}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={deleteSavedPhrase}>
                <ListItemIcon>
                  <DeleteOutlineRounded fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText>Delete</ListItemText>
              </MenuItem>
              <MenuItem>Dictionary</MenuItem>
            </Menu>
          </TableContainer>
          <Box sx = {{width : '100%', display : 'flex', justifyContent : 'flex-end'}}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={savedPhrases.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
          />
          </Box>
        </Stack>
        </CharlaProvider>
      </>
    );
  }
}
