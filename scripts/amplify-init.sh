#!/bin/bash

# 🏛️ Buddhist Community - Amplify Project Initialization
# AWS Amplify 프로젝트 초기화 스크립트

set -e

# 색상 코드
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 AWS Amplify 프로젝트 초기화 시작...${NC}"
echo "=================================================="

# 프로젝트 설정
PROJECT_NAME="BuddhistCommunity"
ENV_NAME="prod"
REGION="ap-northeast-2"

echo -e "${YELLOW}프로젝트 설정:${NC}"
echo "  이름: $PROJECT_NAME"
echo "  환경: $ENV_NAME"
echo "  리전: $REGION"
echo ""

# AWS 계정 확인
echo -e "${BLUE}1. AWS 계정 확인${NC}"
echo "----------------------------------------"
if aws sts get-caller-identity &> /dev/null; then
    ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    USER_ARN=$(aws sts get-caller-identity --query Arn --output text)
    echo -e "✅ AWS 계정: ${GREEN}$ACCOUNT_ID${NC}"
    echo -e "✅ 사용자: ${GREEN}$USER_ARN${NC}"
else
    echo -e "❌ ${RED}AWS CLI가 구성되지 않았습니다${NC}"
    echo -e "   설정: ${YELLOW}aws configure${NC}"
    exit 1
fi

# Amplify 프로젝트 초기화
echo -e "\n${BLUE}2. Amplify 프로젝트 초기화${NC}"
echo "----------------------------------------"

if [ -f "amplify/.config/project-config.json" ]; then
    echo -e "⚠️  ${YELLOW}기존 Amplify 프로젝트가 감지되었습니다${NC}"
    read -p "기존 프로젝트를 삭제하고 새로 시작하시겠습니까? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}기존 프로젝트 삭제 중...${NC}"
        rm -rf amplify
        rm -f src/aws-exports.js
        rm -f src/amplifyconfiguration.json
    else
        echo -e "${GREEN}기존 프로젝트를 유지합니다${NC}"
        exit 0
    fi
fi

# Amplify 초기화 (자동 설정)
echo -e "${YELLOW}Amplify 프로젝트 초기화 중...${NC}"
amplify init --yes \
    --name "$PROJECT_NAME" \
    --environment "$ENV_NAME" \
    --defaultEditor code \
    --appType javascript \
    --framework react \
    --srcDir src \
    --distDir dist \
    --buildCommand "npm run build" \
    --startCommand "npm start" \
    --region "$REGION"

echo -e "✅ ${GREEN}Amplify 프로젝트가 초기화되었습니다${NC}"

# 프로젝트 상태 확인
echo -e "\n${BLUE}3. 프로젝트 상태 확인${NC}"
echo "----------------------------------------"
amplify status

echo -e "\n${GREEN}🎉 Amplify 프로젝트 초기화 완료!${NC}"
echo -e "   다음 단계: ${YELLOW}./scripts/setup-backend-services.sh${NC}"