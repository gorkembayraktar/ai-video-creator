import { Box, Button, ButtonGroup, Divider } from "@mui/material";
import SentenceAI from "@renderer/components/SentenceAI";

import useGlobalStore from './../store/globalStore'

//const STORY = `Bir varmış bir yokmuş, çok çok uzak diyarlarda Milly adında küçük bir kız varmış. Bir varmış bir yokmuş, çok çok uzak diyarlarda Milly adında küçük bir kız varmış. Milly maceralara atılmayı ve etrafındaki dünyayı keşfetmeyi çok seviyormuş. Bir gece Milly yatağında uzanmış pencereden dışarı bakarken büyülü bir şey gördü. Milly maceralara atılmayı ve etrafındaki dünyayı keşfetmeyi çok seviyormuş. Bir gece Milly yatağında uzanmış pencereden dışarı bakarken büyülü bir şey gördü. Bu çok güzel, parıldayan bir ay ışığıydı!`;

import { StorySplitType } from "../../../define/store";


function SelectImageAI(): JSX.Element {

    const { storyList, storySplitType, updateStorySplitType } = useGlobalStore((state) => (
        {
            storyList: state.storyList(),
            storySplitType: state.storySplitType,
            updateStorySplitType: state.updateStorySplitType
        }
    ));

    const select = (type) => {
        updateStorySplitType(type);
    }

    return (
        <Box className="SelectImage" sx={{ mt: 5, overflow: 'auto', maxHeight: 300 }}>
            <ButtonGroup variant="outlined" aria-label="Basic button group">
                <Button variant={storySplitType == StorySplitType.DOT ? 'contained' : 'outlined'} onClick={() => select(StorySplitType.DOT)}>Cümle Bitimi(.)</Button>
                <Button variant={storySplitType == StorySplitType.NEW_LINE ? 'contained' : 'outlined'} onClick={() => select(StorySplitType.NEW_LINE)}>Yeni Satır (\n)</Button>
            </ButtonGroup>
            <Divider sx={{ my: 1 }} />
            {
                storyList.map((sentence, i) => <SentenceAI sentence={sentence} key={sentence} id={i} />)
            }
        </Box>
    )
}

export default SelectImageAI
