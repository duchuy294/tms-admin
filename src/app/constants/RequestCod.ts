
export enum RequestCodEnum  {
    cancel = 'cancel',
    success = 'success',
    request = 'request',
    reject = 'reject',
    processing = 'processing',
    holding = 'holding',
}

export const RequestCodOrder = {
    1: { name: 'notSubmitted', color: '#E30000'},
    2: { name: 'waitConfirm', color: '#0084DC'},
    3: { name: 'submitted', color: '#008D26'}
};

export const RequestCod = {
    [RequestCodEnum.cancel]: { name: 'Cancel', color: '#E30000' },
    [RequestCodEnum.success]: { name: 'Success', color: '#008D26' },
    [RequestCodEnum.request]: { name: 'Request', color: '#0084DC' },
    [RequestCodEnum.reject]: { name: 'Reject', color: '#E30000' },
    [RequestCodEnum.processing]: { name: 'Processing', color: '#FF6A1A' },
    [RequestCodEnum.holding]: { name: 'holding', color: '#009B8B' },
};

