import { DialogActions, DialogContent, TextField } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";

import Button from "@mui/material/Button";
import { useRef } from "react";

import { createList } from "@/utils/client";
import useSongs from "@/hooks/useSongs";

type NewListDialogProps = {
  open:boolean;
  onClose: () => void;

}



export default function NewListDialog({ open, onClose }: NewListDialogProps) {
  // using a ref to get the dom element is one way to get the value of a input
  const textfieldRefName = useRef<HTMLInputElement>(null);
  const textfieldRefDescription = useRef<HTMLInputElement>(null);
  const { fetchLists } = useSongs();

  const handleAddList = async () => {
    try {
      await createList({
        list_name: textfieldRefName.current?.value ?? "", description: textfieldRefDescription.current?.value ?? "",
        songs: []
      });
     
      fetchLists();
    } catch (error) {
      alert("Error: Failed to create list");
    } finally {
      onClose();
    }
  };



  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add a list</DialogTitle>
      <DialogContent>
        <TextField
          inputRef={textfieldRefName}
          label="請輸入清單名稱"
          variant="outlined"
          sx={{ mt: 2 }}
          autoFocus
        />
        <TextField
          inputRef={textfieldRefDescription}
          label="請輸入清單敘述"
          variant="outlined"
          sx={{ mt: 2, width: '100%' }}
          
          autoFocus
        />
      </DialogContent>
      <DialogActions>smi
        <Button onClick={handleAddList}>Add</Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>

  );
}
  