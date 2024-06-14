import { Grid } from "@mui/material"
import FileButton from "./FileButton"



import useGlobalStore from './../store/globalStore'
import { useEffect, useState } from "react";



function Sentence({ sentence, id }): JSX.Element {


    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>("");

    const { findSentenceAndImage, updateSentenceAndImage } = useGlobalStore((state) => (
        {
            findSentenceAndImage: state.findSentenceAndImage,
            updateSentenceAndImage: state.updateSentenceAndImage
        }
    ));


    useEffect(() => {
        const item = findSentenceAndImage(id);
        if (item) {
            setSelectedFile(item.file);
        }

        console.log('değişti')

        if (item && item.file) {
            try {
                const objectUrl = URL.createObjectURL(item.file)
                setPreview(objectUrl)
                return () => URL.revokeObjectURL(objectUrl)
            } catch {

            }



        }

    }, [setSelectedFile, updateSentenceAndImage])

    const handleFile = (e) => {
        if (!e.target.files || e.target.files.length === 0) {
            return
        }

        updateSentenceAndImage(id, {
            sentence,
            src: e.target.files[0].path,
            file: e.target.files[0]
        });
    }

    return (

        <Grid container spacing={2} sx={{ background: '#383838', mb: 3, position: 'relative' }}>
            <Grid item xs={8} sx={{ textAlign: 'left', }} style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                {sentence}
            </Grid>
            <Grid item xs={2} p={0}>
                <FileButton sx={{ width: 50 }} text={'Seç'} accept={".png,.jpg"} onChange={handleFile} />
            </Grid>
            <Grid item xs={2}>
                {preview && <img src={preview} width={50} />}
            </Grid>
        </Grid>

    )
}

export default Sentence
