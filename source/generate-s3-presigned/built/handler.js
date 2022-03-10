"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const client_s3_1 = require("@aws-sdk/client-s3");
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    let response;
    let s3Client;
    if (event.queryStringParameters === null || event.queryStringParameters.Key === null) {
        throw Error(); //TODO
    }
    const operations = event.queryStringParameters.operations; //TODO: Save to DynamoDB
    const s3Params = {
        Bucket: process.env.BUCKET,
        Key: event.queryStringParameters.Key
    };
    const command = new client_s3_1.PutObjectCommand(s3Params);
    const options = {
        expiresIn: Number(process.env.EXPIRE_TIME) || 60 * 60
    };
    s3Client = new client_s3_1.S3Client(s3Params);
    const url = yield (0, s3_request_presigner_1.getSignedUrl)(s3Client, command, options);
    const getLocation = {
        Bucket: 'mediaservice-mediainput-1g460pwbran33',
        Key: 'family_guy.mp4'
    };
    const getCommand = new client_s3_1.GetObjectCommand(getLocation);
    const videoObject = yield s3Client.send(getCommand);
    const stream = videoObject.Body;
    const streamToBuffer = (stream) => new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', chunk => chunks.push(chunk));
        stream.once('end', () => resolve(Buffer.concat(chunks)));
        stream.once('error', reject);
    });
    const video = yield streamToBuffer(stream);
    const putObjectCommand = new client_s3_1.PutObjectCommand({
        Bucket: 'huytatest',
        Body: video,
        Key: 'adfasdfadsf.mp4'
    });
    let r = yield s3Client.send(putObjectCommand);
    console.log(r);
    response = {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Get S3-Signed-URL successfully!',
            url: url
        }),
    };
    return response;
});
exports.handler = handler;
//# sourceMappingURL=handler.ts.map