import {VideoWithAi} from '../src/main/service/video2.js'
import {PROJECT_NAME} from './../config.js'
import fs from 'fs'
import { v4 as uuid } from "uuid";

import os from 'os'
import path from 'path'
import {log} from '../src/main/helper/log.js'

const userDataPath = getDocumentsPath();

async function Main(){

    const workPath =  path.join(userDataPath, PROJECT_NAME, "projects", uuid(), "temp" )

VideoWithAi(
        workPath,
        {
        tokens: [
            "cab1ec413818b81a883dcced83dd4c60",
            "sk_2eb0bb813786dfba0fab0fd5b11f6b249438374b2db25509"
        ],
        sentences: [
            {
                text: "One morning Snow left the farm to play.",
            },
            {
                text: "He started running in the forest, and suddenly he smelled the smell of strawberries",
            },
            {
                text: "He immediately went in the direction of the smell and started eating strawberries. ",
            },
            {
                text: "Snow ate so much that he didnt realize he was running away from the forest. ",
            },
            {
                text: "Snow, who was very full, could not walk, so he lay down on the ground and fell asleep.",
            },
            {
                text: `When he woke up, it was too late and it was almost dark. `,
            }
           

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
        log(path.join(workPath, "output.log"), response);
    }
);

}

Main();






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