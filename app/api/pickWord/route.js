import { NextResponse } from 'next/server';
import { words } from './words';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';

const client = new TextToSpeechClient();

export async function GET(req){
    const word = words[Math.floor(Math.random() * words.length)];
    const request = {
        input: {text: word},
        // Select the language and SSML voice gender (optional)
        voice: {name: "en-US-Standard-D", languageCode: 'en-US'},
        // select the type of audio encoding
        audioConfig: {audioEncoding: 'MP3'},
    };
    const [response] = await client.synthesizeSpeech(request);
    return NextResponse.json({ "word": word, "audio": response.audioContent });
}