import type {SongProps} from "@/hooks/useSongs";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';

import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';

import {useState, useEffect } from "react";


// ... 其他导入



type SongElementProps = {
  song: SongProps;
  selectedSongs:string[];
  setSelectedSongs:React.Dispatch<React.SetStateAction<string[]>>;
  selectedSongsName:string[];
  setSelectedSongsName:React.Dispatch<React.SetStateAction<string[]>>;
  isCheckedAll:boolean
  
  
  
  

};

export default function SongElement({
  song,
  selectedSongs,
  setSelectedSongs,
  selectedSongsName,
  setSelectedSongsName,
  isCheckedAll,

  
}: SongElementProps) {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    // 当 isCheckedAll 改变时，更新 isChecked 的状态
    setIsChecked(isCheckedAll);
  }, [isCheckedAll]);
  
  
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked); // 切换复选框的选中状态
    
    if (!isChecked ) {
      // 如果复选框被选中，将歌曲名称添加到已选择的歌曲列表中
      setSelectedSongs([...selectedSongs, song.id]);
      setSelectedSongsName([...selectedSongsName, song.song_name]);
    } else {
      // 如果复选框取消选中，将歌曲名称从已选择的歌曲列表中移除
      setSelectedSongs(selectedSongs.filter((id) => id !== song.id));
      setSelectedSongsName(selectedSongsName.filter((name) => name !== song.song_name));
    }
  };
  
 


  return (
  <TableContainer>
    <Table  aria-label="simple table">
      <TableBody>
        <TableRow key={song.id}>
          <TableCell component="th" scope="row" width={'10%'} align="center">
            <Checkbox
              color="primary"
              checked={isChecked}
              onChange={() => {handleCheckboxChange()}}
              
              
              
            />
          </TableCell>
          <TableCell align="center" width={'30%'}>
            {song.song_name}
          </TableCell>
          <TableCell align="center" width={'30%'}>
            {song.singer}
          </TableCell>
          <TableCell align="center" width={'30%'}>
            <a href={song.link} target="_blank" rel="noopener noreferrer">
              {song.link}
            </a>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </TableContainer>
  );
  
}
