import Backdrop from '@mui/material/Backdrop';



export default function BackdropCustom({ open, text }) {


    return (

        <Backdrop
            sx={{ color: '#fff', position: 'absolute', zIndex: (theme) => theme.zIndex.drawer }}
            open={open}
        >
            {text}
        </Backdrop>

    );
}
