import {WorkflowPayload} from './event';
import {cloneDeep} from 'lodash';

export const handler = async (event: WorkflowPayload):
    Promise<WorkflowPayload> => {
    let result: WorkflowPayload
    result = cloneDeep(event)
    result.payload.data = "not dummy";

    return result
}