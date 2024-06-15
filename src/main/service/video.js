/**
 * 
 * created by github@gorkembayraktar
 * 13.06.2024
 * 
 */


import fs from 'fs'

import { textToVoice } from "./voice.js";

import { v4 as uuid } from "uuid";

import {VideoResult} from './define/video.js'


import path from 'path'
import Ffmpeg from 'fluent-ffmpeg';



export const Video = async ( workPath, {tokens, elevenlabs, sentencesAndImages, background}, callback) => {

    if(tokens.length == 0){
        return {
            status: VideoResult.TOKEN_REQUIRED
        }
    }

    // workpath if not exists then create
    fs.mkdirSync(workPath, { recursive: true });
  


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
      // sesleri al
    for(const sentence of sentencesAndImages){

        if(tokens.length - 1 > tokenIndex){

            callback("Ses dosyası üretilemedi, token kalmadı.");
            return {
                status: VideoResult.TOKEN_STOCK_OUT
            }
        }

        let next = false;
        

        do{
            try{
                callback(`"${sentence.text}" mp3 dosyası oluşturuluyor`);
                const result = await textToVoice(tokens[tokenIndex] ,sentence.text, {
                        voice: elevenlabs.voice,
                        model_id: elevenlabs.model_id,
                        voiceInfo: elevenlabs.voiceInfo
                    },
                    workPath
                );

                next = false;

                callback(`"${sentence.text}" mp3 dosyası kaydedildi.[${result}]`);
                sentence.local = result;
    
            }catch(err){
                // sonraki tokene geç
                console.error(err)
                tokenIndex++;
                next = true;
            }
            
        }while(next && tokenIndex < tokens.length - 1 );

   

        callback(sentence.text)
    }

    try{
        // videoları oluştur
        for(const sentence of sentencesAndImages){

            const fileExtension = path.extname(sentence.src);
            const targetPath = path.join(workPath, uuid() + fileExtension);
            fs.copyFile( sentence.src, targetPath, (err) => {
                if (err) {
                    throw err;
                } else {
                    console.log(`File copied and renamed to ${targetPath}`);
                }
            });
            
            const output = await Converter(
                workPath,
                sentence.local,
                sentence.text,
                sentence.src
            )
            sentence.video = output;
            callback("Video oluşturuluyor.");
        }

        // videoyu birleştir


        const realVideo = await Merge(
                workPath, 
                sentencesAndImages.map(s => s.video),
                background.realsrc,
                background.volume,
                callback
        )

        console.log(realVideo);
            
            
        // video src
        return {
            status: VideoResult.SUCCESS
        }


    }catch(err){
        // video src
        return {
            status: VideoResult.ERROR,
            error: err
        }
    }


   
} 


export const splitTextIntoLines = (text, maxLength) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    words.forEach(word => {
        if ((currentLine + word).length <= maxLength) {
            currentLine += `${word} `;
        } else {
            lines.push(currentLine.trim());
            currentLine = `${word} `;
        }
    });

    if (currentLine.length > 0) {
        lines.push(currentLine.trim());
    }

    return lines;
};


export const Converter = async (workPath, audioPath, text, imagePath) => {

    
    const textColor = 'white';
    const fontFile = "C\\:/Windows/fonts/consola.ttf";
    const output = `${workPath}\\${uuid()}.mp4`;


    const fontSize = 25;
    const maxLength = 65; // Maximum length of each line
    const boxColor = 'black@0.5'; // Black background with 50% opacity
    // Split text into lines
    const lines = splitTextIntoLines(text, maxLength);

    const minHeight = Math.max(lines.length , 3); 

    // Create drawtext filter strings for each line
    const drawTextFilters = lines.map((line, index) => {

        return `drawtext=text='${escapeSpecialCharacters(line)}':fontfile=${fontFile}:fontcolor=${textColor}:fontsize=${fontSize}:x=(w-text_w)/2:y=h-(text_h*${lines.length})-${(minHeight - index - 1) *(fontSize+10)}:box=1:boxcolor=${boxColor}`;
    }).join(',');

    console.log(drawTextFilters);

    // Create zoompan filter for image
    // scale=-2:10*ih,
    const zoomPanFilter = `scale=-2:10*ih,zoompan=z='min(zoom+0.0015,1.5)':d=125:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'`;

 
    return new Promise((resolve, reject) => {


   // Hedef klasörü oluştur
   fs.mkdir(workPath, { recursive: true }, (err) => {

    if(err){
        reject(err);
        return;
    }
    // Get audio duration
    Ffmpeg.ffprobe(audioPath, (err, metadata) => {
        if (err) {
            reject(err);
            return;
        }

        const audioDuration = metadata.format.duration;

        let newMp4 = Ffmpeg();
   
        newMp4
            .input(imagePath)
            .loop(audioDuration) // Loop image to match audio duration
            .input(audioPath)
            .outputOptions([
                '-vf', `${zoomPanFilter},${drawTextFilters}`,
                '-c:v libx264', '-pix_fmt yuv420p'
            ])
            
            .outputFPS(30) // Set FPS
            .save(output)
            .on('end', () => {
                console.log("done");
                resolve(output)
            })
            .on('error', (err) => {
                console.log('Error:', err);
                reject(err);
            });
    });
   });
   
});
}


