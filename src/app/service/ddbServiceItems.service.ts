import { Injectable } from "@angular/core";
import { CognitoUtil } from "./cognito.service";
import { environment } from "../../environments/environment";

import { ServiceItem } from "../shared/model/service-item.model";
import * as AWS from "aws-sdk/global";
import * as DynamoDB from "aws-sdk/clients/dynamodb";

/**
 * Created by Vladimir Budilov
 */

@Injectable()
export class ServiceItemDDBService {

  constructor(public cognitoUtil: CognitoUtil) {
    console.log("DynamoDBService: constructor");
  }

  getAWS() {
    return AWS;
  }

  getServiceItems(mapArray: Array<ServiceItem>, itemId: string) {
    console.log("ServiceItemDDBService: reading from DDB with creds - " + AWS.config.credentials);
    var params = {
      TableName: environment.ddbServiceItemsTable,
      KeyConditionExpression: "itemId = :itemId",
      ExpressionAttributeValues: {
        ":itemId": itemId
      }
    };

    var clientParams: any = {};
    if (environment.dynamodb_endpoint) {
      clientParams.endpoint = environment.dynamodb_endpoint;
    }
    var docClient = new DynamoDB.DocumentClient(clientParams);
    docClient.query(params, onQuery);

    function onQuery(err, data) {
      if (err) {
        console.error("ServiceItemDDBService: Unable to query the table. Error JSON:", JSON.stringify(err, null, 2));
      } else {
        // print all the movies
        console.log("ServiceItemDDBService: Query succeeded.");
        data.Items.forEach(function(logitem) {
          mapArray.push(logitem);
        });
      }
    }
  }

  writeServiceItem(item: ServiceItem) {
    try {
      let date = new Date().toString();
      console.log("ServiceItemDDBService: Adding new service item entry. Type:" + item.type);
      this.write(item);
    } catch (exc) {
      console.log("ServiceItemDDBService: Couldn't write to DDB");
    }

  }

  write(item: ServiceItem): void {
    console.log("ServiceItemDDBService: writing " + item.type + " entry");

    let clientParams: any = {
      params: { TableName: environment.ddbServiceItemsTable }
    };
    if (environment.dynamodb_endpoint) {
      clientParams.endpoint = environment.dynamodb_endpoint;
    }
    var DDB = new DynamoDB(clientParams);

    // Write the item to the table
    var itemParams =
      {
        TableName: environment.ddbServiceItemsTable,
        Item: {
          "date": { S: item.date },
          "destinations": {
            L: [
              {
                M:
                {
                  "distance": { N: item.destinations[0].distance },
                  "instructions": { S: item.destinations[0].instructions },
                  "location": { S: item.destinations[0].location },
                  "message": { S: item.destinations[0].message },
                  "packageContent": { S: item.destinations[0].packageContent },
                  "receiver": {
                    M: {
                      "name": { S: item.destinations[0].receiver.name }
                    }
                  },
                  "sequence": { N: item.destinations[0].sequence }
                }
              }
            ]
          },
          "recolectTime": { S: item.recolectTime },
          "itemId": { S: item.id },
          "originLocation": { S: item.originLocation },
          "payBy": { S: item.payBy },
          "sender": {
            M: {
              "name": { S: item.sender.name },
              "phone": { S: item.sender.phone }
            }
          },
          "status": { S: item.status },
          "totalCost": { N: item.totalCost },
          "type": { S: item.type },
          "usedFares": {
            M: {
              "distance": { N: item.usedFares.distanceFare },
              "time": { N: item.usedFares.timeFare }
            }
          }
        }
      };
    DDB.putItem(itemParams, function(result) {
      console.log("ServiceItemDDBService: wrote entry: " + JSON.stringify(result));
    });
  }

}
