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

 // const userKey = await fetch(`https://perchance.org/api/getAccessCodeForAdPoweredStuff?__cacheBust=${Math.round(Date.now()/(1000*60*10))}`).then(b => b.text());
 const userKey = await fetch(`https://image-generation.perchance.org/api/verifyUser?thread=2&__cacheBust=${Math.round(Date.now()/(1000*60*10))}`).then(b => b.json()).then(b => b.userKey);
 console.log("userKey", userKey);
  return await fetch(`https://image-generation.perchance.org/api/generate?prompt=${prompt}. cinematic shot, dynamic lighting, Technicolor, cinemascope, sharp focus, fine details, 8k, HDR, realism&seed=-1&resolution=768x512&guidanceScale=5&negativePrompt=&channel=proimagegen&subChannel=public&userKey=${userKey}&adAccessCode=&requestId=${Math.random()}&__cacheBust=${Math.random()}`, requestOptions)
    .then((response) => response.json())
    .then(async (result) =>{
        console.log(result);
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

