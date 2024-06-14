import { styled } from "@mui/material/styles";
import { Box, Paper, Slider, Stack, Typography } from '@mui/material';

import { Unstable_Grid2 as Grid } from '@mui/material';
import { useState } from "react";

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.subtitle2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    fontSize: 10
}));



export default function CustomSlider({ defaultVolume, title, minlabel, maxlabel, query, update }) {

    const [volume, setVolume] = useState(defaultVolume);

    const handleChange = (event: Event, newValue: number | number[]) => {
        setVolume(newValue as number);
    };

    let tip = "";

    if (query) {
        switch (query.type) {
            case 'less':
                tip = volume < query.than ? query.label : "";
                break;

            case 'more':
                tip = volume > query.than ? query.label : "";
                break;
        }
    }

    return (
        <Box boxShadow={2} sx={{ overflow: 'hidden', p: 2, m: 1 }}>
            <Grid container spacing={2}>
                <Grid xs={5}>
                    <Item>{title}</Item>
                </Grid>
                <Grid xs={7}>
                    {
                        tip && <Item sx={{ color: 'orange' }}>{tip}</Item>
                    }

                </Grid>
                <Grid xs={12}>
                    <Item>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography fontSize={10} id="input-slider" gutterBottom>
                                {minlabel}
                            </Typography>
                            <Typography fontSize={10} id="input-slider" gutterBottom>
                                {maxlabel}
                            </Typography>
                        </Box>

                        <Slider
                            onChange={handleChange}
                            value={volume} valueLabelDisplay="on"
                            onChangeCommitted={(event: React.SyntheticEvent | Event, value: number | Array<any>) => {
                                update(value as Number);
                            }}
                        />
                    </Item>
                </Grid>

            </Grid>
        </Box>

    );
}
