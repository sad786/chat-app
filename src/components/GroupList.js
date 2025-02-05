import React from "react";
import {List, ListItem, ListItemText, Paper, Typography } from "@mui/material";

const groups = [
    {id:1, name:"Tech Enthusiasts"},
    {id:2, name:"Gaming Zone"},
    {id:3, name:"React Developer"}
];

const GroupList = ({ onSelectGroup }) =>{
    return (
        <Paper elevation={3} sx={{ padding:2, height:"100%"}}>
            <Typography variant="h6">Groups</Typography>
            <List>
                {groups.map((group) => (
                    <ListItem button key= {group.id} onClick={() => onSelectGroup(group)}>
                        <ListItemText primary={group.name} />
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};

export default GroupList