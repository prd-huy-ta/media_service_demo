import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import {S3Client, PutObjectCommand} from "@aws-sdk/client-s3";
import {APIGatewayProxyEvent, APIGatewayProxyResult,} from 'aws-lambda';
import {RequestPresigningArguments} from '@aws-sdk/types'

export const handler = async (event: APIGatewayProxyEvent):
    Promise<APIGatewayProxyResult> => {
    let response: { body: string; statusCode: number };
    let s3Client: S3Client;
    try {
        if (event.queryStringParameters === null || event.queryStringParameters.Key === null) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'The request is in valid. Please check the request again!',
                }),
            };
        }
        const eventParameters = event.queryStringParameters.eventParameters //TODO: Save to DynamoDB

        const s3Params = {
            Bucket: process.env.BUCKET,
            Key: event.queryStringParameters.Key
        }

        const command = new PutObjectCommand(s3Params);
        const options: RequestPresigningArguments = {
            expiresIn: Number(process.env.EXPIRE_TIME) || 60 * 60
        }

        s3Client = new S3Client(s3Params);
        const url = await getSignedUrl(s3Client, command, options);

        response = {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Get S3-Signed-URL successfully!',
                url: url
            }),
        };
        return response;
    } catch (error) {
        console.log('An error have occurred!')
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'There have been a error with server. Please contact the admin!',
            }),
        };
    }
}