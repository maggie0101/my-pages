import { DialogActions, DialogContent, TextField, Box } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { useRef } from "react";
import { createSong } from "@/utils/client";
import useSongs from "@/hooks/useSongs";

type NewSongDialogProps = {
  open: boolean;
  onClose: () => void;
  list_id: string;

};

export default function NewSongDialogProps({ open, onClose, list_id }: NewSongDialogProps) {
  const textfieldRefSongName = useRef<HTMLInputElement>(null);
  const textfieldRefSinger = useRef<HTMLInputElement>(null);
  const textfieldRefLink = useRef<HTMLInputElement>(null);
  const { fetchSongs } = useSongs();

  const handleAddSong = async () => {
    try {
      
      await createSong({ 
        song_name: textfieldRefSongName.current?.value ?? "", 
        singer: textfieldRefSinger.current?.value ?? "", 
        link: textfieldRefLink.current?.value ?? "", 
        list_id:list_id,
      });
      await fetchSongs();
    } catch (error) {
      alert("Error: Failed to create song");
    } finally {
      onClose();
    }
  };


  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add a list</DialogTitle>
      <DialogContent>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="left"
          width="500px" // Adjust the width as needed
        >
          <TextField
            inputRef={textfieldRefSongName}
            label="請輸入歌曲名稱"
            variant="outlined"
            sx={{ mb: 2 }}
            autoFocus
          />
          <TextField
            inputRef={textfieldRefSinger}
            label="請輸入歌手"
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            inputRef={textfieldRefLink}
            label="請輸入歌曲連結"
            variant="outlined"
            sx={{ mb: 2 }}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={handleAddSong}>
          Add
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
