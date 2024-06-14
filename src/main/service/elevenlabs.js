import axios from 'axios'
import fs from 'fs-extra'

const elevenLabsAPIV1 = "https://api.elevenlabs.io/v1";

/**

Function initializes ElevenLabs API.

@param {Object} - An object containing the API Key and API Version [default: ElevenLabs V1].
*/
export default function ElevenLabs(options = {
    apiKey: "",
    voiceId: ""
}) {

    this.apiKey = options.apiKey ? options.apiKey : "";
    this.voiceId = options.voiceId ? options.voiceId : "pNInz6obpgDQGcFmaJgB"; // Default voice 'Adam'

    if(this.apiKey === ""){
        console.log("ERR: Missing API key");
        return;
    }
}



ElevenLabs.prototype.textToSpeechStream = async function({
    voiceId,
    textInput,
    stability,
    similarityBoost,
    modelId,
    responseType,
    style,
    speakerBoost
}) {
    try {
        if (!textInput) {
            console.log("ERR: Missing parameter {textInput}");
            return;
        }

        const voiceIdValue = voiceId ? voiceId : this.voiceId;
        const voiceURL = `${elevenLabsAPIV1}/text-to-speech/${voiceIdValue}/stream`;
        const stabilityValue = stability ? stability : 0;
        const similarityBoostValue = similarityBoost ? similarityBoost : 0;
        const styleValue = style ? style : 0;

        const response = await axios({
            method: "POST",
            url: voiceURL,
            data: {
                text: textInput,
                voice_settings: {
                    stability: stabilityValue,
                    similarity_boost: similarityBoostValue,
                    style: styleValue,
                    use_speaker_boost: speakerBoost,
                },
                model_id: modelId ? modelId : undefined,
            },
            headers: {
                Accept: "audio/mpeg",
                "xi-api-key": this.apiKey,
                "Content-Type": "application/json",
            },
            responseType: responseType ? responseType : "stream"
        });

        return response.data;
    } catch (error) {
       console.log("textToSpeechStream error: ", error.message)
    }
};