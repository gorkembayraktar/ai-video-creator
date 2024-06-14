
import fs from 'fs'

export const log = (path, data) => {
    const message = `[${new Date().toUTCString()}] ${data} \n`;
    fs.appendFileSync(path, message);
}