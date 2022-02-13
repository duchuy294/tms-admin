import * as _ from 'lodash';
import * as moment from 'moment';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CustomerService } from '@/modules/customer/services/customer.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { QueryModel } from '@/models/query.model';


@Component({
  selector: 'condition-item',
  templateUrl: './condition-item.component.html',
  styleUrls: ['./condition-item.component.less']
})
export class ConditionItemComponent implements OnInit, OnChanges {
  @Input() conditionName: string;
  @Input() title: string;
  @Input() data: any;
  @Input() type: any;
  @Output() onAdd = new EventEmitter<any>();
  @Output() onRemove = new EventEmitter<any>();
  @Input() conditionData: any;
  selectedItem: any;
  selectedList: any;
  selectedDistrict: any;
  startTime = moment().startOf('day').toDate();
  endTime = moment().endOf('day').toDate();
  input1: Date | number = moment().startOf('day').toDate();
  input2: Date | number = moment().endOf('day').toDate();
  tOUpdateAsyn = -1;
  itemType: string = '';
  constructor(
    private messageService: NzMessageService,
    private customerService: CustomerService,
  ) { }

  ngOnInit() {
    this.initialFieldValue();
  }

  initialFieldValue() {
    if (this.type.dataType && this.data) {
      switch (this.data.dataType) {
        case 'date':
          this.input1 = moment().startOf('day').toDate();
          this.input2 = moment().endOf('day').toDate();
          break;
        case 'number':
          this.input1 = 0;
          this.input2 = 0;
          break;
        default:
          this.input1 = null;
          this.input2 = null;
      }
    } else if (this.type.fixedOperator) {
      this.input1 = 0;
      this.itemType = 'fixedOperator';
    } else if (this.type.fixedValue) {
      this.input1 = 0;
      this.itemType = 'fixedValue';
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.conditionData) {
      if (this.tOUpdateAsyn) {
        clearTimeout(this.tOUpdateAsyn);
      }
      this.tOUpdateAsyn = <any>setTimeout(() => {
        this.loadData();
      }, 300);
    }
  }

  loadData() {
    this.selectedList = { ...this.conditionData[this.conditionName] };
    if (this.type.typeValue === 'timeRange') {
      if (this.selectedList.startTime && this.selectedList.startTime >= 0) {
        this.startTime = moment(parseInt(this.selectedList.startTime)).toDate();
      }
      if (this.selectedList.endTime && this.selectedList.endTime >= 0) {
        this.endTime = moment(parseInt(this.selectedList.endTime)).toDate();
      }
    } else if (this.type.typeValue === 'operator') {
      const DATA = this.conditionData[this.conditionName];
      if (this.type.fixedOperator) {
        this.selectedList = {
          operator: this.type.fixedOperator,
          value: [(DATA && DATA.value && DATA.value[0]) || 0]
        };
        this.input1 = this.selectedList.value;
        if (_.isEmpty(DATA)) {
          this.onAdd.emit({ conditionName: this.conditionName, value: this.selectedList });
        }
      } else {
        if (this.type['dataType']) {
          const data = this.conditionData[this.conditionName];
          if (data && data.value && data.operator) {
            if (data.operator === 'between') {
              if (data.value.length >= 1 && data.value[0]) {
                this.input1 = this.type.dataType === 'date' ? moment(parseInt(data.value[0])).toDate() : data.value[0];
              } else {
                this.input1 = this.type.dataType === 'date' ? moment().startOf('day').toDate() : null;
              }
              if (data.value.length >= 2 && data.value[1]) {
                this.input2 = this.type.dataType === 'date' ? moment(parseInt(data.value[1])).toDate() : data.value[1];
              } else {
                this.input2 = this.type.dataType === 'date' ? moment().endOf('day').toDate() : null;
              }
            } else {
              if (data.value.length > 0) {
                this.input1 = this.type.dataType === 'date' ? moment(parseInt(data.value[0])).toDate() : data.value[0];
              } else {
                this.input1 = this.type.dataType === 'date' ? moment().startOf('day').toDate() : null;
              }
              this.input2 = this.type.dataType === 'date' ? moment().startOf('day').toDate() : null;
            }
          }
        }
      }

    }
  }

  removeItem(itemId: string = null) {
    if (this.selectedList[itemId]) {
      delete this.selectedList[itemId];
      this.selectedList = { ...this.selectedList };
    }
    this.onAdd.emit({ conditionName: this.conditionName, value: this.selectedList });
  }

