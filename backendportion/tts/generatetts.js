import fs from 'fs/promises';
import path from 'path';
import textToSpeech from '@google-cloud/text-to-speech';

// Create TTS client
const client = new textToSpeech.TextToSpeechClient();

export async function generateTTS(summaryText, outputFile = 'summary.mp3') {
  const request = {
    input: { text: summaryText },
    voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
    audioConfig: { audioEncoding: 'MP3' },
  };

  const [response] = await client.synthesizeSpeech(request);
  const filePath = path.join('output', outputFile);
  await fs.mkdir('output', { recursive: true });
  await fs.writeFile(filePath, response.audioContent, 'binary');

  console.log(`Audio saved to ${filePath}`);
  return filePath;
}
