import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";




type HeaderBar = {
  setShowSongPage:React.Dispatch<React.SetStateAction<boolean>>;
  showSongPage: boolean;
  
}

export default function HeaderBar({setShowSongPage,showSongPage}:HeaderBar) {
  
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          WP Music
        </Typography>
        {showSongPage &&(
          <Button
            variant="contained"
            size="small"
            onClick={()=> setShowSongPage(false)}
          >Back
        </Button>
        )}
        
          
      </Toolbar>
    </AppBar>
  );
}
