import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import { useState,useEffect } from "react";

const Search = ({sendData}) => {
  const[searchs,setSearch]=useState('')
  const [searchQuery, setSearchQuery] = useState('');
  


  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
    
  };
  
 // send data to parent component...
 useEffect(() => {
  sendData(searchQuery);
}, [searchQuery, sendData]);


  return(
  <>
    
    <TextField
      id="search-bar"
      className="text"
      value={searchQuery}
      onChange={handleSearchInputChange}
      size="small"
      sx={{width:200}}
      InputProps={{sx:{height:30,}}}  
      
    />
    <IconButton type="submit" aria-label="search" style={{backgroundColor:"#535C91", border:'1% solid blue', borderRadius:'10%', height:'2.4ch'}} sx={{width:40}}   >
      <SearchIcon style={{ fill: "white" }} />
    </IconButton>
   
  </>
  )
};
export default Search;

