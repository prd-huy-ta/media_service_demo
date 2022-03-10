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
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    let response;
    try {
        const queryStringParameters = event.queryStringParameters;
        const multiValueQueryStringParameters = event.multiValueQueryStringParameters;
        const pathParameters = event.pathParameters;
        const stageVariables = event.stageVariables;
        const headers = event.headers;
        const body = JSON.parse(event.body);
        console.log(event);
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
//# sourceMappingURL=handler.js.map