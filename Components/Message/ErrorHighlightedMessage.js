import React, { useState } from "react";

import { Typography, IconButton, Button } from "@mui/material";
import { useCharlaContext } from "@/Contexts/UserContext";

const ErrorHighlightedMessage = ({
  message,
  errors,
}) => {

  const { handleDrawerOpen } = useCharlaContext()

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

    if (indexArray) {
      let [start, end] = indexArray;
      if (start > 0) {
        renderedMessage.push(
          <span>{message.substring(lastIndex, start)}</span>,
        );
      }
      const substringToHighlight = message.substring(start, end);
      const highlightText = (
          <span>
              <Button
                onClick={(event) => {
                  event.stopPropagation();
                  handleDrawerOpen(event, 'errors', 'Errors')
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
          </span>
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
