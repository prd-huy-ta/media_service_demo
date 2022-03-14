import {APIGatewayProxyResult, S3Event} from 'aws-lambda';

export const handler = async (event: S3Event):
    Promise<APIGatewayProxyResult> => {
    let response: APIGatewayProxyResult
    try {
        console.log(event)
        console.log(event.Records[0].s3)

        response = {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Process successfully!',
                event: event
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