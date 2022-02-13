import * as _ from 'lodash';
import * as moment from 'moment';
import { ApiReportHttpService } from './api-report-http.service';
import { BaseService } from 'app/services/base.service';
import { Injectable } from '@angular/core';
import { QueryModel } from './../../../models/query.model';
// import { TranslateService } from "@ngx-translate/core";
import * as XLSX from 'xlsx';
@Injectable()
export class ReportService extends BaseService {
    constructor(private apiHttpService: ApiReportHttpService) {
        super();
    }

    async exportOrders(query: QueryModel) {
        return await this.apiHttpService.dowload(
            `export/orders${query.url()}`,
            null,
            'orders.xlsx'
        );
    }

    async exportOrdersForUser(query: QueryModel) {
        return await this.apiHttpService.dowload(
            `export/orders/user${query.url()}`,
            null,
            `Order-${moment().format('DD-MM-YYYY HHmmss')}.xlsx`
        );
        /*
        const data = [];
        data.push({
            A: 'Tên khách hàng',
            B: 'Mã đơn hàng',
            C: 'Mã tham chiếu',
            D: 'Giao hàng (km)',
            E: 'Khối lượng (kg)',
            F: 'Thể tích (m3)',
            G: 'Điểm lấy hàng',
            H: 'Điểm giao hàng',
            I: 'Ngày hoàn thành',
            J: 'Giờ hoàn thành',
            K: 'Ngày tạo',
            L: 'Trạng thái',
            M: 'Tên đối tác',
            N: '3PL',
            O: 'Loại phương tiện',
            P: 'Mã cửa hàng',
            Q: 'Vĩ độ',
            R: 'Kinh độ'
        });
        
        if (res && res.data) {
            let users = {};
            if (res.data.users) {
                users = _.groupBy(res.data.users, item => item._id);
            }
            let servicers = {};
            if (res.data.servicers) {
                servicers = _.groupBy(res.data.servicers, item => item._id);
            }
            let vehicleTypes = {};
            if (res.data.vehicleTypes) {
                vehicleTypes = _.groupBy(
                    res.data.vehicleTypes,
                    item => item._id
                );
            }

            if (res.data.orders) {
                for (const order of res.data.orders) {
                    const row = {};
                    row['A'] = users[order.userId]
                        ? users[order.userId][0].fullName
                        : '';
                    row['B'] = order.code || '';
                    row['C'] = order.externalCode || '';
                    row['D'] = order?.detail?.distance || '';
                    row['E'] = order?.weight || '';
                    row['F'] = order?.size?.volume || '';
                    row['G'] = order?.detail?.points[0]
                        ? order?.detail?.points[0].location.address
                        : '';
                    row['H'] = order?.detail?.points[1]
                        ? order?.detail?.points[1].location.address
                        : '';
                    row['I'] = order?.finishedAt
                        ? moment(order?.finishedAt).format('DD/MM/YYYY')
                        : '';
                    row['J'] = order?.finishedAt
                        ? moment(order?.finishedAt).format('HH:mm')
                        : '';
                    row['K'] = order?.createdAt
                        ? moment(order?.createdAt).format('DD/MM/YYYY')
                        : '';
                    row['L'] = this.translateService.instant(
                        `order.statusCode.${order?.status}`
                    );
                    row['M'] = servicers[order.servicerId]
                        ? servicers[order.servicerId][0].fullName
                        : '';
                    row['N'] = users[order.clientBranchId]
                        ? users[order.clientBranchId][0].fullName
                        : '';
                    row['O'] = vehicleTypes[order?.detail?.vehicleTypeId]
                        ? vehicleTypes[order?.detail?.vehicleTypeId][0].name
                        : '';
                    row['P'] =
                        order?.detail?.points[1] &&
                            order?.detail?.points[1].storeCode
                            ? order?.detail?.points[1].storeCode
                            : '';
                    row['Q'] =
                        order?.detail?.points[1] &&
                            order?.detail?.points[1].deliveryLocation
                            ? order?.detail?.points[1].deliveryLocation.lat
                            : '';
                    row['R'] =
                        order?.detail?.points[1] &&
                            order?.detail?.points[1].deliveryLocation
                            ? order?.detail?.points[1].deliveryLocation.lng
                            : '';
                    data.push(row);
                }
            }
        }
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data, { skipHeader: true });
        XLSX.utils.book_append_sheet(wb, ws);
        XLSX.writeFile(
            wb,
            `Order-${moment().format('DD-MM-YYYY HHmmss')}.xlsx`
        ); */
    }

