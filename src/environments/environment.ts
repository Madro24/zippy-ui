// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,

      region: 'us-east-1',
      identityPoolId: 'us-east-1:3c5216c1-61fa-4668-9116-ae146c56f8b9',
      userPoolId: 'us-east-1_16B1Hezj7',
      clientId: '645icno4kan2aquv5gv7bvmgiu',

      rekognitionBucket: '',
      albumName: 'usercontent',
      bucketRegion: 'us-east-1',

      ddbLoginTrailTable: 'DLoginTrail',
      ddbServiceItemsTable: 'DServiceItems',
      ddbAvailabilityTable: 'DAvailabilityTime',
      cognito_idp_endpoint: '',
      cognito_identity_endpoint: '',
      sts_endpoint: '',
      dynamodb_endpoint: '',
      //dynamodb_endpoint: 'http://192.168.99.100:8000',
      s3_endpoint: ''
};
