import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import useGlobalStore from '../store/globalStore'



const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function Explorer() {

    const { explorer, updateExplorer, updateActiveStep, updateNextSection } = useGlobalStore((state) => (
        {
            explorer: state.explorer,
            updateExplorer: state.updateExplorer,
            updateActiveStep: state.updateActiveStep,
            updateNextSection: state.updateNextSection
        }
    ));

    const handleClose = () => {
        updateExplorer({
            open: false
        })

        // reset step
        updateActiveStep(() => ({ activeStep: 0 }))
        updateNextSection(false)
    }

    const handleExplorer = () => {
        console.log(explorer);
        // @ts-ignore
        window.api.send("open-explorer", explorer.src.split('\\').slice(0, -1).join('\\'));
    }

    const handleVideo = () => {
        // @ts-ignore
        window.api.send("open-explorer", explorer.src);
    }

    return (
        <div>
            <Modal
                open={explorer.open}
                onClose={() => { }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Proje Klasörünü Aç
                    </Typography>
                    <Button variant='contained' onClick={handleVideo}>
                        Video Aç
                    </Button>

                    <Button variant='contained' onClick={handleExplorer}>
                        Klasörü Aç
                    </Button>

                    <Button variant='contained' onClick={handleClose}>
                        Kapat
                    </Button>
                </Box>
            </Modal>
        </div>
    );
}