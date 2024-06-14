import { Box } from "@mui/material";
import Sentence from "@renderer/components/Sentence";

import useGlobalStore from './../store/globalStore'

//const STORY = `Bir varmış bir yokmuş, çok çok uzak diyarlarda Milly adında küçük bir kız varmış. Bir varmış bir yokmuş, çok çok uzak diyarlarda Milly adında küçük bir kız varmış. Milly maceralara atılmayı ve etrafındaki dünyayı keşfetmeyi çok seviyormuş. Bir gece Milly yatağında uzanmış pencereden dışarı bakarken büyülü bir şey gördü. Milly maceralara atılmayı ve etrafındaki dünyayı keşfetmeyi çok seviyormuş. Bir gece Milly yatağında uzanmış pencereden dışarı bakarken büyülü bir şey gördü. Bu çok güzel, parıldayan bir ay ışığıydı!`;



function SelectImage(): JSX.Element {

    const { storyList } = useGlobalStore((state) => (
        {
            storyList: state.storyList()
        }
    ));

    return (
        <Box className="SelectImage" sx={{ mt: 5, overflow: 'auto', maxHeight: 300 }}>
            {
                storyList.map((sentence, i) => <Sentence sentence={sentence} key={sentence} id={i} />)
            }
        </Box>
    )
}

export default SelectImage
