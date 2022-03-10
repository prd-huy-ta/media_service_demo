import {APIGatewayProxyResult} from 'aws-lambda';
import {GetObjectCommand, PutObjectCommand, PutObjectCommandOutput, S3Client} from "@aws-sdk/client-s3";
import sharp, {FormatEnum, Sharp} from "sharp";
import type {Readable} from "stream"
import {S3Event, S3EventRecord} from "aws-lambda/trigger/s3";
import {int} from "aws-sdk/clients/datapipeline";

type Dimension = {
    width: int;
    height: int;
};

const DEFAULT_IMAGE_FORMAT = 'JPEG';

const dimensions: Array<Dimension> = [
    // {"width": 640, 'height': -1},
    {'width': 50, 'height': 50},
    {'width': 180, 'height': 180},
    {'width': 320, 'height': 320},
    {'width': 843, 'height': 504}
]
const client = new S3Client({});

async function create_thumbnails(dimension: Dimension, image: Sharp, baseName: string): Promise<PutObjectCommandOutput> {
    let editedImage = image.resize({
        height: dimension.height,
        width: dimension.width,
    })
    editedImage = editedImage.toFormat(DEFAULT_IMAGE_FORMAT as keyof (FormatEnum))
    let newName = `${baseName}${dimension.height}x${dimension.width}.${DEFAULT_IMAGE_FORMAT}`

    const imageBuffer = await editedImage.toBuffer();

    const putObjectCommand = new PutObjectCommand({
        Bucket: process.env.OUTPUT_BUCKET,
        Body: imageBuffer,
        Key: newName
    });

    return client.send(putObjectCommand)
}

export const handler = async (event: S3Event):
    Promise<APIGatewayProxyResult> => {
    let response: APIGatewayProxyResult
    try {
        console.log(event)
        console.log((event.Records)[0].s3)
        const location = {
            Bucket: (event.Records)[0].s3.bucket.name,
            Key: (event.Records)[0].s3.object.key
        }

        const command = new GetObjectCommand(location);
        const imageObject = await client.send(command);
        const baseName = (event.Records[0]).s3.object.key.split('.')[0]
        const stream = imageObject.Body as Readable

        const streamToBuffer = (stream: Readable) => new Promise<Buffer>((resolve, reject) => {
            const chunks: Buffer[] = []
            stream.on('data', chunk => chunks.push(chunk))
            stream.once('end', () => resolve(Buffer.concat(chunks)))
            stream.once('error', reject)
        })

        const image = await streamToBuffer(stream)
        let originalImage = sharp(image);

        await Promise.all(dimensions.map((dimension) => {
            create_thumbnails(dimension, originalImage, baseName)
        })).then((responses) =>
            console.log((responses)))

        response = {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Process successfully!',
            }),
        };

    } catch (e) {
        console.error(e);
        response = {
            statusCode: 500,
            body: JSON.stringify({
                message: 'An unexpected error happened!',
            }),
        };
    }
    return response
}