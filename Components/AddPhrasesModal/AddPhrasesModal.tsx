import { modalStyle } from "@/Constants";
import { useCharlaContext } from "@/Contexts/UserContext";
import { SavedPhrase } from "@/Utils/types";
import { AddRounded } from "@mui/icons-material";
import { Box, Button, Input, Modal, Stack, Typography } from "@mui/material";
import { useState } from "react";

interface Props {
  modalOpen : boolean;
  handleModalClose: () => void;
}

export default function AddPhrasesModal({ modalOpen, handleModalClose } : Props) {
  const { mobile, savedPhrases , setSavedPhrases} = useCharlaContext();

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
      setSavedPhrases((savedPhrases : SavedPhrase[]) => {
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
                  alignItems="flex-start"
                  spacing={1}
                  key={`add-phrases-component-${i}`}
                  sx={{
                    width: "100%",
                    padding: "1rem",
                    border: `1px solid #5B6D92`,
                    borderRadius: "10px",
                    paddingBottom : mobile ? '1.5rem' : '1rem'
                  }}
                >
                  <Typography variant="h6" color="text.secondary">
                    {i}
                  </Typography>
                  <Stack
                    direction={mobile ? "column" : 'row'}
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={mobile ? 3 : 1}
                    sx={{ width: "100%" }}
                  >
                    <Input
                      sx={{ width: mobile ? "100%" : "45%" }}
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
                      sx={{ width: mobile ? "100%" : "45%" }}
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
                  startIcon={<AddRounded />}
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
                <Button variant="outlined" onClick={handleUpdatePhrases} sx = {{width : mobile ? '100%' : ''}}>
                  <Typography variant="body1">Submit</Typography>
                </Button>
              </Box>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    );
  }