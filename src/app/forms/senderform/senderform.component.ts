import {Component, OnInit, ViewChild, AfterContentInit} from '@angular/core';
import {ServiceTypeEnum, ServiceStatusEnum, PayByEnum} from '../../shared/enum/global-enums';
import {ServiceItem} from '../../shared/model/service-item.model';
import {Destination} from '../../shared/model/destination.model';
import {DataMapService} from '../../service/data-map.service';
import {Router, ActivatedRoute} from '@angular/router';
import {CommonUtilService} from '../../service/common-util.service';
import {NgForm, FormGroup, FormControl, Validators} from '@angular/forms';
import {DataAvailabilityMapService, WorkdayHour} from '../../service/data-availability-map.service';
import {NgbDatepickerConfig, NgbDateStruct, NgbModal, NgbModalRef, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {GMapAddress} from '../../shared/model/gmap-address.model';
import {GmapService} from '../../service/gmap.service';
import Distance = google.maps.Distance;

const now = new Date();
const defaultItemStatus = 'ACTIVO';
const defaultServType = 'EXPRESS';
const defaultPayBy = 'REMITENTE';
const defaultDay = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
const defaultTime = '';
const distanceFare = 8.90;
const timeFare = 2.25;
const googleMapsUrl = 'https://www.google.com/maps/place/';

@Component({
  selector: 'app-senderform',
  templateUrl: './senderform.component.html',
  styleUrls: ['./senderform.component.css'],
  providers: [NgbDatepickerConfig] // add NgbDatepickerConfig to the component providers
})
export class SenderformComponent implements OnInit {
  //@ViewChild('itemRegForm') itemRegForm: NgForm;
  itemRegForm: FormGroup;
  serviceItem: ServiceItem;

  private itemId: string;
  isEditAction = false;
  wasSaveClicked = false;
  enableUrlMapField = false;
  gmapModalOpen: string;
  timeAvailArray: Array<WorkdayHour>;
  originAddrGmap: GMapAddress;
  destinationAddrGmap: GMapAddress;
  displayError: boolean = false;

  modalRef: NgbModalRef;

  constructor(private router: Router,
              private actRoute: ActivatedRoute,
              private dataMapService: DataMapService,
              private dataAvailTimeService: DataAvailabilityMapService,
              private commonUtils: CommonUtilService,
              private config: NgbDatepickerConfig,
              private modalService: NgbModal,
              private gmapService: GmapService) {

    // customize default values of datepickers used by this component tree
    config.minDate = defaultDay;
    config.maxDate = {year: 2020, month: 12, day: 31};

    // days that don't belong to current month are not visible
    config.outsideDays = 'hidden';

    // weekends are disabled
    config.markDisabled = (date: NgbDateStruct) => {
      const d = new Date(date.year, date.month - 1, date.day);
      return d.getDay() === 0 || d.getDay() === 6;
    };
  }

  ngOnInit() {
    this.itemRegForm = new FormGroup({
      'itemStatus': new FormControl(defaultItemStatus, Validators.required),
      'itemType': new FormControl(defaultServType, Validators.required),
      'dp': new FormControl(defaultDay, Validators.required),
      'serviceTime': new FormControl(null, Validators.required),
      'senderName': new FormControl(null, Validators.required),
      'senderPhone': new FormControl(null, Validators.required),
      'originLocation': new FormControl(null, Validators.required),
      'payBy': new FormControl(defaultPayBy, Validators.required),
      'destLocation': new FormControl(null, Validators.required),
      'destRecName': new FormControl(null, Validators.required),
      'destPkgContent': new FormControl(null, Validators.required),
      'destMsg': new FormControl(null, Validators.required),
      'destInst': new FormControl(null, Validators.required),
      'destDistance': new FormControl(0, Validators.required)
    });
   

    this.itemId = this.actRoute.snapshot.params['itemId'];
    if (this.itemId == null) {
      this.enableUrlMapField = false;
      this.isEditAction = false;
      this.newServiceItem();
      this.timeAvailArray = this.dataAvailTimeService.getAvailabilityByDate(defaultDay);
    } else {
      this.dataMapService.getServiceItemById(this.itemId).subscribe(
        item => {
          console.log('Item found :' + JSON.stringify(item));
          this.serviceItem = item;
          this.originAddrGmap = this.serviceItem.originLocationGmap;
          this.destinationAddrGmap = this.serviceItem.destinations[0].locationGmap;
          
          this.timeAvailArray = this.dataAvailTimeService.getAvailabilityByDate(this.serviceItem.recolectDate);
          this.isEditAction = true;
          this.serviceToForm();
        },
        error => {
          console.log('Error getting service items array. ' + error);
          this.router.navigate(['/admin-home']);
        }
      ); 
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
      this.dataMapService.updateItem(this.serviceItem, this.itemId).subscribe(
        (data) => {
          console.log('Item updated:' + JSON.stringify(data));
          this.dataMapService.itemUpdateSuccess(this.serviceItem);
          this.itemRegForm.markAsPristine();
        }, 
        (error) => {
          console.log('Error updating:' + error);
          this.displayError = true;
        }
      );
    } else {
      // setting new AvailTimeLog
      const schedLogItem = this.dataAvailTimeService.createScheduledLogItem(availTimeLog, this.serviceItem);

      this.dataMapService.pushItem(this.serviceItem).subscribe(
        (data) => {
          console.log('Item inserted:' + JSON.stringify(data));
        
          if (availTimeLog == null) {
            this.dataAvailTimeService.addAvailTimeLog(schedLogItem).subscribe(
              (data) => {
                console.log('TimeLog inserted:' + JSON.stringify(data));
                this.dataMapService.itemInsertSuccess(this.serviceItem);
                this.itemRegForm.markAsPristine();
                this.router.navigate(['/serviceItem/', this.serviceItem.itemId]);
              },
              (error) => {
                console.log('Error inserting timeLog:' + error);
                this.displayError = true;
              }
            );
          } else {
            this.dataAvailTimeService.updateAvailTimeLog(schedLogItem).subscribe(
              (data) => {
                console.log('TimeLog updated:' + JSON.stringify(data));
                this.dataMapService.itemInsertSuccess(this.serviceItem);
                this.itemRegForm.markAsPristine();
                this.router.navigate(['/serviceItem/', this.serviceItem.itemId]);
              },
              (error) => {
                console.log('Error updating timeLog:' + error);
                this.displayError = true;
              }
            );
          }
    
        }, 
        (error) => {
          console.log('Error interting:' + error);
          this.displayError = true;
        }
      );
    }

  }

  mapFormToObj() {
    if (this.itemRegForm !== null && this.itemRegForm.value.itemStatus != null) {
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
    this.serviceItem.originLocation = this.originAddrGmap.formattedAddr;
    this.serviceItem.originLocationGmap = this.originAddrGmap;
    this.serviceItem.payBy = this.itemRegForm.value.payBy;

    this.serviceItem.destinations[0].location = this.destinationAddrGmap.formattedAddr;
    this.serviceItem.destinations[0].locationGmap = this.destinationAddrGmap;
    const destLatLon = this.destinationAddrGmap.lat + ',' + this.destinationAddrGmap.lon;
    this.serviceItem.destinations[0].urlMap = googleMapsUrl + destLatLon + '/@' + destLatLon + ',19z';
    this.serviceItem.destinations[0].receiver.name = this.itemRegForm.value.destRecName;
    this.serviceItem.destinations[0].packageContent = this.itemRegForm.value.destPkgContent;
    this.serviceItem.destinations[0].message = this.itemRegForm.value.destMsg;
    this.serviceItem.destinations[0].instructions = this.itemRegForm.value.destInst;
    this.serviceItem.destinations[0].distance = this.itemRegForm.value.destDistance;
  }

  serviceToForm() {
    this.itemRegForm.setValue({
      itemStatus: this.serviceItem.itemStatus,
      itemType: this.serviceItem.type,
      dp: this.serviceItem.recolectDate,
      serviceTime: this.serviceItem.recolectTimeIndex,
      senderName: this.serviceItem.sender.name,
      senderPhone: this.serviceItem.sender.phone,
      originLocation: this.serviceItem.originLocation,
      payBy: this.serviceItem.payBy,
      destLocation: this.serviceItem.destinations[0].location,
      destRecName: this.serviceItem.destinations[0].receiver.name,
      destPkgContent: this.serviceItem.destinations[0].packageContent,
      destMsg: this.serviceItem.destinations[0].message,
      destInst: this.serviceItem.destinations[0].instructions,
      destDistance: this.serviceItem.destinations[0].distance
    });
  }

  getTotalCost(value) {
    const distance = +this.itemRegForm.get('destDistance').value;
    const totalCost = distance * distanceFare;
    return totalCost.toFixed(2);
  }

  changeDatePicker(dateSelected: any) {
    if (dateSelected != null) {
      this.timeAvailArray = this.dataAvailTimeService.getAvailabilityByDate(dateSelected);
      this.itemRegForm.patchValue({
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
      this.originAddrGmap = address;
      changedAddr = {originLocation: address.formattedAddr};
    } else {
      this.destinationAddrGmap = address;
      changedAddr = {destLocation: address.formattedAddr};
    }

    this.itemRegForm.patchValue(
      changedAddr
    );
    this.modalRef.close();

    if (this.originAddrGmap !== null && this.destinationAddrGmap != null) {
      this.calculateDistance();
    }
    this.itemRegForm.markAsDirty();
  }


  open(content, modalMap: string) {
    this.gmapModalOpen = modalMap;
    this.modalRef = this.modalService.open(content, {size: 'lg'});
  }

  calculateDistance() {
    this.gmapService.calculateDistanceObs(this.originAddrGmap, this.destinationAddrGmap).subscribe(
      (data: Distance) => {
        const distKm = data.value / 1000;
        this.itemRegForm.patchValue({
          destDistance: '' + distKm.toString()
        });
      },
      (error: string) => {
        window.alert(error);
      },
      () => {
        console.log('calculate distance completed!');
      }
    );
  }

}
