import CssBaseline from '@mui/material/CssBaseline';

import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';

import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';


import {useState } from "react";


import SongElement from "./SongElement";
import NewSongDialog from "./NewSongDialog"
import useSongs from "@/hooks/useSongs";
import DeleteSongDialog from './DeleteSongDialog';
import { TextField } from '@mui/material';
import { updateList } from '@/utils/client';



type SongPageProps = {

  list_id:string,
  list_name:string,
  description:string,
};

export default function SongPage({ list_id, list_name, description }: SongPageProps) {
  const [newSongDialogOpen, setNewSongDialogOpen] = useState(false);
  const {lists, fetchLists} = useSongs();
  const [selectedSongs, setSelectedSongs] = useState<string[]>([]);
  const [selectedSongsName, setSelectedSongsName] = useState<string[]>([]);
  const [deleteSongDialog, setDeleteSongDialog] = useState(false);
  const [isNameEditing, setIsNameEditing] = useState(false);
  const [isDescriptionEditing, setIsDescriptionEditing] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newListDescription, setNewListDescription] = useState("");
  const [isCheckedAll, setIsCheckedAll] = useState(false) ;




  const handleDoubleClickName = () => {
    setIsNameEditing(true);
    {lists.map((each) => {
      if (each.id === list_id) {
        setNewListName(each.list_name);
      }
    })}
     // 清空输入框
    
  };

  const handleDoubleClickDescription = () => {
    setIsDescriptionEditing(true);
    {lists.map((each) => {
      if (each.id === list_id) {
        setNewListDescription(each.description);
      }
    })}
    // 清空输入框
    
  };

  const handleSaveClick = async() => {
    // 在这里执行保存操作，更新列表名称
    // 使用 newSongName 和 list_id 进行更新
    try {
      if (newListName === list_name) {
        return;
      }
      await updateList(list_id,{
        list_name : newListName,
        
      });
      
      fetchLists(); 
    }catch(error) {
      alert("Error: Failed to change list name") 
    }finally{
      setIsNameEditing(false);
    }
  }

  const handleSaveClickDescription = async() => {
    // 在这里执行保存操作，更新列表名称
    // 使用 newSongName 和 list_id 进行更新
    try {
      if (newListDescription === description) {
        return;
      }
      await updateList(list_id,{
        
        description: newListDescription
      });
      fetchLists(); 
    }catch(error) {
      alert("Error: Failed to change list name")
      console.error(error)
    }finally{
      setIsDescriptionEditing(false);
    }
  }
    

  const handleCheckAll = () => {
    setIsCheckedAll(!isCheckedAll);

    if (isCheckedAll===false){
      setSelectedSongs([]);
      setSelectedSongsName([]);
      lists.find((list) => list.id === list_id)?.songs.forEach((song) => {
        setSelectedSongs((prevSelectedSongs) => [...prevSelectedSongs, song.id]);
        setSelectedSongsName((prevSelectedSongNames) => [...prevSelectedSongNames, song.song_name]);
      });
    }else{
      setSelectedSongs([]);
      setSelectedSongsName([]);


    }
    
   
  };

  
  return (
    <>
      <CssBaseline />
      <main>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          margin={2}
        >
          <Typography
            component="h1"
            variant="h2"
            align="left"
            color="text.primary"
            gutterBottom
            sx={{ mr: 5 }}
            onDoubleClick={handleDoubleClickName} 
            onBlur={handleSaveClick}
            // 当输入框失去焦点时保存更改
          >
            {isNameEditing ? (
              <TextField
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                
                autoFocus // 自动聚焦输入框
              />
            ) : (
              lists.map((each) => {
                if (each.id === list_id) {
                  return each.list_name;
                }
              })
            )}
          </Typography>
          <Typography
            component="h5"
            variant="h5"
            align="left"
            color="text.secondary"
            sx={{ mr:5 }}
            onDoubleClick={handleDoubleClickDescription} 
            onBlur={handleSaveClickDescription}
            // 当输入框失去焦点时保存更改
            
            
            gutterBottom
          >
            {isDescriptionEditing ? (
              <TextField
                type="text"
                value={newListDescription}
                onChange={(e) => setNewListDescription(e.target.value)}
                autoFocus // 自动聚焦输入框
              />
            ) : (
              lists.map((each) => {
                if (each.id === list_id) {
                  return each.description;
                }
              })
            )}
          </Typography>


          <Container maxWidth="sm">
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Box>
                <Button variant="contained" 
                  size="small" 
                  sx={{ mr: 5 }}
                  onClick={() => setNewSongDialogOpen(true)}
                >
                  Add
                </Button>
                <Button 
                  variant="outlined" 
                  size="small" 
                  onClick={() => {
                    if (selectedSongs.length > 0) {
                      setDeleteSongDialog(true);
                    }else{
                      alert('Please select songs before deleting!');
                    }


                  }}>
                  Delete
                </Button>
              </Box>
            </Stack>
          </Container>
        </Box>

        <TableContainer component={Paper}>
          <Table  aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center" width={'10%'}>
                  <Checkbox
                    checked={isCheckedAll}
                    onChange={handleCheckAll}/>
                </TableCell>
                <TableCell align="center" width={'30%'} >Song</TableCell>
                <TableCell align="center" width={'30%'}>Singer</TableCell>
                <TableCell align="center" width={'30%'}>Link</TableCell>
              </TableRow>
            </TableHead>
          </Table>
              {lists.map((each) => {
                if (each.id === list_id) {
                  return each.songs.map((song) => (
                        <SongElement 
                          key={song.id} 
                          song={song}  
                          selectedSongs={selectedSongs}
                          setSelectedSongs={setSelectedSongs}
                          selectedSongsName={selectedSongsName}
                          setSelectedSongsName={setSelectedSongsName}
                          isCheckedAll={isCheckedAll}
                        />  
                  ));
                }
                return null;
              })}
        </TableContainer>
        <NewSongDialog 
          open={newSongDialogOpen}
          onClose = {() => setNewSongDialogOpen(false)}
          list_id={list_id}
        />
        <DeleteSongDialog
          open={deleteSongDialog}
          onClose = {() => setDeleteSongDialog(false)}
          setSelectedSongs={setSelectedSongs}
          selectedSongs={selectedSongs}
          setSelectedSongsName={setSelectedSongsName}
          selectedSongsName={selectedSongsName}
          
        />
      </main>
    </>
  );
}
