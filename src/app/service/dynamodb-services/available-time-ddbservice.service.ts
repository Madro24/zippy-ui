import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import * as AWS from 'aws-sdk/global';
import * as DynamoDB from 'aws-sdk/clients/dynamodb';
import { AvailTimeLog } from '../../shared/model/available-time-log.model';
import { ServiceItem } from '../../shared/model/service-item.model';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';

@Injectable()
export class AvailableTimeDDBserviceService {

  constructor() {
  }

  getAllItemsObs(): Observable<Array<AvailTimeLog>> {
    console.log('AvailableTimeDDBserviceService: reading from DDB with creds - ' + AWS.config.credentials);
    const params = {
      TableName: environment.ddbAvailabilityTable
    };
    const clientParams: any = {};
    if (environment.dynamodb_endpoint) {
      clientParams.endpoint = environment.dynamodb_endpoint;
    }

    return Observable.create(
      (observer: Observer<Array<AvailTimeLog>>) => {
        let mapArray = Array<AvailTimeLog>();
        const docClient = new DynamoDB.DocumentClient(clientParams);
        docClient.scan(params, function onQuery(err, data) {
          if (err) {
            console.error('AvailableTimeDDBserviceService: Unable to query the table. Error JSON:', JSON.stringify(err, null, 2));
            observer.error('Error JSON:' + JSON.stringify(err));
          } else {
            console.log('AvailableTimeDDBserviceService: Query succeeded.');
            data.Items.forEach(function(logitem: AvailTimeLog) {
              mapArray.push(logitem);
            });
            observer.next(mapArray);
          }
          observer.complete();
        });
      }
    );

    
  }

  getAllItems(mapArray: Array<AvailTimeLog>) {
    console.log('AvailableTimeDDBserviceService: reading from DDB with creds - ' + AWS.config.credentials);
    const params = {
      TableName: environment.ddbAvailabilityTable
    };
    const clientParams: any = {};
    if (environment.dynamodb_endpoint) {
      clientParams.endpoint = environment.dynamodb_endpoint;
    }
    const docClient = new DynamoDB.DocumentClient(clientParams);
    docClient.scan(params, onQuery);

    function onQuery(err, data) {
      if (err) {
        console.error('AvailableTimeDDBserviceService: Unable to query the table. Error JSON:', JSON.stringify(err, null, 2));
      } else {
        console.log('AvailableTimeDDBserviceService: Query succeeded.');
        data.Items.forEach(function(logitem) {
          mapArray.push(logitem);
        });
      }
    }
  }

  writeItemObs(item: AvailTimeLog): Observable<boolean> {
    console.log('AvailableTimeDDBserviceService: Adding new item entry. Date:' + item.dateStr);
    const clientParams: any = {
      params: { TableName: environment.ddbAvailabilityTable }
    };
    if (environment.dynamodb_endpoint) {
      clientParams.endpoint = environment.dynamodb_endpoint;
    }

    return Observable.create(
      (observer: Observer<boolean>) => {
        try {
          const DDB = new DynamoDB(clientParams);
          const itemParams = this.prepareWriteParam(item);
          DDB.putItem(itemParams,
            function(result) {
              console.log('AvailableTimeDDBserviceService: wrote entry: ' + JSON.stringify(result));
              
              if (result == null) {
                observer.next(true);
                observer.complete();
              } else {
                observer.error(JSON.stringify(result));
              }
            }
          );
        } catch (exc) {
          observer.error('AvailableTimeDDBserviceService: Couldn\'t write to DDB');
        }
      }
    );

  }

