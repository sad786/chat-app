import React, { useState, useRef, useEffect } from "react";
import { Box, TextField, Button, List, ListItem, ListItemText, Paper } from "@mui/material";

const New = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Function to handle sending a message
  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, message]);
      setMessage("");
    }
  };

  // Function to handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Auto-scroll to the bottom of the message box
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        padding: "16px",
        boxSizing: "border-box",
      }}
    >
      {/* Message Box */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          marginBottom: "16px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          padding: "8px",
        }}
      >
        <List>
          {messages.map((msg, index) => (
            <ListItem key={index}>
              <Paper
                sx={{
                  padding: "8px",
                  backgroundColor: "#e0e0e0",
                  borderRadius: "4px",
                }}
              >
                <ListItemText primary={msg} />
              </Paper>
            </ListItem>
          ))}
          <div ref={messagesEndRef} />
        </List>
      </Box>

      {/* Input and Button */}
      <Box
        sx={{
          display: "flex",
          gap: "8px",
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button variant="contained" onClick={handleSendMessage}>
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default New;