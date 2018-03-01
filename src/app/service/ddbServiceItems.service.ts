import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';

import {ServiceItem} from '../shared/model/service-item.model';
import * as AWS from 'aws-sdk/global';
import * as DynamoDB from 'aws-sdk/clients/dynamodb';

export interface ServiceItemCallback {
  callback(): void;

  callbackWithParam(result: any): void;
}

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
        // print all the movies
        console.log('ServiceItemDDBService: Query succeeded.');
        data.Items.forEach(function (logitem) {
          mapArray.push(logitem);
        });
      }
    }
  }

  getActiveItems(mapArray: Array<ServiceItem>, callback: ServiceItemCallback) {
    console.log('ServiceItemDDBService: reading from DDB with creds - ' + AWS.config.credentials);
    const params = {
      TableName: environment.ddbServiceItemsTable,
      FilterExpression: '#item_status = :itemStatus',
      ExpressionAttributeNames: {
        '#item_status': 'itemStatus',
      },
      ExpressionAttributeValues: {':itemStatus': 'ACTIVO'}
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
        callback.callback();
      }
    }
  }

  writeServiceItem(item: ServiceItem, callback: ServiceItemCallback) {
    try {
      console.log('ServiceItemDDBService: Adding new service item entry. Type:' + item.type);
      this.write(item, callback);
    } catch (exc) {
      console.log('ServiceItemDDBService: Couldn\'t write to DDB');
    }

  }

  write(item: ServiceItem, callback: ServiceItemCallback): void {
    console.log('ServiceItemDDBService: writing ' + item.type + ' entry');

    const clientParams: any = {
      params: {TableName: environment.ddbServiceItemsTable}
    };
    if (environment.dynamodb_endpoint) {
      clientParams.endpoint = environment.dynamodb_endpoint;
    }
    const DDB = new DynamoDB(clientParams);

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
        'recolectTime': {
          M:
            {
              'hour': {S: item.recolectTime.hour.toString()},
              'minute': {S: item.recolectTime.minute.toString()}
            }
        },
        'itemId': {S: item.itemId},
        'originLocation': {S: item.originLocation},
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
    DDB.putItem(itemParams,
      function (result) {
        console.log('ServiceItemDDBService: wrote entry: ' + JSON.stringify(result));
        callback.callback();
      }
    );
  }

}
