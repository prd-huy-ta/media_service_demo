import {APIGatewayProxyResult, APIGatewayProxyEvent} from 'aws-lambda';

export const handler = async (event: APIGatewayProxyEvent):
    Promise<APIGatewayProxyResult> => {
    let response: APIGatewayProxyResult
    try {
        const queryStringParameters = event.queryStringParameters
        const multiValueQueryStringParameters = event.multiValueQueryStringParameters
        const pathParameters = event.pathParameters
        const stageVariables = event.stageVariables
        const headers = event.headers
        const body = JSON.parse(event.body)
        console.log(event)
        response = {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Receive request with these following parameters',
                parameters: {
                    queryStringParameters: queryStringParameters,
                    multiValueQueryStringParameters: multiValueQueryStringParameters,
                    pathParameters: pathParameters,
                    stageVariables: stageVariables,
                    headers: headers,
                    body: body,
                    event: event
                }
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