    async exportForSo(query: QueryModel) {
        return await this.apiHttpService.dowload(
            `export/orders/c3pl${query.url()}`,
            null,
            `C3PL-order-${moment().format('DD-MM-YYYY HHmmss')}.xlsx`
        ); /*
        const data = [];
        data.push({
            A: "Tên khách hàng",
            B: "Mã SO",
            C: "Số kiện",
            D: "Điểm lấy hàng",
            E: "Điểm giao hàng",
            F: "Giao hàng (km)",
            G: "Khối lượng (kg)",
            H: "Ngày tạo",
            I: "Giờ tạo",
            J: "Thời gian tạo phiên bàn giao 3PL",
            K: "3PL",
            L: "Thời gian gán đơn",
            M: "Ngày gán đơn",
            N: "Số lần gán đơn",
            O: "Lấy hàng thành công",
            P: "Ngày hoàn thành",
            Q: "Trạng thái",
            R: "Tên đối tác",
            S: "SĐT đối tác",
            T: "Loại phương tiện",
            U: "Mã cửa hàng",
            V: "Tên cửa hàng",
            W: "SĐT cửa hàng",
            X: "Mã đơn giao hàng",
            Y: "SL đóng gói"
        });
        if (res && res.data) {
            let users = {};
            if (res.data.users) {
                users = _.groupBy(res.data.users, item => item._id);
            }
            let servicers = {};
            if (res.data.servicers) {
                servicers = _.groupBy(res.data.servicers, item => item._id);
            }
            let vehicleTypes = {};
            if (res.data.vehicleTypes) {
                vehicleTypes = _.groupBy(
                    res.data.vehicleTypes,
                    item => item._id
                );
            }
            let activities = {};
            if (res.data.activities) {
                activities = _.groupBy(
                    res.data.activities,
                    item => item.orderId
                );
            }
            if (res.data.orders) {
                for (const order of res.data.orders) {
                    const row = {};
                    row['A'] = users[order.userId]
                        ? users[order.userId][0].fullName
                        : '';
                    row['B'] = order.externalCode.split('_')[0] || null;
                    row['C'] = order.Packages || 0;
                    row['D'] = order?.detail?.points[0]
                        ? order?.detail?.points[0].location.address
                        : '';
                    row['E'] = order?.detail?.points[1]
                        ? order?.detail?.points[1].location.address
                        : '';
                    row['F'] = order?.detail?.distance || '';
                    row['G'] = order?.weight || '';
                    row['H'] = order?.createdAt
                        ? moment(order?.createdAt).format('DD/MM/YYYY')
                        : '';
                    row['I'] = order?.createdAt
                        ? moment(order?.createdAt).format('HH:mm')
                        : '';
                    row['J'] = order?.clientHandoverAt
                        ? moment(order?.clientHandoverAt).format(
                            'DD/MM/YYYY HH:mm'
                        )
                        : '';
                    row['K'] = users[order.clientBranchId]
                        ? users[order.clientBranchId][0].fullName
                        : '';
                    let collumnL = null;
                    let collumnO = null;
                    if (activities[order._id]) {
                        const findL = _.find(
                            activities[order._id],
                            item => item.type === 'assigned'
                        );
                        if (findL) {
                            collumnL = findL.createdAt;
                        }
                        const findO = _.find(
                            activities[order._id],
                            item => item.type === 'pickedupSuccess'
                        );
                        if (findO) {
                            collumnO = findO.createdAt;
                        }
                    }
                    row['L'] = collumnL ? moment(collumnL).format('HH:mm') : '';
                    row['M'] = collumnL
                        ? moment(collumnL).format('DD/MM/YYYY')
                        : '';
                    let assigned = 0;
                    if (res.data.activities) {
                        const assigns = res.data.activities.filter(
                            item =>
                                item.type === 'assigned' &&
                                item.orderId === order._id
                        );
                        assigned = assigns.length;
                    }
                    row['N'] = assigned;
                    row['O'] = collumnO
                        ? moment(collumnO).format('DD/MM/YYYY HH:mm')
                        : '';
                    row['P'] = order?.finishedAt
                        ? moment(order?.finishedAt).format('DD/MM/YYYY HH:mm')
                        : '';
                    row['Q'] = this.translateService.instant(
                        `order.statusCode.${order?.status}`
                    );
                    row['R'] = servicers[order.servicerId]
                        ? servicers[order.servicerId][0].fullName
                        : '';
                    row['S'] = servicers[order.servicerId]
                        ? servicers[order.servicerId][0].phone
                        : '';
                    row['T'] = vehicleTypes[order?.detail?.vehicleTypeId]
                        ? vehicleTypes[order?.detail?.vehicleTypeId][0].name
                        : '';
                    row['U'] =
                        order?.detail?.points[1] &&
                            order?.detail?.points[1].storeCode
                            ? order?.detail?.points[1].storeCode
                            : '';
                    row['V'] =
                        order?.detail?.points[1] &&
                            order?.detail?.points[1].contact &&
                            order?.detail?.points[1].contact.name
                            ? order?.detail?.points[1].contact.name
                            : '';
                    row['W'] =
                        order?.detail?.points[1] &&
                            order?.detail?.points[1].contact &&
                            order?.detail?.points[1].contact.phone
                            ? order?.detail?.points[1].contact.phone
                            : '';
                    row['X'] = order ? order.deliveryOrder : null;
                    row['Y'] = order ? order.totalQty : null;
                    data.push(row);
                }
            }
        }
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data, { skipHeader: true });
        XLSX.utils.book_append_sheet(wb, ws);
        XLSX.writeFile(
            wb,
            `C3PL-order-${moment().format('DD-MM-YYYY HHmmss')}.xlsx`
        );*/
    }

