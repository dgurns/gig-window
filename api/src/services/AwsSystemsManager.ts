import AwsSystemsManager, { PutParameterResult } from 'aws-sdk/clients/ssm';
import { AWSError } from 'aws-sdk';
import { User } from 'entities/User';

const { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;

const SystemsManager = new AwsSystemsManager({
  apiVersion: '2014-11-06',
  region: AWS_REGION,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

const putParameter = async (
  parameterName: string,
  parameterValue: string
): Promise<PutParameterResult | AWSError> => {
  const putParameterResult = await SystemsManager.putParameter({
    Name: parameterName,
    Value: parameterValue,
    Type: 'String',
  }).promise();
  return putParameterResult;
};

export default {
  putParameter,
};
