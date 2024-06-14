import { VolumeDown, VolumeUp } from "@mui/icons-material";
import { Box, Slider, Stack } from "@mui/material"
import FileButton from "@renderer/components/FileButton"
import React, { useEffect } from "react";

import useGlobalStore from './../store/globalStore'

function SelectBackgroundMusic(): JSX.Element {

    const backgroundVolume = useGlobalStore((state) => state.backgroundVolume);

    const { backgroundFile, updateBackgroundFile } = useGlobalStore((state) => ({
        backgroundFile: state.backgroundFile,
        updateBackgroundFile: state.updateBackgroundFile
    }));

    const [volume, setVolume] = React.useState(backgroundVolume);

    const handleChange = (event: Event, newValue: number | number[]) => {
        setVolume(newValue as number);
    };

    useEffect(() => {
        console.log('first', backgroundFile);
    }, []);

    const handleFile = (e) => {
        if (!e.target.files || e.target.files.length === 0) {
            updateBackgroundFile(null);
            return
        }

        updateBackgroundFile({
            file: e.target.files[0],
            src: e.target.files[0].path
        });


    }

    return (
        <Box sx={{ my: 5 }} className="SelectBackgroundMusic" >
            <Box sx={{ my: 2 }}>
                Arkaplan Müzik {backgroundFile && '(seçildi)'}
                <div>{backgroundFile?.src}</div>
                <FileButton text={'mp3 Seç'} accept={'.mp3'} onChange={handleFile} />
            </Box>

            <SliderComponent volume={volume} handleChange={handleChange} />
        </Box>
    )
}

const SliderComponent = ({ volume, handleChange }) => {

    const { backgroundVolume, updateBackgroundVolume } = useGlobalStore((state) => (
        {
            backgroundVolume: state.backgroundVolume,
            updateBackgroundVolume: state.updateBackgroundVolume
        }
    ));

    return <Box sx={{ my: 2 }}>
        Ses Seviyesi {backgroundVolume}
        <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
            <VolumeDown />
            <Slider
                valueLabelDisplay="on"
                aria-label="Always visible"
                value={volume}
                onChange={handleChange}
                onChangeCommitted={(event: React.SyntheticEvent | Event, value: number | Array<any>) => {
                    updateBackgroundVolume(value as Number);
                }}

            />
            <VolumeUp />
        </Stack>
    </Box>


}

export default SelectBackgroundMusic