    async exportDistanceByOrder(query: QueryModel) {
        return await this.apiHttpService.dowload(
            `export/distance-group${query.url()}`,
            null,
            'distance.xlsx'
        );
    }

    async exportTransactions(query: QueryModel) {
        return await this.apiHttpService.dowload(
            `export/finance${query.url()}`,
            null,
            'transactions.xlsx'
        );
    }

    async exportAccountBalance(query: QueryModel) {
        return await this.apiHttpService.dowload(
            `export/finance/account-balance${query.url()}`,
            null,
            'account-balance.xlsx'
        );
    }

    async exportCOD(query: QueryModel) {
        const fileName = moment().format('YYYYMMDDHHmm');
        return await this.apiHttpService.dowload(
            `export/cod${query.url()}`,
            null,
            `OrderCOD_${fileName}.xlsx`
        );
    }

    async exportSessionOrder(query: QueryModel) {
        return await this.apiHttpService.dowload(
            `export/cod-session/order${query.url()}`,
            null,
            'session-cod-order.xlsx'
        );
    }

    async exportSession(query: QueryModel) {
        return await this.apiHttpService.dowload(
            `export/cod-session${query.url()}`,
            null,
            'session-cod.xlsx'
        );
    }

    async exportRequest(query: QueryModel) {
        const fileName = moment().format('YYYYMMDDHHmm');
        return await this.apiHttpService.dowload(
            `export/cod-requests${query.url()}`,
            null,
            `PhienChuyenTien_${fileName}.xlsx`
        );
    }

    async checkListSO(SOList) {
        return await this.apiHttpService.post(`export/orders/checkListSO`, {
            externalCode: SOList
        });
    }

    async downloadSO(SOList) {
        const fileName = moment().format('YYYYMMDDHHmm');

        return await this.apiHttpService.postDowload(
            `export/orders/so`,
            {
                externalCode: SOList
            },
            null,
            `report_SO_${fileName}.xlsx`
        );
    }

    async downloadErrorSO(SOList) {
        const fileName = moment().format('YYYYMMDDHHmm');

        const data = [];
        data.push({
            A: 'STT',
            B: 'Mã SO'
        });
        let i = 1;
        for (const so of SOList) {
            data.push({
                A: i,
                B: so
            });
            i++;
        }
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data, { skipHeader: true });
        XLSX.utils.book_append_sheet(wb, ws);
        XLSX.writeFile(wb, `SO-error-${fileName}.xlsx`);
    }
}
