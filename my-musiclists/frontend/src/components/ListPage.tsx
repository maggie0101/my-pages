//import * as React from 'react';
import {useState } from "react";

import Button from '@mui/material/Button';

import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import type { ListProps } from '@/hooks/useSongs';

import ListElement from "./ListElement";
import NewListDialog from "./NewListDialog";



type ListPageProps = {
  lists:ListProps[];
  setShowSongPage:React.Dispatch<React.SetStateAction<boolean>>;
  setListIdClick:React.Dispatch<React.SetStateAction<string>>;
  setListNameClick:React.Dispatch<React.SetStateAction<string>>;
  setListDescriptionClick:React.Dispatch<React.SetStateAction<string>>;
  
  

}









export default function ListPage({
  lists,
  setShowSongPage,
  setListIdClick,
  setListNameClick,
  setListDescriptionClick,

}:ListPageProps){
  const [newListDialogOpen, setNewListDialogOpen] = useState(false);
  const [deleteListMode, setDeleteListMode] = useState(false);

  

  
  return(
    <>
      <CssBaseline/>
      <main>
        <Box sx={{bgcolor: 'background.paper',pt: 8,pb: 6,}}>
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              My Playlists
            </Typography>
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Button
                variant="contained"
                size="small"
                onClick={() => setNewListDialogOpen(true)}
              >Add</Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setDeleteListMode(!deleteListMode)}
              >{deleteListMode ? 'Done' : 'Delete'}</Button></Stack>
            
          </Container>
        </Box>
        <Container sx={{ py: 8 }} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {lists.map((list) => (
              <Grid item key={list.id} xs={12} sm={6} md={4}>
                <ListElement
                  key = {list.id}
                  list = {list}
                  setShowSongPage = {setShowSongPage}
                  deleteListMode = {deleteListMode}
                  setListIdClick = {setListIdClick}
                  setListNameClick = {setListNameClick}
                  setListDescriptionClick = {setListDescriptionClick}

                />  
              </Grid>

            ))}
          </Grid>
        </Container>
        <NewListDialog 
          open={newListDialogOpen}
          onClose = {() => setNewListDialogOpen(false)}
        />
      </main>
      



    </>


  )
}