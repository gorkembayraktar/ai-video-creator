import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import SelectImageAI from '@renderer/steps/SelectImageAI';
import SelectBackgroundMusic from '@renderer/steps/SelectBackgroundMusic';
import BackdropCustom from './BackdropCustom';

import useGlobalStore from './../store/globalStore'
import useTokenStore from './../store/tokenStore'
import { useAlert } from '../hooks/useAlert';
import { ipcRenderer } from 'electron';

const steps = [
    'Resim Seç',
    'Arkaplan Müziği Seç'
];

const stepFailedMessage = [
    "Hata",
    ""
];

const stepComponents = [
    SelectImageAI,
    SelectBackgroundMusic
];

export default function MainTab() {

    const {
        selectModel,
        selectVoice,
        nextSection,
        sentenceAndImage,
        storyList,
        activeStep,
        updateActiveStep,
        backgroundFile,
        backgroundVolume,
        stability,
        similarity,
        style,
        speakerBoost,
        updateBackdropTask,
        updateBackdropMessage,
        updateExplorer
    } = useGlobalStore((state) => (
        {
            selectModel: state.selectModel,
            selectVoice: state.selectVoice,
            nextSection: state.nextSection,
            sentenceAndImage: state.sentenceAndImage,
            storyList: state.storyList(),
            activeStep: state.activeStep,
            updateActiveStep: state.updateActiveStep,
            backgroundFile: state.backgroundFile,
            backgroundVolume: state.backgroundVolume,
            stability: state.stability,
            similarity: state.similarity,
            style: state.style,
            speakerBoost: state.speakerBoost,
            updateBackdropTask: state.updateBackdropTask,
            updateBackdropMessage: state.updateBackdropMessage,
            updateExplorer: state.updateExplorer
        }
    ));


    const { tokenList } = useTokenStore((state) => (
        {
            tokenList: state.tokenList
        }
    ));


    const { error } = useAlert();


    const isStepFailed = (step: number) => {
        if (steps[step] == 'Resim Seç') {
            return checkImages();
        }
        return false;
    };



    const handleNext = () => {
        if (activeStep < steps.length) {
            if (isStepFailed(activeStep)) {
                error(stepFailedMessage[activeStep])

                return;
            }
        }

        updateActiveStep((state) => ({ activeStep: state.activeStep + 1 }));
    };


    const handleBack = () => {
        updateActiveStep((state) => ({ activeStep: state.activeStep - 1 }));
    };

    const ActiveStepComponent = () => {
        const ComponentItem = stepComponents[activeStep];
        return <ComponentItem />
    }

    const checkImages = () => {
        return false;
    }

    const startVideoCreator = () => {
        // tüm parametreleri gönder

        const send = {
            sentences: storyList.map(s => ({ text: s })),
            tokens: [...tokenList],
            backgroundFile: { src: backgroundFile?.src },
            backgroundVolume: backgroundVolume / 100,
            elevenlabs: {
                voice: selectVoice,
                model_id: selectModel,
                stability: stability / 100,
                similarity: similarity / 100,
                style: style / 100,
                speakerBoost: speakerBoost
            }
        };
        console.log(send)
        // @ts-ignore
        window.api.send("create-video-init", send);
    }

    React.useEffect(() => {
        //video-process-channel

        // @ts-ignore
        window.api.receive("video-process-channel", (data) => {

            console.log(data);
            updateBackdropTask(true);
            updateBackdropMessage(data);

        });

        // @ts-ignore
        window.api.receive("video-process-result", (result) => {

            console.log("video-process-result", result);
            if (result.status != 'SUCCESS') {
                error("Hata: " + result.status);
            } else {
                updateExplorer({
                    open: true,
                    src: result.src
                });
            }
            updateBackdropTask(false);
            updateBackdropMessage("");
        });



        return () => {
            // @ts-ignore
            window.api.remove("video-process-channel");

            // @ts-ignore
            window.api.remove("video-process-result");
        }

    }, [])

    return (
        <Box sx={{ width: '100%', position: 'relative' }}>

            <BackdropCustom open={!nextSection} text={'Hikayeyi Tamamlayınız'} />

            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label, index) => {
                    const labelProps: {
                        optional?: React.ReactNode;
                        error?: boolean;
                    } = {};
                    if (isStepFailed(index)) {
                        labelProps.optional = (
                            <Typography variant="caption" color="error">
                                {stepFailedMessage[index]}
                            </Typography>
                        );
                        labelProps.error = true;
                    } else {

                    }

                    return (
                        <Step
                            sx={{
                                "& .MuiStepLabel-root .Mui-completed": {
                                    color: "skyblue"
                                },
                                "& .MuiStepLabel-root .Mui-active": {
                                    color: "black"
                                },
                                "& .MuiStepLabel-root .MuiStepLabel-label.Mui-active:not(.Mui-error)": {
                                    color: "white"
                                },
                                "& .MuiStepLabel-root .MuiStepLabel-label.Mui-disabled.MuiStepLabel-alternativeLabel": {
                                    color: "grey"
                                },


                            }}
                            key={label}>
                            <StepLabel   {...labelProps}>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>

            {activeStep === steps.length ? (
                <React.Fragment>
                    <Typography sx={{ mt: 2, mb: 1 }}>
                        Video oluşturma işlemini başlat.
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Box sx={{ flex: '1 1 auto' }} />
                    </Box>
                    <Button onClick={handleBack} color='inherit' sx={{ mr: 3 }}>
                        Geri
                    </Button>

                    <Button onClick={startVideoCreator} color='success' variant='contained'>
                        Başlat
                    </Button>
                </React.Fragment>
            ) : (
                <React.Fragment>

                    <ActiveStepComponent />

                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Button
                            color="inherit"
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                        >
                            Önceki
                        </Button>
                        <Box sx={{ flex: '1 1 auto' }} />

                        <Button
                            onClick={handleNext} variant='contained'>
                            {activeStep === steps.length - 1 ? 'Sonraki' : 'Sonraki'}
                        </Button>
                    </Box>
                </React.Fragment>
            )}
        </Box>
    );
}