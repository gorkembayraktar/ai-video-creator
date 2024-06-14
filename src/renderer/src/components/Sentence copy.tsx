import { Box } from "@mui/material"
import FileButton from "./FileButton"
import { useEffect, useState } from "react"
import useGlobalStore from './../store/globalStore'



function Sentence({ sentence, id }): JSX.Element {

    const { getSentenceAndImage, updateSentenceAndImage } = useGlobalStore((state) => (
        {
            getSentenceAndImage: state.getSentenceAndImage,
            updateSentenceAndImage: state.updateSentenceAndImage
        }
    ));

    const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined)
    const [preview, setPreview] = useState<string>("")

    useEffect(() => {
        const storeData = getSentenceAndImage(id);
        if (storeData.objectUrl) {
            setPreview(storeData.objectUrl)
        }
    }, [id])

    // create a preview as a side effect, whenever selected file is changed
    useEffect(() => {
        if (!selectedFile) {
            setPreview("")
            return
        }

        if (preview) {
            URL.revokeObjectURL(preview);
        }

        console.log("selectedfile", selectedFile);
        const objectUrl = URL.createObjectURL(selectedFile)
        setPreview(objectUrl)
        // free memory when ever this component is unmounted

        updateSentenceAndImage(id, {
            sentence,
            src: selectedFile.path,
            objectUrl
        });

        // return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])

    const onSelectFile = e => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined)
            return
        }
        // for preview select the image
        setSelectedFile(e.target.files[0])

        /*
        // @ts-ignore (define in dts)
        window.api.send("test", {
            src: e.target.files[0].path
        });
        */
    }

    return (
        <div className="Sentence" style={{ width: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', p: 2, mb: 1, background: '#383838' }}>
                <Box
                    color="inherit"
                    sx={{ mr: 1, textAlign: 'left', flexGrow: 1 }}
                >
                    {sentence}
                </Box>
                <Box sx={{ flex: '1 1 auto' }} />


                <FileButton sx={{ width: 50 }} text={'Resim Seç'} accept={".png,.jpg"} onChange={onSelectFile} />
                {(selectedFile || preview) && <img src={preview} width={50} height={50} />}




            </Box>
        </div >
    )
}

export default Sentence
