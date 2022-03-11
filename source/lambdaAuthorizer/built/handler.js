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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const handler = (event, context, callback) => __awaiter(void 0, void 0, void 0, function* () {
    const headers = event.headers;
    const queryStringParameters = event.queryStringParameters;
    console.log(typeof context);
    console.log(context);
    let condition = {
        IpAddress: undefined
    };
    condition.IpAddress = {};
    if (headers["Authorization-Example"] === "Token"
        && queryStringParameters.hash === "XXX") {
        callback(null, generateAllow('me', event.methodArn));
    }
    else {
        callback("Unauthorized");
    }
});
exports.handler = handler;
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
};
const generateAllow = function (principalId, resource) {
    return generatePolicy(principalId, 'Allow', resource);
};
//# sourceMappingURL=handler.js.map