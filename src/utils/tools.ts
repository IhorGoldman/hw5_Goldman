import {IncomingMessage} from "node:http";

export const sayHi = (name:string):void => {
    console.log(`Hello ${name}`)
}
export async function parseBody(req: IncomingMessage) {
    return new Promise((resolve, reject) => {
        let body = "";
        req.on('data', (chunk) => {
            body += chunk.toString();
        })
        req.on('end', () => {
            try {
                resolve(JSON.parse(body))
            } catch (e) {
                reject(new Error('Invalid json'))
            }
        })
    })
}

export const isUserType = (obj:any):boolean => {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        typeof obj.id === 'number' &&
        typeof obj.userName === 'string'
    );
}
