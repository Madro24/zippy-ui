import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import * as AWS from 'aws-sdk/global';
import * as DynamoDB from 'aws-sdk/clients/dynamodb';
import {AvailTimeLog} from '../../shared/model/available-time-log.model';
import {IDDBcallback} from './iddbcallback';
import {ServiceItem} from '../../shared/model/service-item.model';

@Injectable()
export class AvailableTimeDDBserviceService {

  constructor() {
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
        // print all the movies
        console.log('AvailableTimeDDBserviceService: Query succeeded.');
        data.Items.forEach(function (logitem) {
          mapArray.push(logitem);
        });
      }
    }
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
      params: {TableName: environment.ddbAvailabilityTable}
    };
    if (environment.dynamodb_endpoint) {
      clientParams.endpoint = environment.dynamodb_endpoint;
    }
    const DDB = new DynamoDB(clientParams);

    // Write the item to the table
    const itemParams = {
      TableName: environment.ddbAvailabilityTable,
      Item: {
        'dateStr': {S: item.dateStr},
        'busyHours': {
          L: [
            {
              M: {
                'id': {S: item.busyHours[0].id},
                'items': {L: [{S: item.busyHours[0].items[0]}]}
              }
            }
          ]
        }
      }
    };
    DDB.putItem(itemParams,
      function (result) {
        console.log('AvailableTimeDDBserviceService: wrote entry: ' + JSON.stringify(result));
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
      params: {TableName: environment.ddbAvailabilityTable}
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


    DB.update(itemParams);
  }


}
