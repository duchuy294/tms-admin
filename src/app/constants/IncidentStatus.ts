export enum IncidentStatus {
    new = 0,
    processing = 1,
    successful_process = 2,
    failed_process = 3
}

export const INCIDENT_STATUS_COLOR = {
    [IncidentStatus.new]: 'red',
    [IncidentStatus.processing]: 'blue',
    [IncidentStatus.successful_process]: 'green',
    [IncidentStatus.failed_process]: 'red',
};