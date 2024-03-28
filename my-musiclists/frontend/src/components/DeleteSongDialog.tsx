
import { DialogActions, DialogContent, TextField } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

import { deleteSong } from "@/utils/client";
import useSongs from "@/hooks/useSongs";

type DeleteSongDialogProps={
  open:boolean,
  onClose: () => void;
  selectedSongs:string[];
  setSelectedSongs:React.Dispatch<React.SetStateAction<string[]>>;
  selectedSongsName:string[];
  setSelectedSongsName:React.Dispatch<React.SetStateAction<string[]>>;
  
}

export default function DeleteSongDialog({
  open,
  onClose,
  selectedSongs,
  setSelectedSongs,
  selectedSongsName,
  setSelectedSongsName,

}:DeleteSongDialogProps){

  

  const { fetchSongs } = useSongs();
  const deleteSelectedSongs = async () => {
    try {
      
      for (const selected of selectedSongs){
        await deleteSong(selected);
      }
      // 删除完成后，重新获取歌曲列表
      fetchSongs();
    } catch (error) {
      alert("Error: Failed to delete songs");
    } finally {
      // 清空选中的歌曲数组
      setSelectedSongs([]);
      setSelectedSongsName([]);

      onClose();
    }
  };
  
  
  return (

  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Are you sure you want to delete?</DialogTitle>
      <DialogContent>
        <TextField
          multiline  // 设置为多行文本输入框
          variant="outlined"  // 根据需要设置样式
          fullWidth  // 设置文本框宽度为100%
          value={(selectedSongsName).join('\n')} 
        />
        
      </DialogContent>
      <DialogActions>
          <Button onClick={ deleteSelectedSongs}>Delete</Button>


        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>

  </Dialog>



  )
}