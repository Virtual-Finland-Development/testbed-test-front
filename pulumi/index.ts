import * as pulumi from '@pulumi/pulumi';

// components
import { Bucket } from '../pulumi/src/Bucket';
import { CloudFront } from '../pulumi/src/CloudFront';

// Create cloud front origin access identity, both bucketSetup and cloudFrontSetup requires this.
// Encapsulated static method in CloudFront component class
const originAccessIdentity = CloudFront.createOriginAccessIdentity();

// S3 bucket configuration
const bucketSetup = new Bucket('front-bucket-setup', originAccessIdentity);

// Cloud front configuration
const cloudFrontSetup = new CloudFront(
  'front-cloudfront-setup',
  bucketSetup.bucket,
  originAccessIdentity
);

export const bucketName = bucketSetup.bucket.id;
export const bucketEndpoint = pulumi.interpolate`http://${bucketSetup.bucket.websiteEndpoint}`;
