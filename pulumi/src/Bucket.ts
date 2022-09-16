import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';
import { ResourceOptions } from '@pulumi/pulumi';
import * as fs from 'fs';
import * as path from 'path';
import * as mime from 'mime';

// utils
import { BUCKET_NAME } from './constants';

// utility function to create policy for bucket
function publicReadPolicyForBucket(
  bucketName: string,
  originAccessArn: string
): string {
  return JSON.stringify({
    Version: '2012-10-17',
    Statement: [
      {
        Sid: 'PublicReadGetObject',
        Effect: 'Allow',
        // Principal: '*',
        Principal: {
          AWS: [`${originAccessArn}`],
        },
        Action: 's3:GetObject',
        Resource: `arn:aws:s3:::${bucketName}/*`,
      },
    ],
  });
}

// utility function to loop through all build files and upload them to the bucket
function uploadToS3(
  buildDir: string,
  bucket: aws.s3.Bucket,
  subDir: string = ''
) {
  for (let item of fs.readdirSync(`${buildDir}${subDir}`)) {
    const filePath = path.join(buildDir, subDir, item);

    if (fs.statSync(filePath).isDirectory()) {
      uploadToS3(buildDir, bucket, `${subDir}/${item}`);
    } else {
      const file = subDir.length > 0 ? `${subDir.slice(1)}/${item}` : item;
      const object = new aws.s3.BucketObject(file, {
        bucket: bucket,
        source: new pulumi.asset.FileAsset(filePath),
        contentType: mime.getType(filePath) || undefined,
        // acl: 'public-read',
      });
    }
  }
}

export class Bucket extends pulumi.ComponentResource {
  public bucket;
  public bucketPolicy;

  constructor(
    name: string,
    originAccessIdentity: aws.cloudfront.OriginAccessIdentity,
    opts?: ResourceOptions
  ) {
    super('testbed:front:Bucket', name, {}, opts);

    // Provision AWS S3 bucket.
    const s3Bucket = new aws.s3.Bucket(
      BUCKET_NAME,
      {
        website: {
          indexDocument: 'index.html',
          errorDocument: 'index.html',
        },
      },
      {
        parent: this,
      }
    );

    // Create bucket policy for the bucket.
    const bucketPolicy = new aws.s3.BucketPolicy(
      `${BUCKET_NAME}-policy`,
      {
        bucket: s3Bucket.bucket,
        policy: pulumi
          .all([s3Bucket.bucket, originAccessIdentity.iamArn])
          .apply(([bucketName, originAccessArn]) =>
            publicReadPolicyForBucket(bucketName, originAccessArn)
          ),
      },
      {
        parent: this,
      }
    );

    // Create bucket objects of all built asssets and upload to bucket
    process.chdir('../');
    const buildDir = `${process.cwd()}/build`;
    uploadToS3(buildDir, s3Bucket);

    this.bucket = s3Bucket;
    this.bucketPolicy = bucketPolicy;

    this.registerOutputs({
      bucket: this.bucket,
      bucketPolicy: this.bucketPolicy,
    });
  }
}
