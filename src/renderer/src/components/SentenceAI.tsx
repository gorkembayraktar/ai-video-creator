import { Box, Grid } from "@mui/material"
import FileButton from "./FileButton"



import useGlobalStore from './../store/globalStore'
import { useEffect, useState } from "react";



function SentenceAI({ sentence, id }): JSX.Element {



    return (


        <Box sx={{ textAlign: 'left', p: 1, bgcolor: 'gray', mb: 1 }} style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
            {sentence}
        </Box>

    )
}

export default SentenceAI