export const clone = async (dir, toDir) => {

}

export const Merge = async (workPath, videos, soundMp3, volume=0.5, callback) => {
    // videoları birleştir. arkaplan müziği ekle ve ses seviyesini belirle

    videos.forEach(video => {
        if (!fs.existsSync(video)) {
            throw new Error(`Video file ${video} does not exist`);
        }
    });

    if(soundMp3){
        // Ensure the sound file exists
        if (!fs.existsSync(soundMp3)) {
            throw new Error(`Sound file ${soundMp3} does not exist`);
        }
    }
   


    return new Promise((resolve, reject) => {

   
   

    let mergedoutput  = path.join(workPath, 'merged.mp4');
    let output  = path.join(workPath, 'video.mp4');

   
     // Hedef klasörü oluştur
   fs.mkdir(workPath, { recursive: true }, (err) => {
   
        // Create a temporary file to concatenate the videos

        const fileListPath =  path.join(workPath, 'videos.txt');
        const fileListContent = videos.map(video => `file '${video}'`).join('\n');

    

        if(videos.length == 1){
            // es geç


        
            if(!soundMp3){
                callback("Ses dosyası bulunamadığından geçildi.");

                fs.copyFileSync(videos[0], output);


                resolve(output);
                return;
            }
        
            
            Ffmpeg.ffprobe(videos[0], function(err, metadata) {
                if (err) {
                    console.error('Error retrieving video metadata:', err);
                    reject('Error retrieving video metadata:' + err);
                    return;
                }
                let duration = metadata.format.duration;
                
                
                // Now proceed with adding the background music with the correct duration
                Ffmpeg(videos[0])
                    .input(soundMp3)
                    .inputOptions(['-stream_loop -1']) // Loop the audio indefinitely
                    .outputOptions([
                        '-filter_complex', `amix=inputs=2:duration=first:dropout_transition=3,volume=${volume}`,
                        `-t ${duration + 2}` // Trim the looped audio to match the video duration
                    ])
                    .save(output)
                    .on('end', () => {
                        callback("ses dosyası eklendi ve video hazır.");
                        console.log('Background music added successfully');
                        resolve(output);
                    })
                    .on('error', (err) => {
                        console.error('Error adding background music:', err);
                        reject('Error adding background music:'+ err);
                    });
            });

            return;
        }

    fs.writeFileSync(fileListPath, fileListContent);

    callback("video birleştiriliyor");

    // Merge the videos
    let mergeVideos = Ffmpeg();
    mergeVideos
        .input(fileListPath)
        .inputOptions(['-f', 'concat', '-safe', '0'])
        .outputOptions(['-c', 'copy'])
        .output(mergedoutput)
        .on('end', () => {
            callback("video birleştirildi");
            console.log('Videos merged successfully');
            callback("ses dosyası ekleniyor");

         
            if(!soundMp3){
                callback("Ses dosyası bulunamadığından geçildi.");
                fs.renameSync(mergedoutput, output);
                fs.unlinkSync(fileListPath); // Clean up temporary file list
                resolve(output);
                return;
            }
         
            
            Ffmpeg.ffprobe(mergedoutput, function(err, metadata) {
                if (err) {
                    console.error('Error retrieving video metadata:', err);
                    reject('Error retrieving video metadata:' + err);
                    return;
                }
                let duration = metadata.format.duration;
                
                
                // Now proceed with adding the background music with the correct duration
                let addSound = Ffmpeg(mergedoutput)
                    .input(soundMp3)
                    .inputOptions(['-stream_loop -1']) // Loop the audio indefinitely
                    .outputOptions([
                        '-filter_complex', `amix=inputs=2:duration=first:dropout_transition=3,volume=${volume}`,
                        `-t ${duration + 2}` // Trim the looped audio to match the video duration
                    ])
                    .save(output)
                    .on('end', () => {
                        callback("ses dosyası eklendi ve video hazır.");
                        console.log('Background music added successfully');
                        fs.unlinkSync(mergedoutput); // Clean up temporary merged video file
                        fs.unlinkSync(fileListPath); // Clean up temporary file list
                        resolve(output);
                    })
                    .on('error', (err) => {
                        console.error('Error adding background music:', err);
                        reject('Error adding background music:'+ err);
                    });
            });
        })
        .on('error', (err) => {
            console.error('Error merging videos:', err);
            reject('Error merging videos:'+ err)
        })
        .run();

    });

});
}

// Özel karakterleri kaçırtan bir fonksiyon
export function escapeSpecialCharacters(text) {
    text = text.replace(/[^a-zA-Z0-9ıçöğüİÇÖĞÜŞş\.,:;!?\"\' ]/g, "");
    return text
    .replaceAll("'","")
    .replaceAll("\\\\", "\\\\\\\\\\\\\\\\").replaceAll("'", "'\\\\\\\\\\\\\''").replaceAll("%", "\\\\\\\\\\\\%").replaceAll(":", "\\\\\\\\\\\\:");
  }