  prepareWriteParam(item: AvailTimeLog): DynamoDB.PutItemInput {
    let busyHoursParams;
    if (item.busyHours.length === 1) {
      busyHoursParams = {
        L: [
          {
            M: {
              'id': { S: item.busyHours[0].id },
              'items': { L: [{ S: item.busyHours[0].items[0] }] }
            }
          }
        ]
      };
    } else if (item.busyHours.length === 2) {
      busyHoursParams = {
        L: [
          {
            M: {
              'id': { S: item.busyHours[0].id },
              'items': { L: [{ S: item.busyHours[0].items[0] }] }
            }
          },
          {
            M: {
              'id': { S: item.busyHours[1].id },
              'items': { L: [{ S: item.busyHours[1].items[0] }] }
            }
          }
        ]
      };
    }

    // Write the item to the table
    const itemParams = {
      TableName: environment.ddbAvailabilityTable,
      Item: {
        'dateStr': { S: item.dateStr },
        'busyHours': busyHoursParams
      }
    };

    return itemParams;
  }

  writeItem(item: AvailTimeLog) {
    try {
      console.log('AvailableTimeDDBserviceService: Adding new item entry. Date:' + item.dateStr);
      this.write(item);
    } catch (exc) {
      console.log('AvailableTimeDDBserviceService: Couldn\'t write to DDB');
    }
  }

  write(item: AvailTimeLog): void {
    console.log('AvailableTimeDDBserviceService: writing ' + item.dateStr + ' entry');

    const clientParams: any = {
      params: { TableName: environment.ddbAvailabilityTable }
    };
    if (environment.dynamodb_endpoint) {
      clientParams.endpoint = environment.dynamodb_endpoint;
    }
    const DDB = new DynamoDB(clientParams);

    // Write the item to the table
    const itemParams = this.prepareWriteParam(item);
    DDB.putItem(itemParams,
      function(result) {
        console.log('AvailableTimeDDBserviceService: wrote entry: ' + JSON.stringify(result));
      }
    );
  }

  updateItemObs(item: AvailTimeLog): Observable<string> {
    console.log('AvailableTimeDDBserviceService: writing ' + item.dateStr + ' entry');

    const clientParams: any = {
      params: { TableName: environment.ddbAvailabilityTable }
    };
    if (environment.dynamodb_endpoint) {
      clientParams.endpoint = environment.dynamodb_endpoint;
    }

    return Observable.create(
      (observer: Observer<string>) => {
        try{
          const DB = new DynamoDB.DocumentClient(clientParams);
          // Write the item to the table
          const itemParams = {
            TableName: environment.ddbAvailabilityTable,
            Key: { dateStr: item.dateStr },
            ReturnValues: 'ALL_NEW',
            UpdateExpression: 'set #busyHours = :bshrs',
            ExpressionAttributeNames: {
              '#busyHours': 'busyHours'
            },
            ExpressionAttributeValues: {
              ':bshrs': item.busyHours,
            }
          };
    
          DB.update(itemParams, function(err, data) {
            if (err) {
              observer.error(JSON.stringify(err));
            } else {
              observer.next(JSON.stringify(data));
            } 
            observer.complete();
          });
        } catch (exc) {
          observer.error(JSON.stringify(exc));
        }
      }
    );
  }

  updateItem(item: AvailTimeLog) {
    try {
      console.log('AvailableTimeDDBserviceService: Update item entry. Date:' + item.dateStr);
      this.update(item);
    } catch (exc) {
      console.log('AvailableTimeDDBserviceService: Couldn\'t write to DDB');
    }
  }

  update(item: AvailTimeLog): void {
    console.log('AvailableTimeDDBserviceService: writing ' + item.dateStr + ' entry');

    const clientParams: any = {
      params: { TableName: environment.ddbAvailabilityTable }
    };
    if (environment.dynamodb_endpoint) {
      clientParams.endpoint = environment.dynamodb_endpoint;
    }

    const DB = new DynamoDB.DocumentClient(clientParams);
    // Write the item to the table
    const itemParams = {
      TableName: environment.ddbAvailabilityTable,
      Key: { dateStr: item.dateStr },
      ReturnValues: 'ALL_NEW',
      UpdateExpression: 'set #busyHours = :bshrs',
      ExpressionAttributeNames: {
        '#busyHours': 'busyHours'
      },
      ExpressionAttributeValues: {
        ':bshrs': item.busyHours,
      }
    };


    DB.update(itemParams, function(err, data) {
      if (err) console.log(err);
      else console.log(data);
    });
  }


}
