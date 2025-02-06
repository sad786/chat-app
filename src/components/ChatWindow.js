import React, { useState, useRef, useEffect , useContext } from "react";
import { Box, Typography, Paper, TextField, Button, IconButton, Avatar } from "@mui/material";
import { io } from "socket.io-client";
import Picker from "emoji-picker-react";
import FavoriteIcon from "@mui/icons-material/Favorite"
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import { ThemeContext } from "../App";

const socket = io("https://app-server-h5vo.onrender.com/"); // Connect to WebSocket Server

const ChatWindow = ( { group }) =>{

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);
    const [userCount, setUserCount] = useState(0);
    const [reactionPicker, setReactionPicker] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const emojiRef = useRef(null);
    const messagesEndRef = useRef(null);
    const { darkMode } = useContext(ThemeContext);

    const toggleEmojiPicker = (event) => {
        event.stopPropagation();    // This will prevent closing when clicking the button itself 
        setShowEmojiPicker((prev) =>!prev);
    };


    const toggleReactionPicker = (index) => {
        setReactionPicker((prev) => (prev=== index? null:index));//Toggle reaction picer per message
    };

    const addReaction = (index, emoji) => {
        sendReaction(index, emoji);
        setMessages((prevMessages) => prevMessages.map((msg, i) => i=== index ? {...msg, reaction:emoji }:msg));
        setReactionPicker(null) // This will close picker after choosing a reaction
    };

    const handleKeyPress = (e) => {
         if (e.key === "Enter") {
           sendMessage();
         }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if(emojiRef.current && !emojiRef.current.contains(event.target)){
                setShowEmojiPicker(false);
            }
        };
        if(showEmojiPicker){
            document.addEventListener("click", handleClickOutside);
        }
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    },[showEmojiPicker]);

    useEffect(() =>{
        if(group) {
            socket.emit("leaveGroup");

            socket.emit("joinGroup", group.name);
            const handleReceiveMessage = (message) => {
                if(message.id!==socket.id){
                    setMessages((prev) => [...prev, message]);
                }
            };

            socket.on("receiveMessage", handleReceiveMessage);

            socket.on("receiveReaction", ({ messageIndex, reaction }) => {
                setMessages((prev) => {
                    const newMessage = [...prev];

                    newMessage[messageIndex].reaction = reaction;
                    return newMessage;
                });
            });

            socket.on("userCount", (count) => {
                setUserCount(count);
            });
            
            socket.on("userTyping", (status, id) =>{
                if(id !== socket.id){
                    setTyping(status);
                }
            })
            
            socket.on("disconnect", (count) =>{
                console.log(count);
                setUserCount(count-1);
            });
            return () => {
                socket.off("receiveMessage", handleReceiveMessage);
                socket.emit("leaveGroup");
                socket.off("receiveReaction");
                socket.off("userTyping");
                socket.off("userCount");
                socket.off("disconnect");
            };
        }
    }, [group]);

    const sendMessage = () => {
        if (input.trim()){
            const message = { sender: "You", text:input,
                timestamp: new Date().toLocaleTimeString(),
                group: group.name};
            setMessages((prev) => [...prev, message]);
            socket.emit("sendMessage", message);
            setInput("");
            socket.emit("stopTyping", group.name);
        }
    };


    const sendReaction = (index, reaction) => {
        socket.emit("sendReaction", { group: group.name, messageIndex:index, reaction});
    };
    const handleTyping = (e) =>{
        if(group===null){
            alert("Please join a group first!")
            return;
        }
        setInput(e.target.value);
        socket.emit("typing", group.name);
        setTimeout(() => socket.emit("stopTyping", group.name), 2000);
    };

    return (
        <Box elevation={3} sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            padding: "16px",
            boxSizing: "border-box",
            backgroundColor:darkMode ? '#1e1e1e': '#f5f5f5',
            color:darkMode ? "#fff":"#000",
            }}>
        
        <Typography sx = {{display:"flex", gap:"8px"}} variant="h6">{group?.name||"select a Group"} ({userCount} online)</Typography>

        <Box
         sx={{
                flexGrow: 1,
                overflowY: "auto",
                marginBottom: "16px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "8px"
            }}>
            {
                messages.map((msg, index) => (
                    
                    <Box
                        key={index}
                        sx={{
                            display:"flex",
                            flexDirection:"column",
                            alignItems:group.name === msg.group? "flex-end": "flex-start",
                            marginBottom:"10px",
                            position:"relative"
                        }}>
                        
                        {msg.group !== group.name && 
                        <Avatar sx={{ bgcolor:darkMode ? "#90caf9": "blue", marginRight:"8px" }}>{msg.sender[0]}</Avatar>}
                        
                        <Paper
                            elevation={3}
                            sx={{
                                padding:"8px 12px",
                                maxWidth:"70%",
                                backgroundColor:msg.group===group.name?"#007AFF":"#E5E5EA",
                                color:msg.group===group.name?"#fff":"#000",
                                borderRadius:"12px",
                                position:"relative"
                            }}>
                        <Typography variant="body2">
                            <strong>{msg.sender}:</strong>{msg.text}
                        </Typography>
                        
                        {msg.reaction && (<Typography sx={{
                             position: "absolute",
                              bottom:"-10px",
                               right:"5px",
                                fontSize:"18px"}}>
                                    {msg.reaction}
                                </Typography>)}
                            </Paper>
                        
                            {/** Timestamp  */}
                            <Typography variant="caption" sx={{ display: "block",
                                 textAlign:"right",
                                  marginTop:"4px"}}>
                            {msg.timestamp}
                            </Typography>
                            
                                <IconButton size="small" onClick={() => toggleReactionPicker(index)}
                                    sx={{ position:"absolute", bottom:"-10px", left:"-25px"}}><InsertEmoticonIcon
                                    fontSize="small" /></IconButton>
                                {/** Reaction Picker (only shown for selected message ) */}
                                {reactionPicker === index&&(
                                    <Box sx= {{ position:"absolute",
                                    bottom:"-30px",
                                    left:"-25px",
                                    display:"flex",
                                    gap:"5px",
                                    borderRadius:"5px",
                                    boxShadow:"1"}}>
                                        <IconButton size="small" onClick={() => addReaction(index, "❤")}>
                                            <FavoriteIcon fontSize="small" color="error" />
                                        </IconButton>
                                        <IconButton size="small" onClick={() => addReaction(index, "👍")}>
                                            <ThumbUpIcon fontSize="small" color="primary" />
                                        </IconButton>
                                        <IconButton size="small" onClick={() => addReaction(index, "😂")}>
                                            😃
                                        </IconButton>
                                    </Box>
                                )}
                        </Box>
                ))}
                <div ref={messagesEndRef} />
                {typing&&<Typography
                        variant="body2" color="gray">Someone is typing...</Typography>}

        </Box>

        <Box sx={{ display: "flex", marginTop:2 ,alignItems:"center", position:"revert-layer"}}>
            {/** Emoji Picker Button */}
            <IconButton
                 onClick={toggleEmojiPicker}>
                    <SentimentSatisfiedAltIcon />
            </IconButton>
            {showEmojiPicker && (
                <Box ref={emojiRef} sx={{ position:"absolute", bottom:"50px", left:"10px", zIndex:10 }}>
                <Picker
                    onEmojiClick={(event, emojiObject) => setInput((prev) => prev+emojiObject.emoji)} />
                </Box>)}

            <TextField
                fullWidth size="small"
                variant = "outlined"
                marginRight="5px"
                placeholder="Type a message..."
                value={input}
                onKeyDown = {handleKeyPress}
                onChange={handleTyping}/>
            <Button variant="contained" sx={{ m1: 1, marginLeft:"5px"}} onClick={sendMessage}>Send</Button>
        </Box>
    </Box>
    );
};

export default ChatWindow;
