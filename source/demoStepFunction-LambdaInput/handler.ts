import {EventBridgeEvent, APIGatewayProxyEvent} from 'aws-lambda';
import {WorkflowPayload} from './event';

export const handler = async (event: EventBridgeEvent<any, any>):
    Promise<WorkflowPayload> => {
    let result: WorkflowPayload
    result = {
        location: {
            Bucket: event.detail.bucket.name,
            Key: event.detail.object.key
        },
        payload: {
            type: "image",
            data: "dummy"
        },
        num: event.detail.object.key.length
    }

    return result
}