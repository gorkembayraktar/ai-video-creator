import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material"
import { useAlert } from '../hooks/useAlert';
import useGlobalStore from './../store/globalStore'


import { useEffect, useState } from "react";


import { DEFAULT_ELEVENLABS_TOKEN } from "../../../../config.js";

//const STORY = `Bir varmış bir yokmuş, çok çok uzak diyarlarda Milly adında küçük bir kız varmış. Milly maceralara atılmayı ve etrafındaki dünyayı keşfetmeyi çok seviyormuş. Bir gece Milly yatağında uzanmış pencereden dışarı bakarken büyülü bir şey gördü. Bu çok güzel, parıldayan bir ay ışığıydı! `;

function StoryInput(): JSX.Element {

    const { error } = useAlert();

    const { story, updateStory, nextSection, updateNextSection, activeStep, updateActiveStep, updateElevenlabsOpen } = useGlobalStore((state) => (
        {
            updateStory: state.updateStory,
            story: state.story,
            nextSection: state.nextSection,
            updateNextSection: state.updateNextSection,
            activeStep: state.activeStep,
            updateActiveStep: state.updateActiveStep,
            updateElevenlabsOpen: state.updateElevenlabsOpen
        }
    ));

    const handleOk = () => {
        if (story.length < 2) {
            error('Hikaye giriniz.');
            return;
        }

        updateActiveStep(() => ({ activeStep: 0 }));
        updateNextSection(true);
    }

    const handleCancel = () => {
        updateNextSection(false);
    }


    const handleElevenlabs = () => {
        updateElevenlabsOpen(true)
    }




    return (
        <div className="storyInput">
            <div>
                <TextField
                    inputProps={{ style: { color: "white" } }}
                    InputLabelProps={{
                        style: { color: '#fff', padding: '5px' },
                    }}
                    label="Hikaye Yazınız.."
                    id="outlined-size-small"
                    value={story}
                    size="small"
                    multiline
                    rows={10}
                    fullWidth
                    onChange={(e) => updateStory(e.target.value)}
                    disabled={nextSection}
                    sx={{
                        "& .MuiInputBase-input.Mui-disabled": {
                            WebkitTextFillColor: "grey",
                        },
                        padding: '8px'
                    }}
                />
            </div>
            <Voiser />

            <Button onClick={handleElevenlabs} fullWidth>Elevenlabs Ayarla</Button>

            {
                !nextSection ?
                    <Button
                        color="info"
                        onClick={handleOk} variant='contained' fullWidth size="small" sx={{ my: 2 }}>
                        Tamam
                    </Button>
                    :
                    <Button
                        color="error"
                        onClick={handleCancel} variant='contained' fullWidth size="small" sx={{ my: 2 }}>
                        Vazgeç
                    </Button>

            }


        </div>
    )
}



const Voiser = () => {
    const { selectVoice, updateSelectVoice, updateSetting } = useGlobalStore((state) => (
        {
            selectVoice: state.selectVoice,
            updateSelectVoice: state.updateSelectVoice,
            updateSetting: state.updateSetting
        }
    ));


    const [voices, setVoices] = useState([]);

    useEffect(() => {

        voicesData();
    }, []);

    const voicesData = async () => {
        const result = await fetch("https://api.elevenlabs.io/v1/voices").then(data => data.json());
        if (result.voices) {
            setVoices(result.voices);
        }

    }

    const handleChange = async (e) => {
        updateSelectVoice(e.target.value);


        const { similarity_boost, stability, style, use_speaker_boost } = await fetch(
            `https://api.elevenlabs.io/v1/voices/${e.target.value}/settings`,
            { headers: { "xi-api-key": DEFAULT_ELEVENLABS_TOKEN } }

        ).then(data => data.json());

        updateSetting(similarity_boost * 100, stability * 100, style * 100, use_speaker_boost);
    }




    return <Box sx={{ m: 2 }}>
        <FormControl sx={{}} fullWidth>
            <InputLabel id="demo-simple-select-label" sx={{ color: '#fff' }}>Seslendirici</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectVoice}
                label="Age"
                size="small"
                sx={{ color: '#fff' }}
                onChange={handleChange}
            >
                {
                    voices.map((voice: any) => <MenuItem value={voice.voice_id}>{voice.name}</MenuItem>)
                }


            </Select>
        </FormControl>
    </Box>
}

export default StoryInput
