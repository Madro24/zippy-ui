// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,

      region: 'us-east-1',
      identityPoolId: 'us-east-1:4073d698-150a-48ee-ab78-fc4d79b65901',
      userPoolId: 'us-east-1_oX7QuKhqM',
      clientId: '696j7pu1ulhtqgu7nf91ea262c',

      rekognitionBucket: '',
      albumName: 'usercontent',
      bucketRegion: 'us-east-1',

      ddbLoginTrailTable: 'LoginTrail',
      ddbServiceItemsTable: 'ServiceItems',
      ddbAvailabilityTable: 'AvailabilityTime',
      cognito_idp_endpoint: '',
      cognito_identity_endpoint: '',
      sts_endpoint: '',
      dynamodb_endpoint: '',
      //dynamodb_endpoint: 'http://192.168.99.100:8000',
      s3_endpoint: ''
};
