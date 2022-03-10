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
const sharp_1 = __importDefault(require("sharp"));
const DEFAULT_IMAGE_FORMAT = 'JPEG';
const dimensions = [
    // {"width": 640, 'height': -1},
    { 'width': 50, 'height': 50 },
    { 'width': 180, 'height': 180 },
    { 'width': 320, 'height': 320 },
    { 'width': 843, 'height': 504 }
];
const client = new client_s3_1.S3Client({});
function create_thumbnails(dimension, image, baseName) {
    return __awaiter(this, void 0, void 0, function* () {
        let editedImage = image.resize({
            height: dimension.height,
            width: dimension.width,
        });
        editedImage = editedImage.toFormat(DEFAULT_IMAGE_FORMAT);
        let newName = `${baseName}${dimension.height}x${dimension.width}.${DEFAULT_IMAGE_FORMAT}`;
        const imageBuffer = yield editedImage.toBuffer();
        const putObjectCommand = new client_s3_1.PutObjectCommand({
            Bucket: process.env.OUTPUT_BUCKET,
            Body: imageBuffer,
            Key: newName
        });
        return client.send(putObjectCommand);
    });
}
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    let response;
    try {
        console.log(event);
        console.log((event.Records)[0].s3);
        const location = {
            Bucket: (event.Records)[0].s3.bucket.name,
            Key: (event.Records)[0].s3.object.key
        };
        const command = new client_s3_1.GetObjectCommand(location);
        const imageObject = yield client.send(command);
        const baseName = (event.Records[0]).s3.object.key.split('.')[0];
        const stream = imageObject.Body;
        const streamToBuffer = (stream) => new Promise((resolve, reject) => {
            const chunks = [];
            stream.on('data', chunk => chunks.push(chunk));
            stream.once('end', () => resolve(Buffer.concat(chunks)));
            stream.once('error', reject);
        });
        const image = yield streamToBuffer(stream);
        let originalImage = (0, sharp_1.default)(image);
        yield Promise.all(dimensions.map((dimension) => {
            create_thumbnails(dimension, originalImage, baseName);
        })).then((responses) => console.log((responses)));
        response = {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Process successfully!',
            }),
        };
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
//# sourceMappingURL=handler.ts.map