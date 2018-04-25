import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';

import {ServiceItem} from '../../shared/model/service-item.model';
import * as AWS from 'aws-sdk/global';
import * as DynamoDB from 'aws-sdk/clients/dynamodb';
import {IDDBcallback} from './iddbcallback';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';

@Injectable()
export class ServiceItemDDBService {

  constructor() {
    console.log('DynamoDBService: constructor');
  }

  getAWS() {
    return AWS;
  }

  getServiceItems(mapArray: Array<ServiceItem>, itemId: string) {
    console.log('ServiceItemDDBService: reading from DDB with creds - ' + AWS.config.credentials);
    const params = {
      TableName: environment.ddbServiceItemsTable,
      KeyConditionExpression: 'itemId = :itemId',
      ExpressionAttributeValues: {
        ':itemId': itemId
      }
    };

    const clientParams: any = {};
    if (environment.dynamodb_endpoint) {
      clientParams.endpoint = environment.dynamodb_endpoint;
    }
    const docClient = new DynamoDB.DocumentClient(clientParams);
    docClient.query(params, onQuery);

    function onQuery(err, data) {
      if (err) {
        console.error('ServiceItemDDBService: Unable to query the table. Error JSON:', JSON.stringify(err, null, 2));
      } else {
        console.log('ServiceItemDDBService: Query succeeded.');
        data.Items.forEach(function (logitem) {
          mapArray.push(logitem);
        });
      }
    }
  }

  getActiveItemsObs(): Observable<Array<ServiceItem>> {
    console.log('ServiceItemDDBService: reading from DDB with creds - ' + AWS.config.credentials);
    const params = {
      TableName: environment.ddbServiceItemsTable,
    };

    const clientParams: any = {};
    if (environment.dynamodb_endpoint) {
      clientParams.endpoint = environment.dynamodb_endpoint;
    }
    

    return Observable.create( (observer: Observer<Array<ServiceItem>>) => {
      let mapArray = Array<ServiceItem>();
      const docClient = new DynamoDB.DocumentClient(clientParams);
      docClient.scan(params, function onQuery(err, data) {
        if (err) {
          console.error('ServiceItemDDBService: Unable to query the table. Error JSON:', JSON.stringify(err, null, 2));
          observer.error('ServiceItemDDBService: Unable to query the table. Error JSON:' + JSON.stringify(err, null, 2));
        } else {
          console.log('ServiceItemDDBService: Query succeeded.');
          data.Items.forEach(function (logitem: ServiceItem) {
            mapArray.push(logitem);
          });
          mapArray.sort((item1, item2) => ServiceItem.compare(item1, item2));
          observer.next(mapArray);
          observer.complete();
        }
      });
    });
  }

  getActiveItems(mapArray: Array<ServiceItem>, callback: IDDBcallback) {
    console.log('ServiceItemDDBService: reading from DDB with creds - ' + AWS.config.credentials);
    const params = {
      TableName: environment.ddbServiceItemsTable,
      //FilterExpression: '#item_status = :itemStatus',
      //ExpressionAttributeNames: {
       // '#item_status': 'itemStatus',
      //},
      //ExpressionAttributeValues: {':itemStatus': ['ACTIVO', 'COMPLETADO']}
    };

    const clientParams: any = {};
    if (environment.dynamodb_endpoint) {
      clientParams.endpoint = environment.dynamodb_endpoint;
    }
    const docClient = new DynamoDB.DocumentClient(clientParams);
    docClient.scan(params, onQuery);

    function onQuery(err, data) {
      if (err) {
        console.error('ServiceItemDDBService: Unable to query the table. Error JSON:', JSON.stringify(err, null, 2));
      } else {
        // print all the movies
        console.log('ServiceItemDDBService: Query succeeded.');
        data.Items.forEach(function (logitem) {
          mapArray.push(logitem);
        });
        mapArray.sort((item1, item2) => ServiceItem.compare(item1, item2));
        callback.callback();
      }
    }
  }

