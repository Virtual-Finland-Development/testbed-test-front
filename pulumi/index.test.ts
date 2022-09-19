import * as pulumi from '@pulumi/pulumi';

function promiseOf<T>(output: pulumi.Output<T>): Promise<T> {
  return new Promise(resolve => output.apply(resolve));
}

describe('Pulumi unit tests', () => {
  // Define the infra variable as a type whose shape matches that of the
  // to-be-defined resources module.
  // https://www.typescriptlang.org/docs/handbook/2/typeof-types.html
  let bucketModule: typeof import('./src/Bucket');
  let cloudFrontModule: typeof import('./src/CloudFront');

  beforeAll(() => {
    // Put Pulumi in unit-test mode, mocking all calls to cloud-provider APIs.
    pulumi.runtime.setMocks({
      // Mock requests to provision cloud resources and return a canned response.
      newResource: (
        args: pulumi.runtime.MockResourceArgs
      ): { id: string; state: any } => {
        // Here, we're returning a same-shaped object for all resource types.
        // We could, however, use the arguments passed into this function to
        // customize the mocked-out properties of a particular resource based
        // on its type. See the unit-testing docs for details:
        // https://www.pulumi.com/docs/guides/testing/unit
        switch (args.type) {
          case 'aws:cloudfront/distribution:Distribution':
            return {
              id: `${args.name}-id`,
              state: {
                ...args,
                arn: 'arn:aws:some-cert-arn',
              },
            };
          default:
            return {
              id: `${args.name}-id`,
              state: args.inputs,
            };
        }
      },

      // Mock function calls and return whatever input properties were provided.
      call: (args: pulumi.runtime.MockCallArgs) => {
        return args.inputs;
      },
    });
  });

  beforeEach(async () => {
    // Dynamically import the resources module.
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#dynamic_imports
    bucketModule = await import('./src/Bucket');
    cloudFrontModule = await import('./src/CloudFront');
  });

  test('Some simple bucket & cloud front tests.', async () => {
    const originAccessIdentity =
      cloudFrontModule.CloudFront.createOriginAccessIdentity();
    const bucketSetup = new bucketModule.Bucket(
      'test-bucket-setup',
      originAccessIdentity
    );

    const bucketName = await promiseOf(bucketSetup.bucket.id);
    expect(bucketName).toBe('testbed-test-front-bucket-pulumi-id');

    const cloudFrontSetup = new cloudFrontModule.CloudFront(
      'test-cloudfront-setup',
      bucketSetup.bucket,
      originAccessIdentity
    );

    const certArn = await promiseOf(cloudFrontSetup.cloudFrontDistribution.arn);
    expect(certArn).toBe('arn:aws:some-cert-arn');
  });
});
