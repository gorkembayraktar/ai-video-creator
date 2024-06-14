import {Converter, Merge, Video} from '../src/main/service/video.js'
import {PROJECT_NAME} from './../config.js'

import { v4 as uuid } from "uuid";

import os from 'os'
import path from 'path'

const userDataPath = getDocumentsPath();

async function Main(){

    const workPath =  path.join(userDataPath, PROJECT_NAME, "projects", uuid(), "temp" )

    Video(
        workPath,
        {
        tokens: [
            "cab1ec413818b81a883dcced83dd4c60"
        ],
        sentencesAndImages: [
            {
                text: "Bir zamanlar, Güneşli Orman’ın derinliklerinde yaşayan minik bir sincap vardı",
                src: `C:\\Users\\grkm\\Documents\\ai-video\\temp\\715db2f0-0d7d-48a1-88a1-931df0ef8341.jpg`
            },
            {
                text: "Adı Ceviz di",
                src: `C:\\Users\\grkm\\Documents\\ai-video\\temp\\715db2f0-0d7d-48a1-88a1-931df0ef8341.jpg`
            },
            {
                text: "Ceviz, günlerini ağaç dallarında zıplayarak, arkadaşlarıyla oynayarak ve kış için ceviz toplayarak geçirirdi.",
                src: `C:\\Users\\grkm\\Documents\\ai-video\\temp\\715db2f0-0d7d-48a1-88a1-931df0ef8341.jpg`
            },
            {
                text: "Yavru baykuş, uçmayı yeni öğreniyordu ve annesinden uzaklaşmıştı. Güneş batarken, yavru baykuş korkmuş ve üşümüş halde bir ağacın dalına kondu. ",
                src: `C:\\Users\\grkm\\Documents\\ai-video\\temp\\715db2f0-0d7d-48a1-88a1-931df0ef8341.jpg`
            },
            {
                text: "Ceviz, küçük dostunun halini görünce hemen yanına gitti.",
                src: `C:\\Users\\grkm\\Documents\\ai-video\\temp\\715db2f0-0d7d-48a1-88a1-931df0ef8341.jpg`
            },
            {
                text: `Merhaba, dedi Ceviz, Ben Ceviz. Yardım edebilir miyim?`,
                src: `C:\\Users\\grkm\\Documents\\ai-video\\temp\\715db2f0-0d7d-48a1-88a1-931df0ef8341.jpg`
            },

        ],
        background: {
            src: "C:\\Users\\grkm\\Desktop\\save-as-115826.mp3",
            volume: .5
        },
        elevenlabs: {
            voice: "pNInz6obpgDQGcFmaJgB",
            model_id: "eleven_turbo_v2",
            voiceInfo: {
                stability: 0.5,
                similarityBoost:0.75,
                style: 0,
                speakerBoost: true
            }
        }
    },
    function(response){
        console.log(response)
    }
);

}




async function FFMPEG_VIDEO(){

    const workPath =  path.join(userDataPath, PROJECT_NAME, "projects", uuid(), "temp" )


    Converter(
        workPath,
        "C:\\Users\\grkm\\Documents\\Video-ai\\1.mp3",
        "Bilgisayarınızı yüksek performans ",
        "C:\\Users\\grkm\\Documents\\ai-video\\temp\\715db2f0-0d7d-48a1-88a1-931df0ef8341.jpg"
    );
}


async function Merge_Video(){
    const workPath =  path.join(userDataPath, PROJECT_NAME, "projects", uuid(), "temp" )


    Merge(
        workPath
        ,[
        "C:\\Users\\grkm\\Documents\\Video-ai\\test\\1.mp4",
        "C:\\Users\\grkm\\Documents\\Video-ai\\test\\2.mp4",
        "C:\\Users\\grkm\\Documents\\Video-ai\\test\\3.mp4"
    ],
    "C:\\Users\\grkm\\Desktop\\save-as-115826.mp3",
    0.5,
    () => {

    }
    );
}

FFMPEG_VIDEO();




// Function to get the user's documents path
function getDocumentsPath() {
    const homeDir = os.homedir();
    let documentsPath;

    switch (process.platform) {
        case 'win32':
            documentsPath = path.join(homeDir, 'Documents');
            break;
        case 'darwin':
            documentsPath = path.join(homeDir, 'Documents');
            break;
        case 'linux':
            documentsPath = path.join(homeDir, 'Documents');
            break;
        default:
            throw new Error('Unsupported platform: ' + process.platform);
    }

    return documentsPath;
}