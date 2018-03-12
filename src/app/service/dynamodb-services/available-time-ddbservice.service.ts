import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import * as AWS from 'aws-sdk/global';
import * as DynamoDB from 'aws-sdk/clients/dynamodb';
import {AvailTimeLog} from '../../shared/model/available-time-log.model';

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
}
