#!/bin/bash

# 🏛️ Buddhist Community - Production Deployment Script
# AWS Amplify 프로덕션 배포 자동화 스크립트

set -e

# 색상 코드
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# 배포 설정
ENV_NAME="prod"
PROJECT_NAME="BuddhistCommunity"

echo -e "${PURPLE}🚀 Buddhist Community 프로덕션 배포 시작${NC}"
echo "=================================================="
echo -e "환경: ${YELLOW}$ENV_NAME${NC}"
echo -e "프로젝트: ${YELLOW}$PROJECT_NAME${NC}"
echo -e "시간: ${YELLOW}$(date)${NC}"
echo ""

# 1. 배포 전 검증
echo -e "${BLUE}1. 배포 전 검증${NC}"
echo "----------------------------------------"

# Git 상태 확인
if [ -d ".git" ]; then
    if ! git diff --quiet; then
        echo -e "⚠️  ${YELLOW}커밋되지 않은 변경사항이 있습니다${NC}"
        git status --porcelain
        read -p "계속 진행하시겠습니까? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    else
        echo -e "✅ ${GREEN}Git 상태가 깨끗합니다${NC}"
    fi
fi

# 환경 변수 파일 확인
if [ ! -f ".env.production" ]; then
    echo -e "❌ ${RED}.env.production 파일이 없습니다${NC}"
    exit 1
fi

# 빌드 테스트
echo -e "${YELLOW}프로덕션 빌드 테스트 중...${NC}"
if npm run build > /dev/null 2>&1; then
    echo -e "✅ ${GREEN}빌드 테스트 성공${NC}"
else
    echo -e "❌ ${RED}빌드 테스트 실패${NC}"
    echo -e "   확인: ${YELLOW}npm run build${NC}"
    exit 1
fi

# 2. 백엔드 배포
echo -e "\n${BLUE}2. 백엔드 배포 (AWS Amplify)${NC}"
echo "----------------------------------------"

echo -e "${YELLOW}백엔드 서비스 배포 중... (5-10분 소요)${NC}"
amplify push --yes

# 배포 상태 확인
echo -e "\n${YELLOW}배포된 리소스 확인:${NC}"
amplify status

# 3. 환경 변수 업데이트
echo -e "\n${BLUE}3. 환경 변수 업데이트${NC}"
echo "----------------------------------------"

echo -e "${YELLOW}Amplify 리소스 정보를 가져와서 환경 변수를 업데이트합니다${NC}"

# Amplify 출력에서 정보 추출
if [ -f "src/aws-exports.js" ]; then
    echo -e "✅ ${GREEN}aws-exports.js 파일이 생성되었습니다${NC}"
    
    # 주요 설정 값들 추출 및 표시
    echo -e "\n${YELLOW}생성된 리소스 정보:${NC}"
    
    # GraphQL 엔드포인트
    GRAPHQL_ENDPOINT=$(grep -o 'graphqlEndpoint.*' src/aws-exports.js | cut -d'"' -f3)
    if [ ! -z "$GRAPHQL_ENDPOINT" ]; then
        echo -e "  GraphQL 엔드포인트: ${GREEN}$GRAPHQL_ENDPOINT${NC}"
    fi
    
    # Cognito User Pool ID
    USER_POOL_ID=$(grep -o 'userPoolId.*' src/aws-exports.js | cut -d'"' -f3)
    if [ ! -z "$USER_POOL_ID" ]; then
        echo -e "  User Pool ID: ${GREEN}$USER_POOL_ID${NC}"
    fi
    
    # Cognito Client ID
    CLIENT_ID=$(grep -o 'userPoolWebClientId.*' src/aws-exports.js | cut -d'"' -f3)
    if [ ! -z "$CLIENT_ID" ]; then
        echo -e "  Client ID: ${GREEN}$CLIENT_ID${NC}"
    fi
    
    # S3 Bucket
    S3_BUCKET=$(grep -o 'bucket.*' src/aws-exports.js | cut -d'"' -f3)
    if [ ! -z "$S3_BUCKET" ]; then
        echo -e "  S3 Bucket: ${GREEN}$S3_BUCKET${NC}"
    fi
    
else
    echo -e "⚠️  ${YELLOW}aws-exports.js 파일을 찾을 수 없습니다${NC}"
fi

# 4. 코드 생성
echo -e "\n${BLUE}4. GraphQL 코드 생성${NC}"
echo "----------------------------------------"

echo -e "${YELLOW}GraphQL 타입 및 쿼리 생성 중...${NC}"
amplify codegen

