
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import { Delete as DeleteIcon } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";

import type {ListProps} from "@/hooks/useSongs";
import { deleteList } from "@/utils/client";
import useSongs from "@/hooks/useSongs";





type ListElementProps = {
  list: ListProps;
  setShowSongPage:React.Dispatch<React.SetStateAction<boolean>>;
  deleteListMode:boolean;
  setListIdClick:React.Dispatch<React.SetStateAction<string>>;
  setListNameClick:React.Dispatch<React.SetStateAction<string>>;
  setListDescriptionClick:React.Dispatch<React.SetStateAction<string>>

}



export default function ListElement({
  list, 
  setShowSongPage,
  deleteListMode,
  setListIdClick,
  setListNameClick,
  setListDescriptionClick,
}:ListElementProps){
  const { fetchLists } = useSongs();

  const handleDelete = async () => {
    try {
      await deleteList(list.id);
      fetchLists();
    } catch (error) {
      alert("Error: Failed to delete list");
    }
  };



  

  
  

 
  return(
    <>
      <Card
        sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        
      >
        <CardMedia
          
          component="div"
          sx={{
            // 16:9
            pt: '56.25%',
          }}
          image="https://source.unsplash.com/random?wallpapers"
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h5" component="h2">
            {list.list_name}
          </Typography>
          <Typography>
            {list.songs.length} song(s)
          </Typography>
          <Button 
            
            onClick={() => {
            setShowSongPage(true)
            setListIdClick(list.id)
            setListNameClick(list.list_name)
            setListDescriptionClick(list.description)
          }}
          >
            View
          </Button>
          {deleteListMode && (
            <IconButton color="error" onClick={handleDelete}  >
              <DeleteIcon />
            </IconButton>
          )}
        </CardContent>
      </Card>
    </>
  )
}


