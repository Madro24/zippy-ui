import { Component, OnInit, ViewChild } from '@angular/core';
import { ServiceTypeEnum, ServiceStatusEnum, PayByEnum } from '../../shared/enum/global-enums';
import { ServiceItem } from '../../shared/model/service-item.model';
import { Destination } from '../../shared/model/destination.model';
import { DataMapService } from '../../service/data-map.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonUtilService } from '../../service/common-util.service';
import { NgForm } from '@angular/forms';
import { AvailTimeLog } from '../../shared/model/available-time-log.model';
import { ScheduledItemLog } from '../../shared/model/scheduled-items.model';
import { IDDBcallback } from '../../service/dynamodb-services/iddbcallback';
import { DataAvailabilityMapService, WorkdayHour } from '../../service/data-availability-map.service';
import { NgbDatepickerConfig, NgbDateStruct, NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { GMapAddress } from '../../gmap/gmap.component'

const now = new Date();
const defaultItemStatus = 'ACTIVO';
const defaultServType = 'EXPRESS';
const defaultPayBy = 'REMITENTE';
const defaultDay = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
const defaultTime = '';
const distanceFare = 8.90;
const timeFare = 2.25;
@Component({
  selector: 'app-senderform',
  templateUrl: './senderform.component.html',
  styleUrls: ['./senderform.component.css'],
  providers: [NgbDatepickerConfig] // add NgbDatepickerConfig to the component providers
})
export class SenderformComponent implements OnInit, IDDBcallback {
  @ViewChild('itemRegForm') itemRegForm: NgForm;
  serviceItem: ServiceItem;

  private itemId: string;
  isEditAction = false;
  wasSaveClicked = false;
  enableUrlMapField = false;
  gmapModalOpen: string;
  timeAvailArray: Array<WorkdayHour>;

  modalRef: NgbModalRef;

  constructor(private router: Router,
    private actRoute: ActivatedRoute,
    private dataMapService: DataMapService,
    private dataAvailTimeService: DataAvailabilityMapService,
    private commonUtils: CommonUtilService,
    private config: NgbDatepickerConfig,
    private modalService: NgbModal) {

    // customize default values of datepickers used by this component tree
    config.minDate = defaultDay;
    config.maxDate = { year: 2020, month: 12, day: 31 };

    // days that don't belong to current month are not visible
    config.outsideDays = 'hidden';

    // weekends are disabled
    config.markDisabled = (date: NgbDateStruct) => {
      const d = new Date(date.year, date.month - 1, date.day);
      return d.getDay() === 0 || d.getDay() === 6;
    };
  }

  ngOnInit() {
    this.itemId = this.actRoute.snapshot.params['itemId'];
    if (this.itemId != null) {
      this.dataMapService.getServiceItemById(this.itemId, <IDDBcallback>{
        callback: () => {
          this.serviceItem = this.dataMapService.serviceItemArray.find(x => x.itemId === this.itemId);
          console.log('Item ID:' + this.serviceItem.itemId);
        },
        callbackWithParam: (result: any) => {
        }
      })
        .subscribe(
        item => this.serviceItem = item,
        error => {
          console.log('Error getting service items array. ' + error);
          this.router.navigate(['/admin-home']);
        }
        );
      console.log('this.serviceItem:' + this.serviceItem.itemId);
      this.isEditAction = true;
      this.timeAvailArray = this.dataAvailTimeService.getAvailabilityByDate(this.serviceItem.recolectDate);
    } else {
      this.enableUrlMapField = false;
      this.isEditAction = false;
      this.newServiceItem();
      this.timeAvailArray = this.dataAvailTimeService.getAvailabilityByDate(defaultDay);
    }


  }

  newServiceItem() {
    this.serviceItem = new ServiceItem();
    this.serviceItem.date = now.toISOString();
    this.serviceItem.recolectDate = defaultDay;
    this.serviceItem.recolectTimeIndex = defaultTime;
    this.serviceItem.itemStatus = defaultItemStatus;
    this.serviceItem.payBy = defaultPayBy;

    const destinationDefault = new Destination();
    destinationDefault.sequence = 1;
    this.serviceItem.destinations.push(destinationDefault);
  }

  getServiceTypes(): Array<string> {
    const keys = Object.keys(ServiceTypeEnum);
    return keys.slice(keys.length / 2);
  }

  getServiceStatus(): Array<string> {
    const keys = Object.keys(ServiceStatusEnum);
    return keys.slice(keys.length / 2);
  }

  getPayByList(): Array<string> {
    const keys = Object.keys(PayByEnum);
    return keys.slice(keys.length / 2);
  }

  callback() {
    this.wasSaveClicked = false;

    if (this.isEditAction) {
      this.serviceToForm();

    } else {
      this.router.navigate(['/serviceItemList']);
    }
  }

  callbackWithParam(result: any) {
  }

  setServiceItemToUpperCase(item: ServiceItem) {
    item.sender.name = item.sender.name.toUpperCase();
    item.originLocation = item.originLocation.toUpperCase();
    item.destinations[0].receiver.name = item.destinations[0].receiver.name.toUpperCase();
    item.destinations[0].location = item.destinations[0].location.toUpperCase();
    item.destinations[0].packageContent = item.destinations[0].packageContent.toUpperCase();
    item.destinations[0].message = item.destinations[0].message.toUpperCase();
    item.destinations[0].instructions = item.destinations[0].instructions.toUpperCase();
  }

  printLabel() {
    if (this.itemId != null) {
      this.router.navigate(['/service-item-label/', this.itemId]);
    }
  }

  enableUrlMap() {
    this.enableUrlMapField = true;
  }

  getSearchMapURI(location: string): string {
    return encodeURI('https://www.google.com/maps/search/' + location);
  }

  onSubmit() {
    console.log(this.itemRegForm);
    this.wasSaveClicked = true;

    this.mapFormToObj();
    const formattedDate =
      this.serviceItem.recolectDate.year
      + this.commonUtils.twoDigitsFormat(this.serviceItem.recolectDate.month)
      + this.commonUtils.twoDigitsFormat(this.serviceItem.recolectDate.day);
    if (!this.isEditAction) {

      const formattedTime =
        this.commonUtils.twoDigitsFormat(+this.serviceItem.recolectTimeIndex);

      this.serviceItem.itemId = formattedDate + formattedTime + this.serviceItem.type.charAt(0);
    }
    this.serviceItem.usedFares.distanceFare = distanceFare.toString();
    this.serviceItem.usedFares.timeFare = timeFare.toString();
    this.serviceItem.totalCost = this.getTotalCost(this.serviceItem.destinations[0].distance);

    this.setServiceItemToUpperCase(this.serviceItem);


    const availTimeLog = this.dataAvailTimeService.getByDate(this.serviceItem.recolectDate);


    console.log(this.serviceItem);

    if (this.isEditAction) {
      this.dataMapService.updateItem(this.serviceItem, this.itemId, this);
    } else {
      // setting new AvailTimeLog
      const schedLogItem = this.dataAvailTimeService.createScheduledLogItem(availTimeLog, this.serviceItem);

      this.dataMapService.pushItem(this.serviceItem, this);

      if (availTimeLog == null) {
        this.dataAvailTimeService.addAvailTimeLog(schedLogItem);
      } else {
        this.dataAvailTimeService.updateAvailTimeLog(schedLogItem);
      }

    }

    this.itemRegForm.reset();

  }

  mapFormToObj() {
    if (this.itemRegForm.value.itemStatus != null) {
      this.serviceItem.itemStatus = this.itemRegForm.value.itemStatus;
    } else {
      this.serviceItem.itemStatus = defaultItemStatus;
    }
    this.serviceItem.type = this.itemRegForm.value.itemType;
    this.serviceItem.recolectDate = this.itemRegForm.value.dp;
    this.serviceItem.recolectTimeIndex = this.itemRegForm.value.serviceTime;
    this.serviceItem.recolectTimeHour = this.dataAvailTimeService.getWorkDayTimeById(+this.serviceItem.recolectTimeIndex);
    this.serviceItem.sender.name = this.itemRegForm.value.senderName;
    this.serviceItem.sender.phone = this.itemRegForm.value.senderPhone;
    this.serviceItem.originLocation = this.itemRegForm.value.originLocation;
    this.serviceItem.payBy = this.itemRegForm.value.payBy;

    this.serviceItem.destinations[0].location = this.itemRegForm.value.destLocation;
    this.serviceItem.destinations[0].urlMap = this.itemRegForm.value.destUrlMap;
    this.serviceItem.destinations[0].receiver.name = this.itemRegForm.value.destRecName;
    this.serviceItem.destinations[0].packageContent = this.itemRegForm.value.destPkgContent;
    this.serviceItem.destinations[0].message = this.itemRegForm.value.destMsg;
    this.serviceItem.destinations[0].instructions = this.itemRegForm.value.destInst;
    this.serviceItem.destinations[0].distance = this.itemRegForm.value.destDistance;
  }

  serviceToForm() {
    this.itemRegForm.setValue( {
      itemStatus : this.serviceItem.itemStatus,
      itemType : this.serviceItem.type,
      dp : this.serviceItem.recolectDate,
      serviceTime : this.serviceItem.recolectTimeIndex,
      senderName : this.serviceItem.sender.name,
      senderPhone : this.serviceItem.sender.phone,
      originLocation : this.serviceItem.originLocation,
      payBy : this.serviceItem.payBy,

      destLocation : this.serviceItem.destinations[0].location,
      destUrlMap : this.serviceItem.destinations[0].urlMap,
      destRecName : this.serviceItem.destinations[0].receiver.name,
      destPkgContent : this.serviceItem.destinations[0].packageContent,
      destMsg : this.serviceItem.destinations[0].message,
      destInst : this.serviceItem.destinations[0].instructions,
      destDistance : this.serviceItem.destinations[0].distance
  });
  }

  getTotalCost(value) {
    return (+value * distanceFare).toFixed(2);
  }

  changeDatePicker(dateSelected: any) {
    if (dateSelected != null) {
      this.timeAvailArray = this.dataAvailTimeService.getAvailabilityByDate(dateSelected);
      this.itemRegForm.form.patchValue({
        serviceTime: defaultTime
      });
    }
  }

  closeDetails() {
    this.itemRegForm.reset();
    this.router.navigate(['/serviceItemList']);
  }

  gmapAddrSelected(address: GMapAddress) {
    let changedAddr;
    if (this.gmapModalOpen === 'Origin') {
      changedAddr = {originLocation: address.formattedAddr};
    } else {
      changedAddr = {destLocation: address.formattedAddr};
    }

    this.itemRegForm.form.patchValue(
      changedAddr
    ); 
    this.modalRef.close();
  }
  

  open(content, modalMap: string) {
    this.gmapModalOpen = modalMap;
    this.modalRef = this.modalService.open(content, { size: 'lg' });
  }

}
