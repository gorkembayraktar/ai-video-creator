
import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import useGlobalStore from './../store/globalStore'
import CustomSlider from './CustomSlider';
import { FormControlLabel, Switch, Typography } from '@mui/material';
import Models from './Models';

export default function ElevenlabsSetting() {

    const {
        speakerBoost, speakerBoostToggle, selectModel,
        stability, similarity, style, elevenlabsOpen, updateElevenlabsOpen, updateStability, updateSimilarity, updateStyle } = useGlobalStore((state) => ({
            elevenlabsOpen: state.elevenlabsOpen,
            updateElevenlabsOpen: state.updateElevenlabsOpen,
            updateStability: state.updateStability,
            updateSimilarity: state.updateSimilarity,
            updateStyle: state.updateStyle,
            stability: state.stability,
            similarity: state.similarity,
            style: state.style,
            speakerBoost: state.speakerBoost,
            speakerBoostToggle: state.speakerBoostToggle,
            selectModel: state.selectModel
        }));

    const toggleDrawer = (newOpen: boolean) => () => {
        updateElevenlabsOpen(newOpen);
    };

    //


    const DrawerList = (
        <Box sx={{ width: 350 }} role="presentation" onClick={() => toggleDrawer(false)}>

            <Typography align='center' padding={2} gutterBottom>
                ElevenLabs Ayarları
            </Typography>

            <Models />
            <CustomSlider
                title="Stability"
                minlabel="More variable"
                maxlabel="More stable"
                query={{
                    than: 30,
                    type: 'less',
                    label: 'Under 30% may lead to instability'
                }}
                update={updateStability}
                defaultVolume={stability}

            />
            <CustomSlider
                title="Similarity"
                minlabel="Low"
                maxlabel="High"
                query={null}
                update={updateSimilarity}
                defaultVolume={similarity}
            />
            {
                selectModel == 'eleven_multilingual_v2' &&
                <>
                    <CustomSlider
                        title="Style Exaggeration"
                        minlabel="None"
                        maxlabel="Exaggerated"
                        query={{
                            than: 50,
                            type: 'more',
                            label: 'Over 50% may lead to instability'
                        }}
                        update={updateStyle}
                        defaultVolume={style}
                    />
                    <Box sx={{ p: 2 }}>
                        <FormControlLabel control={<Switch checked={speakerBoost} onChange={speakerBoostToggle} />} label="Speaker boost" />
                    </Box>
                </>


            }





            <Divider />

        </Box>
    );


    return (
        <div style={{ zIndex: 999999 }}>

            <Drawer open={elevenlabsOpen} onClose={toggleDrawer(false)} >
                {DrawerList}
            </Drawer>
        </div>
    );
}

