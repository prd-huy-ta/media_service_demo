export interface WorkflowPayload {
    location: {
        Bucket: string,
        Key: string
    };
    payload: {
        type: string;
        data: string | undefined;
    };
    num: number;
}
