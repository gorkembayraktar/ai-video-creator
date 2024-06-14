/**
 * 
 * created by github@gorkembayraktar
 * 13.06.2024
 * 
 */


import ElevenLabs  from "./elevenlabs.js";
import { createWriteStream } from "fs";
import { v4 as uuid } from "uuid";
import path from 'path'

import fs from 'fs'

export const textToVoice = async (token, text, voiceInfo, destinationPath) => {
    return new Promise(async (resolve, reject) => {
        try {
          const client = new ElevenLabs(
            {
                apiKey: token, // Your API key from Elevenlabs
            }
        );

          const params = {
            voiceId: voiceInfo.voice ?? "pNInz6obpgDQGcFmaJgB",
            modelId: voiceInfo.model_id ?? "eleven_multilingual_v2",
            textInput: text
          };

          params.stability = voiceInfo.stability ?? 0.3;
          params.similarityBoost = voiceInfo.similarity_boost ?? 0.5;

          if(voiceInfo.model_id == 'eleven_multilingual_v2'){
            params.style = voiceInfo.style ?? 0.0;
            params.speakerBoost = voiceInfo.use_speaker_boost ?? true;
          }

          

        const fileName = `${uuid()}.mp3`;
        const outPath = path.join(destinationPath, fileName);
        // Hedef klasörü oluştur
        fs.mkdirSync(path.dirname(outPath), { recursive: true });

        await client.textToSpeechStream(params).then(audio => {
         
          if(audio){
            const fileStream = createWriteStream(outPath);

            audio.pipe(fileStream);
            fileStream.on("finish", () => resolve(outPath)); // Resolve with the fileName
            fileStream.on("error", reject);
          }else{
            reject(false)
          }
         
      
        }).catch(reject);
      
       


   
        } catch (error) {
            reject(error);
        }
      });


}

