import { app, ipcMain, shell } from "electron";
import fs from 'fs'
import path from 'path'
import {PROJECT_NAME} from '../../config'
import {VideoWithAi} from './service/video2'
import { v4 as uuid } from "uuid";

import {log} from './helper/log'

ipcMain.on("test", async (event, data) => {
    const userDataPath = app.getPath('documents');
    const fileName = path.basename(data.src); // Dosya adını al

    const destinationPath = path.join(userDataPath, PROJECT_NAME,  'temp', fileName);
    

    // Hedef klasörü oluştur
    fs.mkdir(path.dirname(destinationPath), { recursive: true }, (err) => {
        if (err) {
            console.error('Klasör oluşturulurken bir hata oluştu:', err);
            return;
        }
        
        // Dosyayı kopyala
        fs.copyFile(data.src, destinationPath, (err) => {
            if (err) {
                console.error('Dosya kopyalanırken bir hata oluştu:', err);
                return;
            }
            console.log('Dosya başarıyla kopyalandı:', destinationPath);
        });
    });
});


ipcMain.on("create-video-init", async(event, data) => {
    console.log(data)
    const userDataPath = app.getPath('documents');
    const workPath =  path.join(userDataPath, PROJECT_NAME, "projects", uuid(), "temp" )

    const result = await VideoWithAi(
        workPath,
        {
            tokens: data.tokens,
            stabilityTokens: data.stabilityTokens,
            elevenlabs: data.elevenlabs,
            sentences: data.sentences,
            background: {
                src: data.backgroundFile.src,
                volume: data.backgroundVolume
            }
        },
        function(response){
            console.log("local", response);
            event.sender.send("video-process-channel", response)

            log(path.join(workPath, "output.log"), response)
        }
    );

    event.sender.send("video-process-result", result)
  
});

ipcMain.on("open-explorer", async(event, data) => {
    shell.openPath(data);
});
