import fs from 'fs'
import { translate } from './translate.js';

import { writeFile } from 'node:fs/promises'
import { Readable } from 'node:stream'


export const textToImage2 = async (text, outputPath, notEng = true) => {

  const requestOptions = {
    method: "POST",
    redirect: "follow"
  };
  
  const prompt = notEng ? (await translate(text) ?? text) : text;

  const userKey = "f7747716bd4686260874245bb315c8f0e37d078d6739a917c2ac677cf3703ac8";
  
  return await fetch(`https://image-generation.perchance.org/api/generate?prompt=${prompt}. cinematic shot, dynamic lighting, Technicolor, cinemascope, sharp focus, fine details, 8k, HDR, realism&seed=-1&resolution=768x512&guidanceScale=5&negativePrompt=&channel=proimagegen&subChannel=public&userKey=${userKey}&adAccessCode=&requestId=0.9727699168656354&__cacheBust=0.8221173605022845`, requestOptions)
    .then((response) => response.json())
    .then(async (result) =>{
        const id = result.imageId;
        const fileExtension = result.fileExtension;

        const response = await fetch(`https://image-generation.perchance.org/api/downloadTemporaryImage?imageId=${id}`);
  
        const body = Readable.fromWeb(response.body)
        await writeFile(outputPath, body)

       return true;
    })
    .catch((error) => {
      console.error(error)
      return false;
    });


}

