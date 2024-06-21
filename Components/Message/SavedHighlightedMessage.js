import React, { useState } from "react";

const SavedHighlightedMessage = ({ message, saved }) => {
  let renderedMessage = [];
  let lastIndex = 0;
  saved.map(({ text, text_start, text_end }, index) => {
    if (text) {
      renderedMessage.push(
        <span>{message.substring(lastIndex, text_start)}</span>,
      );
      const substringToHighlight = message.substring(text_start, text_end + 1);
      console.log(substringToHighlight);
      const highlightText = (
        <span className="message-highlight-saved">{substringToHighlight}</span>
      );
      renderedMessage.push(highlightText);
      lastIndex = text_end + 1;
    }
  });
  renderedMessage.push(<span>{message.substring(lastIndex)}</span>);
  return (
    <p className="error-message-text">
      {renderedMessage.map((item, index) => (
        <React.Fragment key={`saved-span-${index}`}>{item}</React.Fragment>
      ))}
    </p>
  );
};

export default SavedHighlightedMessage;
