import {createToken} from '../src/main/service/stabilityToken.js'



async function Main(){

    await createToken((message)=>{
        console.log(message)
    });
}


Main();