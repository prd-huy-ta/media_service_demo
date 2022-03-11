import {
    APIGatewayAuthorizerCallback,
    APIGatewayRequestAuthorizerEvent
} from 'aws-lambda';

export const handler = async (event: APIGatewayRequestAuthorizerEvent, context, callback: APIGatewayAuthorizerCallback):
    Promise<void> => {

    const headers = event.headers;
    const queryStringParameters = event.queryStringParameters;
    console.log(typeof context)
    console.log(context)

    let condition = {
        IpAddress: undefined
    };
    condition.IpAddress = {};

    if (headers["Authorization-Example"] === "Token"
        && queryStringParameters.hash === "XXX") {
        callback(null, generateAllow('me', event.methodArn));
    } else {
        callback("Unauthorized");
    }
}

const generatePolicy = function (principalId, effect, resource) {
    let authResponse = {
        principalId: undefined,
        policyDocument: undefined
    };
    authResponse.principalId = principalId;
    if (effect && resource) {
        let policyDocument = {
            Version: undefined,
            Statement: undefined
        };
        policyDocument.Version = '2012-10-17'; // default version
        policyDocument.Statement = [];
        let statementOne = {
            Effect: undefined,
            Action: undefined,
            Resource: undefined
        };
        statementOne.Action = 'execute-api:Invoke'; // default action
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }

    return authResponse;
}

const generateAllow = function (principalId, resource) {
    return generatePolicy(principalId, 'Allow', resource);
}
