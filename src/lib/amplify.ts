import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';

// Amplify 구성
const amplifyConfig = {
  aws_project_region: 'us-east-1',
  aws_appsync_graphqlEndpoint: process.env.VITE_GRAPHQL_ENDPOINT || '',
  aws_appsync_region: 'us-east-1',
  aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
  aws_cognito_region: 'us-east-1',
  aws_user_pools_id: process.env.VITE_USER_POOL_ID || '',
  aws_user_pools_web_client_id: process.env.VITE_USER_POOL_CLIENT_ID || '',
  oauth: {},
  aws_cognito_username_attributes: ['email'],
  aws_cognito_social_providers: [],
  aws_cognito_signup_attributes: ['email'],
  aws_cognito_mfa_configuration: 'OFF',
  aws_cognito_mfa_types: ['SMS'],
  aws_cognito_password_protection_settings: {
    passwordPolicyMinLength: 8,
    passwordPolicyCharacters: []
  },
  aws_cognito_verification_mechanisms: ['email'],
  aws_user_files_s3_bucket: process.env.VITE_S3_BUCKET || '',
  aws_user_files_s3_bucket_region: 'us-east-1',
};

// 환경 변수가 있을 때만 Amplify 구성
if (process.env.VITE_GRAPHQL_ENDPOINT) {
  Amplify.configure(amplifyConfig);
}

// GraphQL 클라이언트 생성
export const client = generateClient();

// 구성 상태 확인 함수
export const isAmplifyConfigured = () => {
  return !!(
    process.env.VITE_GRAPHQL_ENDPOINT &&
    process.env.VITE_USER_POOL_ID &&
    process.env.VITE_USER_POOL_CLIENT_ID
  );
};

export default amplifyConfig;