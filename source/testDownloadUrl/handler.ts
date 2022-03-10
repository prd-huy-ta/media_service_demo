import {APIGatewayProxyResult, APIGatewayProxyEvent} from 'aws-lambda';
import {PutObjectCommand, PutObjectCommandOutput, S3Client} from "@aws-sdk/client-s3";
import {HttpClient} from "typed-rest-client/HttpClient";
import axios from "axios";

const s3Client = new S3Client({});

export const handler = async (event: APIGatewayProxyEvent):
    Promise<APIGatewayProxyResult> => {
    let response: APIGatewayProxyResult
    let data: Buffer[] = [];
    let buffer: Buffer;
    try {
        // @ts-ignore
        const url = event.queryStringParameters.url;
        // @ts-ignore
        const client = new HttpClient("clientTest");
        const res = await axios.get(url, {
            responseType: "arraybuffer",
        });
        buffer = Buffer.from(res.data, "base64");

        // @ts-ignore
        buffer = await buffer
        console.log(buffer)
        const putObjectCommand = new PutObjectCommand({
            Bucket: 'huytatest',
            Body: await buffer,
            Key: 'test'
        });

        response = {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Process successfully!',
            }),
        };

        await s3Client.send(putObjectCommand);

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