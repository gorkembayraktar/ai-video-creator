import os from 'os'
import path from 'path'

import {PROJECT_NAME} from './../config.js'

import {textToVoice} from '../src/main/service/voice.js'

import { v4 as uuid } from "uuid";


const userDataPath = getDocumentsPath();

async function Main(){
    const result = await textToVoice("cab1ec413818b81a883dcced83dd4c60" ,"merhaba ben görkem", {
        voice: "pNInz6obpgDQGcFmaJgB",
        model_id: "eleven_turbo_v2",
        voiceInfo: {
            stability: .4,
            similarityBoost:.8,
            style: 1,
            speakerBoost: true
        }
    },
    path.join(userDataPath, PROJECT_NAME, "temp", uuid() )
);
    console.log(result)
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