import { Box, Container } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';



export default function BackdropTask({ open, text, Icon }) {


    return (

        <Backdrop
            sx={{ color: '#fff', position: 'absolute', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
        >
            <Box sx={{ justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ textAlign: 'center', marginBottom: 10 }}>
                    {Icon}
                </div>
                <div>
                    {text}
                </div>
            </Box>


        </Backdrop>

    );
}