  addItem() {
    if (!this.selectedItem) {
      this.messageService.warning('Vui lòng chọn');
      return;
    }
    if (this.selectedList.hasOwnProperty(this.selectedItem._id)) {
      this.messageService.warning('Lựa chọn đã tồn tại');
      this.selectedItem = null;
      return;
    }
    this.selectedList = {
      ...this.selectedList,
      [this.selectedItem._id]: { value: this.selectedItem._id, name: this.selectedItem.name },
    };
    this.selectedItem = null;
    this.onAdd.emit({ conditionName: this.conditionName, value: this.selectedList });
  }

  addCity() {
    if (!this.selectedItem) {
      this.messageService.warning('Vui lòng chọn thành phố');
      return;
    }
    if (!this.selectedList.hasOwnProperty(this.selectedItem._id)) {
      this.selectedList = {
        ...this.selectedList,
        [this.selectedItem._id]: {
          _id: this.selectedItem._id,
          value: {},
          name: this.selectedItem.name,
        },
      };
    }
    this.onAdd.emit({ type: 'city', currentValue: this.selectedItem, conditionName: this.conditionName, value: this.selectedList, });
    this.selectedItem = null;
  }

  addDistrict(cityId: string = null) {
    if (!this.selectedDistrict || this.selectedDistrict.city !== cityId) {
      this.messageService.warning('Vui lòng chọn quận');
      return;
    }
    const { district } = this.selectedDistrict;
    this.selectedList = {
      ...this.selectedList,
      [cityId]: {
        ...this.selectedList[cityId],
        value: {
          ...this.selectedList[cityId].value,
          [district._id]: { value: district._id, name: district.name },
        },
      },
    };
    this.selectedDistrict = null;
    this.onAdd.emit({ type: 'district', conditionName: this.conditionName, value: this.selectedList });
  }

  removeCity(cityId: string = null) {
    if (!_.isEmpty(this.conditionData.location) && this.conditionData.location[cityId]) {
      this.selectedList = this.conditionData.location;
      delete this.selectedList[cityId];
      this.onAdd.emit({ conditionName: this.conditionName, value: this.selectedList });
      this.conditionData.location = { ...this.conditionData.location };
    }
  }

  removeDistrict(cityId: string = null, districtId: string = null) {
    if (!_.isEmpty(this.conditionData.location) && this.conditionData.location[cityId]) {
      if (!_.isEmpty(this.conditionData.location[cityId].value) && this.conditionData.location[cityId].value[districtId]) {
        delete this.conditionData.location[cityId].value[districtId];
        this.conditionData.location[cityId].value = { ...this.conditionData.location[cityId].value };
      }
    }
  }

  async inputID() {
    if (!this.selectedItem) {
      this.messageService.warning('Vui lòng nhập dữ liệu');
      return;
    }
    const query = new QueryModel({ limit: 1000, code: this.selectedItem });
    const response = await this.customerService.getCustomers(query);
    let user = null;
    for (const account of response.data) {
      if (account.code === this.selectedItem) {
        user = { ...account };
        break;
      }
    }
    if (user === null) {
      this.messageService.warning('Không tìm thấy');
      this.selectedItem = null;
      return;
    }
    if (this.selectedList.hasOwnProperty(user._id)) {
      this.messageService.warning('Dữ liệu đã tồn tại');
      this.selectedItem = null;
      return;
    }
    this.selectedList = {
      ...this.selectedList,
      [user._id]: { value: user._id, name: String(this.selectedItem).toUpperCase() },
    };
    this.selectedItem = null;
    this.onAdd.emit({ conditionName: this.conditionName, value: this.selectedList });
  }

  addOperator() {
    if (this.conditionData[this.conditionName] &&
      !_.isEmpty(this.conditionData[this.conditionName]) &&
      this.conditionData[this.conditionName].operator !== ''
    ) {
      this.messageService.warning('Chỉ cho phép một điều kiện duy nhất');
      this.selectedItem = null;
      return;
    } else {
      this.selectedList = {
        operator: this.selectedItem,
      };
      this.onAdd.emit({ conditionName: this.conditionName, value: this.selectedList });
    }
    this.selectedItem = null;
  }

  removeOperator() {
    if (!_.isEmpty(this.conditionData[this.conditionName])) {
      delete this.conditionData[this.conditionName].operator;
      if (this.conditionData[this.conditionName].hasOwnProperty('value')) {
        delete this.conditionData[this.conditionName].value;
      }
    }
    this.conditionData[this.conditionName] = { ...this.conditionData[this.conditionName] };
    this.input1 = null;
    this.input2 = null;
  }

