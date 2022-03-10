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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const HttpClient_1 = require("typed-rest-client/HttpClient");
const axios_1 = __importDefault(require("axios"));
const s3Client = new client_s3_1.S3Client({});
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    let response;
    let data = [];
    let buffer;
    try {
        // @ts-ignore
        const url = event.queryStringParameters.url;
        // @ts-ignore
        const client = new HttpClient_1.HttpClient("clientTest");
        const res = yield axios_1.default.get(url, {
            responseType: "arraybuffer",
        });
        buffer = Buffer.from(res.data, "base64");
        // @ts-ignore
        buffer = yield buffer;
        console.log(buffer);
        const putObjectCommand = new client_s3_1.PutObjectCommand({
            Bucket: 'huytatest',
            Body: yield buffer,
            Key: 'test'
        });
        response = {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Process successfully!',
            }),
        };
        yield s3Client.send(putObjectCommand);
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