  writeItemObs(item: ServiceItem): Observable<boolean> {
    console.log('ServiceItemDDBService: Adding new service item entry. Type:' + item.type);
    console.log('ServiceItemDDBService: writing ' + item.type + ' entry');

    const clientParams: any = {
      params: {TableName: environment.ddbServiceItemsTable}
    };
    if (environment.dynamodb_endpoint) {
      clientParams.endpoint = environment.dynamodb_endpoint;
    }
    

    return Observable.create( 
      (observer: Observer<boolean>) => {
        try{
          const DDB = new DynamoDB(clientParams);
          // Write the item to the table
          const itemParams = this.prepareWriteParam(item);
          DDB.putItem(itemParams,
            function (result) {
              console.log('ServiceItemDDBService: wrote entry error: ' + JSON.stringify(result));
              if (result == null) {
                observer.next(true);
                observer.complete();
              } else {
                observer.error(JSON.stringify(result));
              }
            }
          );
        } catch (exc) {
          observer.error('ServiceItemDDBService: Couldn\'t write to DDB');
        }
    });
  }

  prepareWriteParam(item: ServiceItem): DynamoDB.PutItemInput {
    // Write the item to the table
    const itemParams = {
      TableName: environment.ddbServiceItemsTable,
      Item: {
        'date': {S: item.date},
        'destinations': {
          L: [
            {
              M:
                {
                  'distance': {N: item.destinations[0].distance.toString()},
                  'instructions': {S: item.destinations[0].instructions},
                  'urlMap': {S: item.destinations[0].urlMap},
                  'location': {S: item.destinations[0].location},
                  'locationGmap': {
                    M: {
                      'formattedAddr': {S: item.destinations[0].locationGmap.formattedAddr},
                      'lat': {N: item.destinations[0].locationGmap.lat.toString()},
                      'lon': {N: item.destinations[0].locationGmap.lon.toString()},
                    }
                  },
                  'message': {S: item.destinations[0].message},
                  'packageContent': {S: item.destinations[0].packageContent},
                  'receiver': {
                    M: {
                      'name': {S: item.destinations[0].receiver.name}
                    }
                  },
                  'sequence': {N: item.destinations[0].sequence.toString()}
                }
            }
          ]
        },
        'recolectDate': {
          M:
            {
              'year': {N: item.recolectDate.year.toString()},
              'month': {N: item.recolectDate.month.toString()},
              'day': {N: item.recolectDate.day.toString()}
            }
        },
        'recolectTimeIndex': { S: item.recolectTimeIndex },
        'recolectTimeHour': { S: item.recolectTimeHour },
        'itemId': {S: item.itemId},
        'originLocation': {S: item.originLocation},
        'originLocationGmap': {
          M: {
            'formattedAddr': {S: item.originLocationGmap.formattedAddr},
            'lat': {N: item.originLocationGmap.lat.toString()},
            'lon': {N: item.originLocationGmap.lon.toString()},
          }
        },
        'payBy': {S: item.payBy},
        'sender': {
          M: {
            'name': {S: item.sender.name},
            'phone': {S: item.sender.phone}
          }
        },
        'itemStatus': {S: item.itemStatus},
        'totalCost': {N: item.totalCost},
        'type': {S: item.type},
        'usedFares': {
          M: {
            'distance': {N: item.usedFares.distanceFare},
            'time': {N: item.usedFares.timeFare}
          }
        }
      }
    };
    return itemParams;
  }

  writeServiceItem(item: ServiceItem, callback: IDDBcallback) {
    try {
      console.log('ServiceItemDDBService: Adding new service item entry. Type:' + item.type);
      this.write(item, callback);
    } catch (exc) {
      console.log('ServiceItemDDBService: Couldn\'t write to DDB');
    }

  }

  write(item: ServiceItem, callback: IDDBcallback): void {
    console.log('ServiceItemDDBService: writing ' + item.type + ' entry');

    const clientParams: any = {
      params: {TableName: environment.ddbServiceItemsTable}
    };
    if (environment.dynamodb_endpoint) {
      clientParams.endpoint = environment.dynamodb_endpoint;
    }
    const DDB = new DynamoDB(clientParams);

    // Write the item to the table
    const itemParams = this.prepareWriteParam(item);
    DDB.putItem(itemParams,
      function (result) {
        console.log('ServiceItemDDBService: wrote entry: ' + JSON.stringify(result));
        callback.callback();
      }
    );
  }

}
