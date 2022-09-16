import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';
import { ResourceOptions } from '@pulumi/pulumi';

import { BUCKET_NAME } from './constants';

export class CloudFront extends pulumi.ComponentResource {
  public cloudFrontDistribution: aws.cloudfront.Distribution;

  constructor(
    name: string,
    bucket: aws.s3.Bucket,
    originAccessIdentity: aws.cloudfront.OriginAccessIdentity,
    opts?: ResourceOptions
  ) {
    super('testbed:front:CloudFront', name, {}, opts);

    // Set up cloud front distribution config
    const cloudFrontDistribution = new aws.cloudfront.Distribution(
      'my-cloudfront-distribution',
      {
        origins: [
          {
            domainName: bucket.bucketRegionalDomainName,
            originId: bucket.arn,
            s3OriginConfig: {
              originAccessIdentity:
                originAccessIdentity.cloudfrontAccessIdentityPath,
            },
          },
        ],
        customErrorResponses: [
          {
            errorCachingMinTtl: 300,
            errorCode: 404,
            responseCode: 200,
            responsePagePath: '/index.html',
          },
          {
            errorCachingMinTtl: 300,
            errorCode: 403,
            responseCode: 200,
            responsePagePath: '/index.html',
          },
        ],
        defaultCacheBehavior: {
          allowedMethods: ['GET', 'HEAD'],
          cachedMethods: ['GET', 'HEAD'],
          targetOriginId: bucket.arn,
          viewerProtocolPolicy: 'redirect-to-https',
          forwardedValues: {
            cookies: {
              forward: 'none',
            },
            queryString: false,
          },
          minTtl: 0,
          defaultTtl: 3600,
          maxTtl: 86400,
          /* lambdaFunctionAssociations: [
              {
                eventType: 'viewer-response',
                includeBody: false,
                lambdaArn,
              },
            ], */
        },
        viewerCertificate: {
          cloudfrontDefaultCertificate: true,
        },
        restrictions: {
          geoRestriction: {
            locations: [],
            restrictionType: 'none',
          },
        },
        defaultRootObject: 'index.html',
        httpVersion: 'http2',
        isIpv6Enabled: true,
        priceClass: 'PriceClass_All',
        waitForDeployment: true,
        enabled: true,
        retainOnDelete: false,
      },
      {
        protect: true,
      }
    );

    this.cloudFrontDistribution = cloudFrontDistribution;

    this.registerOutputs({
      cloudFrontDistribution: this.cloudFrontDistribution,
    });
  }

  /**
   * Static method to create new cloudfront origin access identity
   */
  static createOriginAccessIdentity(): aws.cloudfront.OriginAccessIdentity {
    return new aws.cloudfront.OriginAccessIdentity(
      'testbed-test-front-origin-access-identity',
      {
        comment: `Access Identity for ${BUCKET_NAME}`,
      }
    );
  }
}
