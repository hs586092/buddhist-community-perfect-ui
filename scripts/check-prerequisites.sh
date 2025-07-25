#!/bin/bash

# 🏛️ Buddhist Community - Production Deployment Prerequisites Check
# AWS Amplify 프로덕션 배포를 위한 사전 요구사항 검증

set -e

echo "🔍 AWS Amplify 프로덕션 배포 사전 검사 시작..."
echo "=================================================="

# 색상 코드
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 성공/실패 카운터
SUCCESS_COUNT=0
ERROR_COUNT=0

check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "✅ ${GREEN}$1이 설치되어 있습니다${NC}"
        if [ "$2" ]; then
            echo -e "   버전: $(eval $2)"
        fi
        ((SUCCESS_COUNT++))
        return 0
    else
        echo -e "❌ ${RED}$1이 설치되어 있지 않습니다${NC}"
        if [ "$3" ]; then
            echo -e "   설치 명령: ${YELLOW}$3${NC}"
        fi
        ((ERROR_COUNT++))
        return 1
    fi
}

check_aws_config() {
    if aws sts get-caller-identity &> /dev/null; then
        echo -e "✅ ${GREEN}AWS CLI가 구성되어 있습니다${NC}"
        echo -e "   계정: $(aws sts get-caller-identity --query Account --output text)"
        echo -e "   사용자: $(aws sts get-caller-identity --query Arn --output text)"
        echo -e "   리전: $(aws configure get region)"
        ((SUCCESS_COUNT++))
        return 0
    else
        echo -e "❌ ${RED}AWS CLI가 구성되어 있지 않습니다${NC}"
        echo -e "   설정 명령: ${YELLOW}aws configure${NC}"
        ((ERROR_COUNT++))
        return 1
    fi
}

check_node_version() {
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version | cut -d'.' -f1 | sed 's/v//')
        if [ "$NODE_VERSION" -ge 18 ]; then
            echo -e "✅ ${GREEN}Node.js 버전이 적절합니다${NC}"
            echo -e "   버전: $(node --version)"
            ((SUCCESS_COUNT++))
            return 0
        else
            echo -e "❌ ${RED}Node.js 버전이 18.0.0 이상이어야 합니다${NC}"
            echo -e "   현재 버전: $(node --version)"
            echo -e "   업그레이드: ${YELLOW}nvm install 18 && nvm use 18${NC}"
            ((ERROR_COUNT++))
            return 1
        fi
    else
        echo -e "❌ ${RED}Node.js가 설치되어 있지 않습니다${NC}"
        echo -e "   설치: ${YELLOW}https://nodejs.org/에서 다운로드${NC}"
        ((ERROR_COUNT++))
        return 1
    fi
}

check_project_files() {
    echo -e "\n📁 프로젝트 파일 확인..."
    
    REQUIRED_FILES=(
        "package.json"
        "amplify/backend/api/buddhistcommunity/schema.graphql"
        "src/lib/amplify.ts"
        "amplify.yml"
        ".env.example"
    )
    
    for file in "${REQUIRED_FILES[@]}"; do
        if [ -f "$file" ]; then
            echo -e "✅ ${GREEN}$file이 존재합니다${NC}"
            ((SUCCESS_COUNT++))
        else
            echo -e "❌ ${RED}$file이 없습니다${NC}"
            ((ERROR_COUNT++))
        fi
    done
}

check_env_template() {
    echo -e "\n🔧 환경 변수 템플릿 확인..."
    
    if [ -f ".env.example" ]; then
        REQUIRED_VARS=(
            "VITE_GRAPHQL_ENDPOINT"
            "VITE_USER_POOL_ID"
            "VITE_USER_POOL_CLIENT_ID"
            "VITE_S3_BUCKET"
        )
        
        for var in "${REQUIRED_VARS[@]}"; do
            if grep -q "$var" .env.example; then
                echo -e "✅ ${GREEN}$var 템플릿이 있습니다${NC}"
                ((SUCCESS_COUNT++))
            else
                echo -e "❌ ${RED}$var 템플릿이 없습니다${NC}"
                ((ERROR_COUNT++))
            fi
        done
    else
        echo -e "❌ ${RED}.env.example 파일이 없습니다${NC}"
        ((ERROR_COUNT++))
    fi
}

echo -e "\n${BLUE}1. 필수 도구 설치 확인${NC}"
echo "----------------------------------------"

# Node.js 버전 확인
check_node_version

# AWS CLI 확인
check_command "aws" "aws --version" "curl https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip -o awscliv2.zip && unzip awscliv2.zip && sudo ./aws/install"

# Amplify CLI 확인
check_command "amplify" "amplify --version" "npm install -g @aws-amplify/cli"

# Git 확인
check_command "git" "git --version" "sudo apt-get install git"

echo -e "\n${BLUE}2. AWS 구성 확인${NC}"
echo "----------------------------------------"

# AWS 구성 확인
check_aws_config

echo -e "\n${BLUE}3. 프로젝트 구조 확인${NC}"
echo "----------------------------------------"

# 프로젝트 파일 확인
check_project_files

# 환경 변수 템플릿 확인
check_env_template

echo -e "\n${BLUE}4. 의존성 확인${NC}"
echo "----------------------------------------"

# npm 의존성 확인
if [ -f "package.json" ]; then
    if npm list --depth=0 > /dev/null 2>&1; then
        echo -e "✅ ${GREEN}npm 의존성이 올바르게 설치되어 있습니다${NC}"
        ((SUCCESS_COUNT++))
    else
        echo -e "❌ ${RED}npm 의존성에 문제가 있습니다${NC}"
        echo -e "   해결: ${YELLOW}npm install${NC}"
        ((ERROR_COUNT++))
    fi
fi

# 빌드 테스트
echo -e "\n${BLUE}5. 빌드 테스트${NC}"
echo "----------------------------------------"

if npm run build > /dev/null 2>&1; then
    echo -e "✅ ${GREEN}프로덕션 빌드가 성공했습니다${NC}"
    ((SUCCESS_COUNT++))
else
    echo -e "❌ ${RED}프로덕션 빌드가 실패했습니다${NC}"
    echo -e "   확인: ${YELLOW}npm run build${NC}"
    ((ERROR_COUNT++))
fi

# 최종 결과
echo -e "\n=================================================="
echo -e "${BLUE}배포 사전 검사 완료${NC}"
echo -e "=================================================="
echo -e "✅ 통과: ${GREEN}$SUCCESS_COUNT${NC}개"
echo -e "❌ 실패: ${RED}$ERROR_COUNT${NC}개"

if [ $ERROR_COUNT -eq 0 ]; then
    echo -e "\n🎉 ${GREEN}모든 사전 요구사항이 충족되었습니다!${NC}"
    echo -e "   다음 단계: ${YELLOW}./scripts/deploy-production.sh${NC}"
    exit 0
else
    echo -e "\n⚠️  ${YELLOW}배포 전에 위의 문제들을 해결해주세요.${NC}"
    exit 1
fi