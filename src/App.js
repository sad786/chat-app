
import './App.css';
import { Container, CssBaseline, ThemeProvider, createTheme, IconButton, Box, Stack } from "@mui/material";
import GroupList from './components/GroupList';
import ChatWindow from './components/ChatWindow';
import { useState, createContext } from 'react';
import { Brightness4, Brightness7 } from "@mui/icons-material";


//This is Theme Context that will apply on whole app

export const ThemeContext = createContext();


function App() {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // here deining themes
  const theme = createTheme({
    palette: {
      mode: darkMode ?"dark":"light",
      primary: {
        main: darkMode ? "#90caf9": "#1976d2",
      },
      background: {
        default: darkMode ?"#121212": "#ffffff",
        paper: darkMode ? "#1e1e1e":"#f5f5f5",
      },
    },
  });
  return (
    <ThemeContext.Provider
      value={{ darkMode, setDarkMode }}>
        <ThemeProvider theme={theme}>
        <CssBaseline />
      <Container sx={{ padding:3 }}>
        {/* Theme Toggle Button setting */}
        <IconButton sx={{ position:"absolute", top:10, right:10 }}
        onClick={() => setDarkMode(!darkMode)}>
          {darkMode ?<Brightness7/>:<Brightness4 />}
        </IconButton>
        
        {/* Layout using Stack */}
        <Stack direction={{xs: "column", md:"row" }} spacing={2} sx={{ height: "90vh"}}>
          {/* Group List setting */}
          <Box sx={{ width:{ xs: "100%", md: "30%" }, height:"100%", overflowY:"auto"}}>
            <GroupList onSelectGroup={setSelectedGroup} />
          </Box>

          {/* Chat Window Setup */}
          <Box sx={{ flexGrow: 1, height: "100%", overflowY:"auto" }}>
            <ChatWindow group={selectedGroup} />
          </Box>
        </Stack>
      </Container>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}


/*
const App = () =>{
  return (
    <New />
  );
};
*/
export default App;
