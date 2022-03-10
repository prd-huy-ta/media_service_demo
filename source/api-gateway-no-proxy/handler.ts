import {APIGatewayProxyResult, APIGatewayProxyEvent} from 'aws-lambda';

export const handler = async (event: APIGatewayProxyEvent):
    Promise<APIGatewayProxyResult> => {
    let response: APIGatewayProxyResult
    try {
        console.log(event)
        const dummy = {
            "key1": "value1",
            "key2": "value2"
        }
        response = {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Receive request with these following parameters',
                event: event,
                passFromLambda: dummy
            })
        }
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