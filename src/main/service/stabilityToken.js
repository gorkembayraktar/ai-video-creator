
import {AccessToken, Register, createMailFormat, sleep} from './stabilityai.js'
import {getEmails} from './email.js'

import {parse} from './dom.js'

import dotenv from 'dotenv';
dotenv.config()

export const createToken = async (callback) => {

    if(
        [process.env.HOST, process.env.PASSWORD, process.env.EMAIL,process.env.PORT].some(k => !k)
    ){
        callback(".env dosyasında imap bilgileri tanımlanmalıdır.")
        return false;
    }

    const mail = createMailFormat(process.env.EMAIL);

    const pw  = `Kulse.8403`;

    callback(mail);

    const r = await Register(mail, pw, callback);

    if(!r){
        return false;
    }

    await sleep(5 * 1000);

    const emails = await getEmails({
            host: process.env.HOST,
            password: process.env.PASSWORD,
            user: process.env.EMAIL,
            port: process.env.PORT,
        },
        "platform@stability.ai"
    );

    const first = emails[0]?.html;

    const accessUrl = htmlToAccessUrl(first);

    console.log(accessUrl);

    const token  = await AccessToken(accessUrl, mail, pw, callback);

    await sleep(5 * 1000);

    return token;

}



const htmlToAccessUrl  = (html) => {

    const dom  = parse(html);
    const item  = dom.querySelector('a');

    if(item){
        return item.getAttribute('href');
    }
    return false;
}