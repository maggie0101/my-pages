import { useEffect, useState } from "react";

import HeaderBar from "./components/HeaderBar";
import ListPage from "./components/ListPage";

import useSongs from "@/hooks/useSongs";


import SongPage from "./components/SongPage";






function App() {
  const { lists,  fetchLists, fetchSongs } = useSongs();
  const [showSongPage, setShowSongPage] = useState(false);
  const [listIdClck, setListIdClick] = useState("");
  const [listNameClick, setListNameClick] = useState("");
  const [listDescriptionClick, setListDescriptionClick] = useState("");


  
  


  useEffect(() => {
    fetchLists();
    fetchSongs();
  }, [fetchSongs, fetchLists]);
  
  



  return (
    <>
      <HeaderBar setShowSongPage={setShowSongPage} showSongPage={showSongPage}/>
      <main>
        <div>
          {showSongPage ? (  
            <SongPage 
              list_id={listIdClck} 
              list_name={listNameClick}
              description={listDescriptionClick} />

          ) : (
            <ListPage 
              lists={lists} 
              setShowSongPage={setShowSongPage} 
              setListIdClick={setListIdClick} 
              setListNameClick={setListNameClick}
              setListDescriptionClick={setListDescriptionClick}/>
          )}
        </div>
      </main>
    </>
  )





}
export default App;