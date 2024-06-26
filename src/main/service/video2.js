

import fs from 'fs'
import path from 'path'
import { textToVoice } from "./voice.js";

import { v4 as uuid } from "uuid";

import {VideoResult} from './define/video.js'
import { textToImage, textToImageToken } from "./textToImage.js";
import { Converter, Merge } from "./video.js";
import { textToImage2 } from './textToImage2.js';

import { createToken } from './stabilityToken.js';




const saveData = (path, data) => {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

export const VideoWithAi = async ( workPath, {tokens, stabilityTokens, elevenlabs, sentences, background}, callback) => {

    // workpath if not exists then create
    fs.mkdirSync(workPath, { recursive: true });

    const save = (status = 'continue', video = '') => saveData(
        path.join(workPath, "info.json"),
        {
        status,
        workPath,
        tokens,
        elevenlabs,
        sentences,
        background,
        video
    });

    save();

    
    if(tokens.length == 0){
        return {
            status: VideoResult.TOKEN_REQUIRED
        }
    }

  

    if(background.src){

        if(!fs.existsSync(background.src)){
            callback(VideoResult.SOUND_FILLE_NOT_FOUND);
            return {
                status: VideoResult.SOUND_FILLE_NOT_FOUND
            }
        }
        const fileExtension = path.extname(background.src);
        const targetPath = path.join(workPath, uuid() + fileExtension);

        callback(background.src + " " + targetPath)
        fs.copyFile( background.src, targetPath, (err) => {
            if (err) {
                throw err;
            } else {
                
                background.realsrc = targetPath;

            }
        });
    }


    callback(workPath)

    let tokenIndex = 0;

    let maxError = 5;
    let errorCount = 0;

      // sesleri al
    for(let i = 0; i < sentences.length;){

        const sentence = sentences[i];

        if(tokenIndex >= tokens.length){

            callback("Ses dosyası üretilemedi, token kalmadı.");
            return {
                status: VideoResult.TOKEN_STOCK_OUT
            }
        }

        let next = false;

       
        

        do{
            try{
                callback(`"${sentence.text}" mp3 dosyası oluşturuluyor[${tokens[tokenIndex]}]`);
                const result = await textToVoice(tokens[tokenIndex] ,sentence.text, {
                        voice: elevenlabs.voice,
                        model_id: elevenlabs.model_id,
                        stability: elevenlabs.stability,
                        similarity_boost: elevenlabs.similarity,
                        style: elevenlabs.style,
                        use_speaker_boost: elevenlabs.speakerBoost
                    },
                    workPath
                );

                next = false;

                callback(`"${sentence.text}" mp3 dosyası kaydedildi.[${result}]`);
                sentence.local = result;

                save();

                i++;
    
            }catch(err){
                // sonraki tokene geç
                console.error(err)
                tokenIndex++;
                errorCount++;
                next = true;
            }
            
        }while(
            next && 
            tokenIndex <= tokens.length - 1 &&
            errorCount < maxError
        );
    }

    if(errorCount == maxError){
        callback("Max ses üretim denemesi aşıldı.")
        return {
            status: VideoResult.ERROR
        }
    }

    try{

      
        let stabilityTokenIndex = 0;
        // videoları oluştur
        for(const [index, sentence] of Object.entries(sentences)){
            // ai image

            sentence.aisrc = path.join(workPath, uuid() + ".png");
            
            let status = false;
            do{

                if(stabilityTokenIndex >= stabilityTokens.length){

                    callback("Görüntü dosyası üretilemedi, token kalmadı.");
                    return {
                        status: VideoResult.TOKEN_STOCK_OUT
                    }
                }

                callback("Görüntü dosyası için token:"+stabilityTokens[stabilityTokenIndex]);
                status = await textToImageToken(stabilityTokens[stabilityTokenIndex], sentence.text, sentence.aisrc)

                if(!status){
                   stabilityTokenIndex++;
                }

                callback(`${parseInt(index) + 1}.resim ${status ? 'oluşturuldu': 'oluşturulamadı'}`)


            }while(
                !status &&
                stabilityTokenIndex < stabilityTokens.length
            );

          
            
           
            save();
          
            const output = await Converter(
                workPath,
                sentence.local,
                sentence.text,
                sentence.aisrc
            )
            sentence.video = output;
            callback(`Video oluşturuluyor. [${parseInt(index) + 1} / ${sentences.length}]`);

            save();
            
           
        }

        // videoyu birleştir

        callback("Videolar birleştiriliyor.")
        const realVideo = await Merge(
                workPath, 
                sentences.map(s => s.video).filter(k => fs.existsSync(k)),
                background.realsrc,
                background.volume,
                callback
        )

        save("completed", realVideo);

        callback("success: "+realVideo);

        console.log(realVideo);
            
            
        // video src
        return {
            status: VideoResult.SUCCESS,
            src: realVideo
        }


    }catch(err){
        save("error");
        callback(err.message);
        // video src
        return {
            status: VideoResult.ERROR,
            error: err
        }
    }


   
} 