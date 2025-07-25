#!/bin/bash

# 🏛️ Buddhist Community - Backend Services Setup
# AWS Amplify 백엔드 서비스 설정 스크립트

set -e

# 색상 코드
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 AWS Amplify 백엔드 서비스 설정 시작...${NC}"
echo "=================================================="

# 1. 인증 서비스 (Cognito) 설정
echo -e "\n${BLUE}1. 인증 서비스 (Cognito) 설정${NC}"
echo "----------------------------------------"

if amplify status auth | grep -q "No auth"; then
    echo -e "${YELLOW}Cognito 사용자 풀 생성 중...${NC}"
    
    # Cognito 설정 JSON 생성
    cat > auth-config.json << EOF
{
    "resourceName": "buddhistcommunity",
    "serviceType": "cognito",
    "userPoolName": "BuddhistCommunity_userpool_prod",
    "userPoolGroupList": ["Moderators", "ContentCreators"],
    "adminQueries": false,
    "triggers": {},
    "hostedUI": true,
    "userPoolGroups": true,
    "adminQueriesGroup": "Moderators",
    "signupAttributes": ["email"],
    "socialProviders": [],
    "usernameAttributes": ["email"],
    "usernameCaseSensitive": false,
    "useDefault": "manual",
    "authSelections": "userPoolOnly",
    "passwordPolicyMinLength": 8,
    "passwordPolicyCharacters": ["requireUppercase", "requireLowercase", "requireNumbers", "requireSymbols"],
    "mfaConfiguration": "OPTIONAL",
    "mfaTypes": ["SMS Text Message", "TOTP"],
    "smsAuthenticationMessage": "Your authentication code is {####}",
    "smsVerificationMessage": "Your verification code is {####}",
    "emailVerificationSubject": "Buddhist Community - 이메일 인증",
    "emailVerificationMessage": "인증 코드: {####}",
    "defaultPasswordPolicy": false,
    "attributes": ["email", "name", "preferred_username"],
    "aliasAttributes": [],
    "userpoolClientGenerateSecret": false,
    "userpoolClientRefreshTokenValidity": 30,
    "userpoolClientWriteAttributes": ["email", "name", "preferred_username"],
    "userpoolClientReadAttributes": ["email", "name", "preferred_username"],
    "userpoolClientLambdaRole": "buddhistcommunity_userpoolclient_lambda_role",
    "userpoolClientSetAttributes": false,
    "sharedId": "buddhistcommunity",
    "resourceNameTruncated": "buddhi",
    "userPoolGroupList": ["Moderators", "ContentCreators"],
    "dependsOn": []
}
EOF

    amplify add auth --headless auth-config.json
    rm auth-config.json
    
    echo -e "✅ ${GREEN}Cognito 사용자 풀이 설정되었습니다${NC}"
else
    echo -e "✅ ${GREEN}인증 서비스가 이미 설정되어 있습니다${NC}"
fi

# 2. GraphQL API 설정
echo -e "\n${BLUE}2. GraphQL API (AppSync) 설정${NC}"
echo "----------------------------------------"

if amplify status api | grep -q "No api"; then
    echo -e "${YELLOW}GraphQL API 생성 중...${NC}"
    
    # API 설정 JSON 생성
    cat > api-config.json << EOF
{
    "resourceName": "buddhistcommunity",
    "serviceName": "AppSync",
    "region": "ap-northeast-2",
    "gqlSchemaPath": "amplify/backend/api/buddhistcommunity/schema.graphql",
    "defaultAuthType": {
        "mode": "AMAZON_COGNITO_USER_POOLS",
        "cognitoUserPoolId": "authBuddhistCommunity"
    },
    "additionalAuthTypes": [
        {
            "mode": "API_KEY",
            "description": "Public API access",
            "expirationTime": 365
        }
    ],
    "conflictResolution": {
        "defaultResolutionStrategy": {
            "type": "AUTOMERGE"
        }
    },
    "capabilities": ["CREATE", "UPDATE", "DELETE"],
    "resolverConfig": {
        "project": {
            "overrideFlag": true
        }
    }
}
EOF

    amplify add api --headless api-config.json
    rm api-config.json
    
    echo -e "✅ ${GREEN}GraphQL API가 설정되었습니다${NC}"
else
    echo -e "✅ ${GREEN}API 서비스가 이미 설정되어 있습니다${NC}"
fi

# 3. 스토리지 (S3) 설정
echo -e "\n${BLUE}3. 스토리지 (S3) 설정${NC}"
echo "----------------------------------------"

if amplify status storage | grep -q "No storage"; then
    echo -e "${YELLOW}S3 스토리지 생성 중...${NC}"
    
    # 스토리지 설정 JSON 생성
    cat > storage-config.json << EOF
{
    "resourceName": "buddhistcommunitystorage",
    "bucketName": "buddhist-community-storage-prod",
    "policyUUID": "$(uuidgen)",
    "storageAccess": "authAndGuest",
    "guestAccess": ["READ"],
    "authAccess": ["CREATE_AND_UPDATE", "READ", "DELETE"],
    "lambdaTrigger": false,
    "groupAccess": {
        "Moderators": ["CREATE_AND_UPDATE", "READ", "DELETE"],
        "ContentCreators": ["CREATE_AND_UPDATE", "READ"]
    },
    "selectedGuestPermissions": ["s3:GetObject"],
    "selectedAuthenticatedPermissions": ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
    "unauthRoleName": "amplify-buddhistcommunity-prod-unauth",
    "authRoleName": "amplify-buddhistcommunity-prod-auth",
    "triggerFunction": "NONE"
}
EOF

    amplify add storage --headless storage-config.json
    rm storage-config.json
    
    echo -e "✅ ${GREEN}S3 스토리지가 설정되었습니다${NC}"
else
    echo -e "✅ ${GREEN}스토리지 서비스가 이미 설정되어 있습니다${NC}"
fi

# 4. 호스팅 설정
echo -e "\n${BLUE}4. 호스팅 (CloudFront + S3) 설정${NC}"
echo "----------------------------------------"

if amplify status hosting | grep -q "No hosting"; then
    echo -e "${YELLOW}호스팅 서비스 설정 중...${NC}"
    
    amplify add hosting << EOF
Hosting with Amplify Console (Managed hosting with custom domains, Continuous deployment)
Manual deployment
EOF
    
    echo -e "✅ ${GREEN}호스팅 서비스가 설정되었습니다${NC}"
else
    echo -e "✅ ${GREEN}호스팅 서비스가 이미 설정되어 있습니다${NC}"
fi

# 5. 서비스 상태 확인
echo -e "\n${BLUE}5. 백엔드 서비스 상태 확인${NC}"
echo "----------------------------------------"
amplify status

echo -e "\n${YELLOW}⚠️  중요: 이제 amplify push를 실행하여 백엔드를 배포하세요${NC}"
echo -e "   명령: ${GREEN}amplify push${NC}"
echo -e "\n${GREEN}🎉 백엔드 서비스 설정 완료!${NC}"
echo -e "   다음 단계: ${YELLOW}./scripts/deploy-production.sh${NC}"