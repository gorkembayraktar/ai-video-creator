
import { Converter } from '../src/main/service/video.js';
import { PROJECT_NAME } from "../config.js"

import { v4 as uuid } from "uuid";
import os from 'os'

import path from 'path'



const userDataPath = getDocumentsPath();

async function FFMPEG_VIDEO(){

    const workPath =  path.join(userDataPath, PROJECT_NAME, "projects", uuid(), "temp" )

    console.log(workPath);
    Converter(
        workPath,
        "C:\\Users\\grkm\\Documents\\Video-ai\\1.mp3",
        "Yeni bir deneme ",
        "C:\\Users\\grkm\\Documents\\Video-ai\\images\\1.jpg"
    );
}

FFMPEG_VIDEO()



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