echo -e "✅ ${GREEN}GraphQL 코드 생성 완료${NC}"

# 5. 프론트엔드 빌드 및 배포
echo -e "\n${BLUE}5. 프론트엔드 빌드 및 배포${NC}"
echo "----------------------------------------"

echo -e "${YELLOW}프로덕션 빌드 생성 중...${NC}"
npm run build

echo -e "${YELLOW}프론트엔드 배포 중...${NC}"
amplify publish --yes

# 6. 배포 완료 확인
echo -e "\n${BLUE}6. 배포 완료 확인${NC}"
echo "----------------------------------------"

# 앱 URL 가져오기
APP_URL=$(amplify status | grep -o 'https://.*amplifyapp.com' | head -1)

if [ ! -z "$APP_URL" ]; then
    echo -e "🎉 ${GREEN}배포가 성공적으로 완료되었습니다!${NC}"
    echo -e "\n📱 ${PURPLE}앱 URL: ${GREEN}$APP_URL${NC}"
    echo -e "🔧 ${PURPLE}관리 콘솔: ${GREEN}https://console.aws.amazon.com/amplify/home${NC}"
else
    echo -e "⚠️  ${YELLOW}앱 URL을 찾을 수 없습니다. Amplify 콘솔에서 확인하세요.${NC}"
fi

# 7. 배포 후 테스트
echo -e "\n${BLUE}7. 배포 후 기본 테스트${NC}"
echo "----------------------------------------"

if [ ! -z "$APP_URL" ]; then
    echo -e "${YELLOW}앱 상태 확인 중...${NC}"
    
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL" || echo "000")
    
    if [ "$HTTP_STATUS" = "200" ]; then
        echo -e "✅ ${GREEN}앱이 정상적으로 로드됩니다 (HTTP $HTTP_STATUS)${NC}"
    else
        echo -e "⚠️  ${YELLOW}앱 상태 확인 필요 (HTTP $HTTP_STATUS)${NC}"
    fi
fi

# 8. 배포 정보 저장
echo -e "\n${BLUE}8. 배포 정보 저장${NC}"
echo "----------------------------------------"

# 배포 정보 JSON 생성
cat > deployment-info.json << EOF
{
    "deploymentTime": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
    "environment": "$ENV_NAME",
    "projectName": "$PROJECT_NAME",
    "appUrl": "$APP_URL",
    "region": "ap-northeast-2",
    "version": "$(npm pkg get version | tr -d '"')",
    "gitCommit": "$(git rev-parse HEAD 2>/dev/null || echo 'unknown')",
    "resources": {
        "graphqlEndpoint": "$GRAPHQL_ENDPOINT",
        "userPoolId": "$USER_POOL_ID",
        "clientId": "$CLIENT_ID",
        "s3Bucket": "$S3_BUCKET"
    }
}
EOF

echo -e "✅ ${GREEN}배포 정보가 deployment-info.json에 저장되었습니다${NC}"

# 9. 다음 단계 안내
echo -e "\n${PURPLE}=================================================="
echo -e "🎉 Buddhist Community 배포 완료!"
echo -e "==================================================${NC}"

echo -e "\n${BLUE}✅ 완료된 작업:${NC}"
echo -e "  • Cognito 사용자 인증 시스템"
echo -e "  • GraphQL API (AppSync)"
echo -e "  • S3 파일 스토리지"
echo -e "  • CloudFront CDN 배포"
echo -e "  • 프론트엔드 React 앱"

echo -e "\n${BLUE}🔗 중요한 링크:${NC}"
if [ ! -z "$APP_URL" ]; then
    echo -e "  • 앱 URL: ${GREEN}$APP_URL${NC}"
fi
echo -e "  • AWS 콘솔: ${GREEN}https://console.aws.amazon.com/amplify/${NC}"
echo -e "  • CloudWatch: ${GREEN}https://console.aws.amazon.com/cloudwatch/${NC}"

echo -e "\n${BLUE}📝 다음 단계:${NC}"
echo -e "  1. 앱 URL 접속하여 기능 테스트"
echo -e "  2. 사용자 등록 및 로그인 테스트"
echo -e "  3. 법회 리뷰 작성 테스트"
echo -e "  4. 모니터링 설정: ${YELLOW}./scripts/setup-monitoring.sh${NC}"
echo -e "  5. 도메인 설정 (선택사항)"

echo -e "\n${GREEN}배포가 완료되었습니다! 🙏${NC}"