import { Typography, Box, useTheme } from "@mui/material";


const Header = ({ title, subtitle }) => {
  const theme = useTheme();
  const colors = 'black';
  return (
    <Box mb="10px">
      <Typography
        variant="h5"
        color={'#283770'}
        fontWeight="600"
        sx={{ m: "0 0 5px 0" }}
        style={{textDecorationLine:'underline',textUnderlineOffset:9, }}
      >
        {title}
      </Typography>
      <Typography  color={'red'} fontSize='12px' fontWeight={'bold'}  >
       {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;
