import {APIGatewayProxyResult, APIGatewayProxyEvent} from 'aws-lambda';
import {PutObjectCommand, PutObjectCommandOutput, S3Client} from "@aws-sdk/client-s3";
import type {Readable} from "stream"
import {get} from "http";


const client = new S3Client({});

export const handler = async (event: APIGatewayProxyEvent):
    Promise<APIGatewayProxyResult> => {
    let response: APIGatewayProxyResult
    let data: Buffer[];
    let buffer: Buffer;
    try {
        // @ts-ignore
        const url = event.queryStringParameters.url;
        // @ts-ignore
        get(url, function (response) {

            response.on('data', function (chunk) {
                data.push(chunk);
            }).on('end', function () {
                buffer = Buffer.concat(data);
            });
        });

        // @ts-ignore
        const putObjectCommand = new PutObjectCommand({
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

        await client.send(putObjectCommand);

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