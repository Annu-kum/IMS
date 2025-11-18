import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Box, useMediaQuery } from '@mui/material';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from '../../../../account/BaseApi';

export default function Update_letterHeads(props) {
  const { openPopup, setOpenPopup, setids } = props;
  const [mainLetterHead, setMainLetterHead] = useState(null);
  const [extraLetterHeads, setExtraLetterHeads] = useState([]);  
  const token = localStorage.getItem('Token');

  const handleMainFileChange = (e) => {
    setMainLetterHead(e.target.files[0]);
  };

  const handleExtraFileChange = (e) => {
    setExtraLetterHeads(Array.from(e.target.files)); 
  };



  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();

    // 1If updating MAIN letterhead
    if (mainLetterHead) {
      formData.append("Installation_letterHead", mainLetterHead);
    }

  
    // 2 If updating EXTRA letterheads 
    if (extraLetterHeads.length > 0) {
      extraLetterHeads.forEach((file) => {
        formData.append("extra_letterheads", file);
      });
    }

    if (!mainLetterHead && extraLetterHeads.length === 0) {
      toast.error("Please select at least one file!");
      return;
    }

    try {
      await api.patch(`/installation/update-installation/${setids}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Token ${token}`,
        },
      });

      toast.success('Letter Head Updated Successfully!');
      setOpenPopup(false);
      setMainLetterHead(null);
      setExtraLetterHeads([]);

    } catch (error) {
      toast.error(error.response?.data?.error || "Error updating files");
    }
  };

  return (
    <Dialog open={openPopup} onClose={() => setOpenPopup(false)}>
      <DialogTitle style={{ background: '#E1E4EF', fontSize: '15px', fontWeight: 'bold', color: '#1B1A55' }}>
        Update LetterHead
      </DialogTitle>

      <DialogContent style={{ background: '#E1E4EF' }}>
        <Box padding="1rem">

          {/* MAIN LETTERHEAD */}
          <Box mb={2}>
            <label style={{ fontWeight: 'bold' }}>Main LetterHead</label><br />
            <input
              type="file"
              accept=".pdf,.png,.jpeg,.jpg"
              onChange={handleMainFileChange}
            />
          </Box>

          {/* EXTRA LETTERHEADS */}
          <Box mb={2}>
            <label style={{ fontWeight: 'bold' }}>Extra LetterHeads</label><br />
            <input
              type="file"
              multiple
              accept=".pdf,.png,.jpeg,.jpg"
              onChange={handleExtraFileChange}
            />
          </Box>

        </Box>
      </DialogContent>

      <DialogActions style={{ background: '#E1E4EF' }}>
        <Button
          sx={{
            background: `linear-gradient(#1B1A55,#9290C3)`,
            color: '#fff', fontWeight: 'bold',
            '&:hover': { background: '#9290C3' },
          }}
          onClick={handleSubmit}
        >
          Update
        </Button>

        <Button
          sx={{
            background: `linear-gradient(#1B1A55,#9290C3)`,
            color: '#fff', fontWeight: 'bold',
            '&:hover': { background: '#9290C3' },
          }}
          onClick={() => setOpenPopup(false)}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
