import React, { useState } from "react";

import { Typography, IconButton, Button } from "@mui/material";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import ClickAwayListener from "@mui/material/ClickAwayListener";

const ErrorHighlightedMessage = ({
  message,
  errors,
  handleErrorCorrection,
}) => {
  // state and handling related to error toolip
  const [errorTooltipOpen, setErrorTooltipOpen] = useState(
    new Array(errors.length).fill(false),
  );

  let errorIndexes = errors.map(({ Phrase }) => {
    const startIndex = message.indexOf(Phrase);
    if (startIndex === -1) {
      return null;
    }
    const endIndex = startIndex + Phrase.length;
    return [startIndex, endIndex];
  });
  let renderedMessage = [];
  let lastIndex = 0;
  errorIndexes.map((indexArray, index) => {
    const handleErrorTooltipOpen = () => {
      const updatedTooltipOpen = [...errorTooltipOpen];
      updatedTooltipOpen[index] = !updatedTooltipOpen[index];
      setErrorTooltipOpen(updatedTooltipOpen);
    };

    const handleErrorTooltipClose = () => {
      setErrorTooltipOpen(new Array(errors.length).fill(false));
    };

    if (indexArray) {
      let [start, end] = indexArray;
      if (start > 0) {
        renderedMessage.push(
          <span>{message.substring(lastIndex, start)}</span>,
        );
      }
      const substringToHighlight = message.substring(start, end);
      const highlightText = (
        <ClickAwayListener
          onClickAway={() => {
            handleErrorTooltipClose();
          }}
        >
          <span>
            <HtmlTooltip
              onClose={() => {
                handleErrorTooltipClose();
              }}
              open={errorTooltipOpen[index]}
              title={
                <React.Fragment>
                  <Typography
                    color="inherit"
                    sx={{
                      borderRight: "1px solid #C8C8C8",
                      paddingRight: "5px",
                    }}
                  >
                    error
                  </Typography>
                  <Typography color="inherit">
                    {errors[index]["Error"]}
                  </Typography>
                  <IconButton
                    onClick={() => {
                      handleErrorCorrection(
                        index,
                        errors[index]["Phrase"],
                        errors[index]["Correction"],
                      );
                    }}
                  >
                    <DoneRoundedIcon />
                  </IconButton>
                </React.Fragment>
              }
            >
              <Button
                onClick={(event) => {
                  event.stopPropagation();
                  handleErrorTooltipOpen();
                }}
                sx={{ padding: "0", color: "text.primary" }}
              >
                <span
                  className="message-highlight-error error-message-text"
                  id={`highlight-error-${index}`}
                >
                  {substringToHighlight}
                </span>
              </Button>
            </HtmlTooltip>
          </span>
        </ClickAwayListener>
      );
      renderedMessage.push(highlightText);
      lastIndex = end;
    }
  });
  renderedMessage.push(<span>{message.substring(lastIndex)}</span>);
  return (
    <p className="error-message-text">
      {renderedMessage.map((item, index) => (
        <React.Fragment key={`error-span-${index}`}>{item}</React.Fragment>
      ))}
    </p>
  );
};

export default ErrorHighlightedMessage;

const HtmlTooltip = styled(({ className, ...Message }) => (
  <Tooltip
    {...Message}
    classes={{ popper: className }}
    disableFocusListener
    disableHoverListener
    disableTouchListener
  />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "10px",
    boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
    background: theme.palette.background.paper,
    color: theme.palette.text.primary,
    maxWidth: "fit-content",
    padding: "5px",
    border: "1px solid #C8C8C8",
    borderRadius: "5px",
  },
}));
