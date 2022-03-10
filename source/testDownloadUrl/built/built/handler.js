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
const client_s3_1 = require("@aws-sdk/client-s3");
const http_1 = require("http");
const client = new client_s3_1.S3Client({});
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    let response;
    let data;
    let buffer;
    try {
        // @ts-ignore
        const url = event.queryStringParameters.url;
        // @ts-ignore
        (0, http_1.get)(url, function (response) {
            response.on('data', function (chunk) {
                data.push(chunk);
            }).on('end', function () {
                buffer = Buffer.concat(data);
            });
        });
        // @ts-ignore
        const putObjectCommand = new client_s3_1.PutObjectCommand({
            Bucket: 'huytatest',
            Body: buffer,
            Key: 'test'
        });
        response = {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Process successfully!',
            }),
        };
        yield client.send(putObjectCommand);
    }
    catch (e) {
        console.error(e);
        response = {
            statusCode: 500,
            body: JSON.stringify({
                message: 'An unexpected error happened!',
            }),
        };
    }
    return response;
});
exports.handler = handler;
//# sourceMappingURL=handler.js.map