  inputCost() {
    if (!this.selectedItem) {
      this.messageService.warning('Vui lòng nhập dữ liệu');
      return;
    }
    if (isNaN(Number(this.selectedItem))) {
      this.messageService.warning('Dữ liệu không hợp lệ');
      this.selectedItem = null;
      return;
    }
    this.selectedList = {
      ...this.selectedList,
      [this.selectedItem]: { value: this.selectedItem, name: this.selectedItem },
    };
    this.selectedItem = null;
    this.onAdd.emit({ conditionName: this.conditionName, value: this.selectedList });
  }

  onClickRemove() {
    this.onRemove.emit(this.conditionName);
  }

  changeStartTime(time) {
    if (!time) {
      this.messageService.warning('Thời gian bắt đầu không hợp lệ');
      return;
    }
    if (time && this.endTime && this.compareTime(time, this.endTime) > 0) {
      this.messageService.warning('Khoảng thời gian không hợp lệ');
      this.startTime = moment().startOf('day').toDate();
      return;
    }

    this.processTimeData();
  }

  changeEndTime(time) {
    if (!time) {
      this.messageService.warning('Thời gian kết thúc không hợp lệ');
      return;
    }
    if (this.startTime && time && this.compareTime(this.startTime, time) > 0) {
      this.messageService.warning('Khoảng thời gian không hợp lệ');
      this.endTime = moment().endOf('day').toDate();
      return;
    }
    this.processTimeData();
  }

  compareTime(startTime, endTime) {
    startTime = moment(startTime).format('x');
    endTime = moment(endTime).format('x');
    return startTime - endTime;
  }

  processTimeData() {
    const currentTime = moment();
    this.selectedList = {
      // Ensure time in current day
      startTime: moment(this.startTime).year(currentTime.year()).month(currentTime.month()).date(currentTime.date()).valueOf(),
      endTime: moment(this.endTime).year(currentTime.year()).month(currentTime.month()).date(currentTime.date()).valueOf()
    };
    this.onAdd.emit({ conditionName: this.conditionName, value: this.selectedList });
  }

  changeOrdinaryInput1(input) {
    if (isNaN(Number(input))) {
      this.messageService.warning('Dữ liệu không hợp lệ');
      input = null;
      return;
    }
    if (this.conditionData[this.conditionName].operator === 'between') {
      this.selectedList = {
        ...this.selectedList,
        value: [Number(input), Number(this.input2)],
      };
      this.onAdd.emit({ conditionName: this.conditionName, value: this.selectedList });
    } else {
      this.selectedList = {
        ...this.selectedList,
        value: [Number(input)],
      };
      this.onAdd.emit({ conditionName: this.conditionName, value: this.selectedList });
    }
  }

  changeOrdinaryInput2(input) {
    if (isNaN(Number(input))) {
      this.messageService.warning('Dữ liệu không hợp lệ');
      input = null;
      return;
    }
    this.selectedList = {
      ...this.selectedList,
      value: [Number(this.input1), Number(input)]
    };
    this.onAdd.emit({ conditionName: this.conditionName, value: this.selectedList });
  }

  changeDateInput1(input) {
    if (!input) {
      this.messageService.warning('Ngày bắt đầu không hợp lệ');
      return;
    }
    const operator = this.conditionData[this.conditionName].operator;
    if (operator === 'between' && this.input1 && this.input2) {
      if (this.compareTime(this.input1, this.input2) > 0) {
        this.messageService.warning('Dữ liệu không hợp lệ');
        return;
      }
      this.selectedList = {
        ...this.selectedList,
        value: [moment(this.input1).startOf('day').format('x'), moment(this.input2).startOf('day').format('x')],
      };
      this.onAdd.emit({ conditionName: this.conditionName, value: this.selectedList });
    } else if (this.input1) {
      this.selectedList = {
        ...this.selectedList,
        value: [moment(this.input1).startOf('day').format('x')],
      };
      this.onAdd.emit({ conditionName: this.conditionName, value: this.selectedList });
    }
  }

  changeDateInput2(input) {
    if (!input) {
      this.messageService.warning('Ngày kết thúc không hợp lệ');
      return;
    }
    if (this.input1 && this.input2) {
      this.selectedList = {
        ...this.selectedList,
        value: [moment(this.input1).format('x'), moment(this.input2).format('x')]
      };
      this.onAdd.emit({ conditionName: this.conditionName, value: this.selectedList });
    }
  }

}
