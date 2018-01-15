// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,

      region: 'us-east-1',
      userPoolId: 'us-east-1_oX7QuKhqM',
      clientId: '696j7pu1ulhtqgu7nf91ea262c',

      identityPoolId: '',


      rekognitionBucket: '',
      albumName: "usercontent",
      bucketRegion: 'us-east-1',

      ddbTableName: 'LoginTrail',

      cognito_idp_endpoint: '',
      cognito_identity_endpoint: '',
      sts_endpoint: '',
      dynamodb_endpoint: '',
      s3_endpoint: ''
};
