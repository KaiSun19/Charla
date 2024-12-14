import { modalStyle } from "@/Constants";
import { useCharlaContext } from "@/Contexts/UserContext";
import { SavedPhrase } from "@/Utils/types";
import { CloseRounded, DoneRounded, RestartAltRounded, ShuffleRounded } from "@mui/icons-material";
import { Box, ButtonGroup, CircularProgress, IconButton, LinearProgress, Modal, Stack, Switch, Typography } from "@mui/material";
import { useEffect, useState } from "react";

interface Props {
  modalOpen : boolean;
  handleModalClose: () => void;
  savedPhrases : SavedPhrase[];
}

interface RememberedChange {
  index : number;
  remembered : boolean;
}

const sortFlashcards = (a: SavedPhrase, b: SavedPhrase): number => {
  const convo_diff = a.conversation_index - b.conversation_index;
  if (convo_diff !== 0) {
    return convo_diff;
  }
  return a.message_index - b.message_index;
};

export default function FlashcardsModal({ modalOpen, handleModalClose, savedPhrases } : Props) {
  const { mobile, setSavedPhrases } = useCharlaContext();

  const [flashcards, setFlashcards ] = useState<SavedPhrase[]>([]);
  const [flashcardNumber, setFlashcardNumber] = useState(0);
  const [trackProgress, setTrackProgress] = useState(false);
  const [rememberedChanges, setRememberedChanges] = useState<RememberedChange[]>([]);
  const [faceShown , setFaceShown] = useState('phrase');
  const [shuffleOn, setShuffleOn] = useState(false);
  const [completed, setCompleted] = useState(false);

  const changeFaceShown = () => {
    const text = document.querySelector('flashcard-text');
    setFaceShown(faceShown === 'phrase' ? 'translation' : 'phrase');
    text?.classList.add('text-fade-in-out');
    setTimeout(()=>{
        text?.classList.remove('text-fade-in-out');
    }, 500)
  }

  const currentFlashcardIncorrect = () =>{
    trackPhrase(false);
    if(flashcardNumber === flashcards.length - 1){
      setCompleted(true)
    }
    else{
      setFlashcardNumber(flashcardNumber + 1);
    }
  }

  const currentFlashcardCorrect = () =>{
    trackPhrase(true);
    if(flashcardNumber === flashcards.length - 1){
      setCompleted(true)
    }
    else{
      setFlashcardNumber(flashcardNumber + 1);
    }  
  }

  const trackPhrase = (remembered: boolean) => {
    const currentFlashcardIndex = savedPhrases.findIndex((item : SavedPhrase) => item.phrase === flashcards[flashcardNumber]['phrase']);
    setRememberedChanges([...rememberedChanges, {index : currentFlashcardIndex, remembered}])
  };

  const toggleShuffle = () => {
    setShuffleOn(!shuffleOn)
    if(!shuffleOn){
      setFlashcards(shuffleFlashcards(flashcards))
    }
    else{
      setFlashcards(flashcards.sort(sortFlashcards))
    }
  }

  const shuffleFlashcards = (flashcards : SavedPhrase[]) => {
    const shuffledArray = [...flashcards];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  }

  const getRemainingPhrases = () => {
    const totalPhrases = savedPhrases.length;
    const rememberedPhrases = savedPhrases.filter(phrase => phrase.remembered).length;
    return totalPhrases > 0 ? (rememberedPhrases / totalPhrases) * 100 : 0;
  }

  const restartFlashcards = () => {
    setFlashcardNumber(0);
    setRememberedChanges([]);
    setTrackProgress(false);
    setCompleted(false);
  }

  useEffect(()=>{
    if(trackProgress){
      setFlashcards(savedPhrases.filter((phrase : SavedPhrase) => !phrase.remembered))
    }
    else{
      setFlashcards(savedPhrases)
    }
    setFlashcardNumber(0)
  }, [trackProgress, savedPhrases])

  useEffect(() => {
    const updatedPhrases = [...savedPhrases];

    rememberedChanges.forEach(({ index, remembered }) => {
      if (updatedPhrases[index]) {
        if (updatedPhrases[index].remembered !== remembered) {
          updatedPhrases[index].remembered = remembered;
        }
      }
    });

    setSavedPhrases(updatedPhrases);
  }, [rememberedChanges]);

  const flashcardStyles = {width : '100%', height : '50%', display : 'flex', flexDirection : 'column', justifyContent : 'space-between', alignItems : 'center', 
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',borderRadius : '8px',
    '&:hover': {
      cursor: 'pointer'
    }};

    if(flashcards.length > 0 ){
      return (
        <Modal open={modalOpen} onClose={handleModalClose}>
          <Box sx={{ ...modalStyle, ...(mobile ? { width: "100%", height : '100%', borderRadius : 0 } : {height : 800, width : 400}) }}>
              <Box sx = {{width : '100%', height : '10%', display : 'flex', justifyContent : 'space-between', alignItems : 'center', padding : '0.5rem 0'}}>
                <Typography variant = {mobile ? 'h5' : 'h4'}>
                  Flashcards
                </Typography>
                <IconButton onClick={handleModalClose}>
                  <CloseRounded className="icon-l"/>
                </IconButton>
              </Box>
              <Box sx = {{width : '100%', height : '10%', display : 'flex', justifyContent : 'space-between', alignItems : 'center', padding : '0.5rem 0'}}>
                  <LinearProgress variant="determinate" value={(flashcardNumber / flashcards.length)*100} color = 'primary'sx = {{ width : '80%', height : '0.5rem', borderRadius : '0.5rem', paddingRight : '0.5rem'}}/> 
                  <Typography variant = 'h6'>
                      {flashcardNumber + 1}/{flashcards.length}
                  </Typography>
              </Box>
              {
                completed ? (
                  <Box sx = {{width : '100%', height : '50%', display : 'flex', flexDirection : 'column', justifyContent : 'space-around', alignItems : 'center'}}>
                    <Typography variant = 'h4'>
                        You're all caught up 
                    </Typography>
                    <Stack direction = 'row' sx = {{width :'100%', justifyContent : 'space-around', alignItems : 'center'}}>
                      <Stack direction="column" spacing={2} sx = {{justifyContent : 'space-between', alignItems : 'center', width : '100%'}} >
                        <Box sx = {{display: 'flex', width: '100%', flexDirection : 'row' , justifyContent : 'space-between', alignItems : 'center'}}>
                          <Typography variant = 'body1' sx = {{width : '25%', marginRight : '10%', textWrap : 'nowrap'}}>
                            Completed: {savedPhrases.filter(phrase => phrase.remembered).length}
                          </Typography>
                          <LinearProgress variant="determinate" value={getRemainingPhrases()} color='success' sx = {{flexGrow : 1, height : '1rem', borderRadius : '0.5rem', opacity : 0.8}}/>
                        </Box>
                        <Box sx = {{display: 'flex', width: '100%', flexDirection : 'row' , justifyContent : 'space-between', alignItems : 'center'}}>
                          <Typography variant = 'body1' sx = {{width : '25%', marginRight : '10%', textWrap : 'nowrap'}}>
                            Remaining: {savedPhrases.length - savedPhrases.filter(phrase => phrase.remembered).length}
                          </Typography>
                          <LinearProgress variant="determinate" value={100 - getRemainingPhrases()} color='error' sx = {{flexGrow : 1, height : '1rem', borderRadius : '0.5rem', opacity : 0.8}}/>
                        </Box>
                      </Stack>
                    </Stack>
                    <Stack justifyContent='space-around' alignItems="center" direction='row' sx = {{width : '100%', marginTop : '2rem'}}>
                      <Typography variant = 'h4'>
                          Restart ? 
                      </Typography>
                      <IconButton color="primary" sx = {{padding : '0.1rem', opacity : 0.8, backgroundColor: 'primary.main', '&:hover' : { opacity : 1, backgroundColor : 'primary.main'}}} onClick={restartFlashcards}><RestartAltRounded className = 'icon-xl' sx = {{color: 'black'}}/></IconButton>
                    </Stack>
                  </Box>
                ) : (
                  <>      
                <Box sx = {flashcardStyles} onClick={changeFaceShown}>
                  <Box
                          sx={{
                              height : '90%',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                          }}
                      >
                          <Typography variant = 'h6' sx  = {{padding : '1rem',  transition : 'opacity 0.5s ease'}} className='flashcard-text'>
                              {faceShown === 'phrase' ? flashcards[flashcardNumber].phrase :flashcards[flashcardNumber].translation}
                          </Typography>
                      </Box>
                      <Box
                          sx={{
                              backgroundColor: 'primary.main',
                              textAlign: 'center',
                              height : '10%', 
                              width : '100%', 
                              color: 'white',
                              borderRadius : '0px 0px 8px 8px'
                          }}
                          className = 'flex-items-center'
                      >
                          <Typography variant="body1">
                              Click card to flip it
                          </Typography>
                      </Box>
                </Box>
                <ButtonGroup sx={{display: 'flex',alignItems: 'center',justifyContent: 'space-between', width : '100%', marginTop : '2rem'}}>
                      <IconButton sx = {{backgroundColor : '#a0242438', padding : '0', '&:hover' : { backgroundColor : '#a024245c', cursor : 'pointer'}, width : '45%', '&.MuiIconButton-root' : {borderRadius : '0.25rem'}}} onClick={currentFlashcardIncorrect}><CloseRounded className = 'icon-xl' color='error' /></IconButton>
                      <IconButton sx = {{backgroundColor : '#2e7d321f', padding : '0', '&:hover' : { backgroundColor : '#2e7d3254', cursor : 'pointer'}, width : '45%', '&.MuiIconButton-root' : {borderRadius : '0.25rem'}}} onClick={currentFlashcardCorrect}><DoneRounded className = 'icon-xl' color = 'success' /></IconButton>
                </ButtonGroup>
                <Stack justifyContent='space-between' alignItems="center" direction='row' sx = {{width : '100%', marginTop : '1rem'}}>
                  <Box sx={{display: 'flex',alignItems: 'center',justifyContent: 'center', width  : '50%', flexDirection : 'column'}}>
                      <Typography variant='body1'>Track Progress</Typography>
                      <Switch checked={trackProgress} onChange={()=> {setTrackProgress(!trackProgress)}} />
                  </Box>
  
                  <Box sx={{display: 'flex',alignItems: 'center',justifyContent: 'center',  width  : '50%'}}>
                      <Typography variant='body1'>Shuffle</Typography>
                      <IconButton onClick = {toggleShuffle}>
                      < ShuffleRounded className="icon-xl" sx={{ color: shuffleOn ? "#ffd54f" : 'inherit' }} />
                      </IconButton>
                  </Box>
              </Stack>
              </>
              )
              }
            </Box>
        </Modal>
      );
    } 
  }