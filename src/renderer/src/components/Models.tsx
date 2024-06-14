import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { memo, useCallback, useEffect, useState } from "react";


import useGlobalStore from './../store/globalStore'
import { DEFAULT_ELEVENLABS_TOKEN } from "../../../../config.js";

const Models = () => {

    const { selectModel, updateSelectModel } = useGlobalStore((state) => (
        {
            selectModel: state.selectModel,
            updateSelectModel: state.updateSelectModel
        }
    ));

    const [models, setModels] = useState([]);

    useEffect(() => {
        console.log('models loaded')

        loadData();

    }, [])

    const loadData = useCallback(async () => {
        const result = await
            fetch("https://api.elevenlabs.io/v1/models", { headers: { "xi-api-key": DEFAULT_ELEVENLABS_TOKEN } })
                .then(data => data.json());
        setModels(result);
    }, [])


    return (
        <Box sx={{ m: 2 }}>
            <FormControl sx={{}} fullWidth>
                <InputLabel id="demo-simple-select-label">Model</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"

                    label="Age"
                    size="small"
                    value={selectModel}
                    onChange={(e) => updateSelectModel(e.target.value)}

                >
                    {
                        models.map((model: any) => <MenuItem value={model.model_id}>{model.name} ({model.languages.map(l => l.language_id).join(',')})</MenuItem>)
                    }


                </Select>
            </FormControl>
        </Box>


    );
}

export default memo(Models) 
