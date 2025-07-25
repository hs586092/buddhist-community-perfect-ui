#!/bin/bash

# 🇰🇷 Buddhist Community Korea - 한국어 모니터링 설정
# 한국 원화 기준 비용 모니터링 + 한국어 알림

set -e

# 색상 코드
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

PROJECT_NAME="BuddhistCommunityKR"
NOTIFICATION_EMAIL="admin@buddhist-community.kr"
REGION="ap-northeast-2"
KRW_BUDGET_LIMIT="39000" # ₩39,000/월

echo -e "${PURPLE}🇰🇷 Buddhist Community Korea 모니터링 설정 시작${NC}"
echo "=================================================="

# 1. 한국어 SNS 토픽 생성
echo -e "\n${BLUE}1. 한국어 SNS 알림 토픽 생성${NC}"
echo "----------------------------------------"

SNS_TOPIC_ARN=$(aws sns create-topic \
    --name "${PROJECT_NAME}-alerts-kr" \
    --region $REGION \
    --query 'TopicArn' \
    --output text 2>/dev/null || echo "")

if [ ! -z "$SNS_TOPIC_ARN" ]; then
    echo -e "✅ ${GREEN}SNS 토픽 생성됨: $SNS_TOPIC_ARN${NC}"
    
    # 이메일 구독 추가
    read -p "알림을 받을 이메일 주소를 입력하세요 [$NOTIFICATION_EMAIL]: " USER_EMAIL
    USER_EMAIL=${USER_EMAIL:-$NOTIFICATION_EMAIL}
    
    aws sns subscribe \
        --topic-arn "$SNS_TOPIC_ARN" \
        --protocol email \
        --notification-endpoint "$USER_EMAIL" \
        --region $REGION
    
    echo -e "📧 ${YELLOW}$USER_EMAIL 로 확인 이메일이 발송되었습니다${NC}"
else
    echo -e "❌ ${RED}SNS 토픽 생성 실패${NC}"
fi

# 2. 한국 원화 기준 예산 설정
echo -e "\n${BLUE}2. 한국 원화 기준 예산 모니터링 설정${NC}"
echo "----------------------------------------"

# USD 환율 계산 (대략 1,300원/달러)
USD_BUDGET=$(echo "scale=2; $KRW_BUDGET_LIMIT / 1300" | bc -l)

cat > budget-korea.json << EOF
{
  "BudgetName": "${PROJECT_NAME}-Monthly-KRW",
  "BudgetLimit": {
    "Amount": "$USD_BUDGET",
    "Unit": "USD"
  },
  "TimeUnit": "MONTHLY",
  "BudgetType": "COST",
  "CostFilters": {
    "Region": ["ap-northeast-2"],
    "TagKey": ["Project"],
    "TagValue": ["BuddhistCommunityKR"]
  }
}
EOF

cat > budget-notifications.json << EOF
[{
  "Notification": {
    "NotificationType": "ACTUAL",
    "ComparisonOperator": "GREATER_THAN",
    "Threshold": 80,
    "ThresholdType": "PERCENTAGE",
    "NotificationState": "ALARM"
  },
  "Subscribers": [{
    "SubscriptionType": "EMAIL",
    "Address": "$USER_EMAIL"
  }]
}, {
  "Notification": {
    "NotificationType": "FORECASTED",
    "ComparisonOperator": "GREATER_THAN", 
    "Threshold": 100,
    "ThresholdType": "PERCENTAGE"
  },
  "Subscribers": [{
    "SubscriptionType": "EMAIL",
    "Address": "$USER_EMAIL"
  }]
}]
EOF

# 예산 생성
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
aws budgets create-budget \
    --account-id $ACCOUNT_ID \
    --budget file://budget-korea.json \
    --notifications-with-subscribers file://budget-notifications.json

echo -e "✅ ${GREEN}월 ₩$KRW_BUDGET_LIMIT 예산 알림 설정 완료${NC}"

# 3. 한국어 CloudWatch 대시보드 생성
echo -e "\n${BLUE}3. 한국어 CloudWatch 대시보드 생성${NC}"
echo "----------------------------------------"

cat > dashboard-korea.json << 'EOF'
{
    "widgets": [
        {
            "type": "metric",
            "x": 0,
            "y": 0,
            "width": 12,
            "height": 6,
            "properties": {
                "metrics": [
                    [ "AWS/AppSync", "4XXError", "GraphQLAPIId", "API_ID" ],
                    [ ".", "5XXError", ".", "." ],
                    [ ".", "Latency", ".", "." ]
                ],
                "view": "timeSeries",
                "stacked": false,
                "region": "ap-northeast-2",
                "title": "🏛️ 불교 커뮤니티 API 성능",
                "period": 300,
                "yAxis": {
                    "left": {
                        "label": "오류 수 / 지연 시간(ms)"
                    }
                }
            }
        },
        {
            "type": "metric",
            "x": 12,
            "y": 0,
            "width": 12,
            "height": 6,
            "properties": {
                "metrics": [
                    [ "AWS/Cognito", "SignInSuccesses", "UserPool", "USER_POOL_ID" ],
                    [ ".", "SignInThrottles", ".", "." ],
                    [ ".", "SignUpSuccesses", ".", "." ]
                ],
                "view": "timeSeries",
                "stacked": false,
                "region": "ap-northeast-2",
                "title": "🔐 사용자 인증 현황",
                "period": 300,
                "yAxis": {
                    "left": {
                        "label": "사용자 수"
                    }
                }
            }
        },
        {
            "type": "metric",
            "x": 0,
            "y": 6,
            "width": 12,
            "height": 6,
            "properties": {
                "metrics": [
                    [ "AWS/S3", "BucketRequests", "BucketName", "BUCKET_NAME", "FilterId", "EntireBucket" ]
                ],
                "view": "timeSeries",
                "stacked": false,
                "region": "ap-northeast-2",
                "title": "📁 스토리지 사용량",
                "period": 300,
                "yAxis": {
                    "left": {
                        "label": "요청 수"
                    }
                }
            }
        },
        {
            "type": "metric",
            "x": 12,
            "y": 6,
            "width": 12,
            "height": 6,
            "properties": {
                "metrics": [
                    [ "AWS/CloudFront", "Requests", "DistributionId", "DISTRIBUTION_ID" ],
                    [ ".", "BytesDownloaded", ".", "." ],
                    [ ".", "4xxErrorRate", ".", "." ],
                    [ ".", "5xxErrorRate", ".", "." ]
                ],
                "view": "timeSeries",
                "stacked": false,
                "region": "ap-northeast-2",
                "title": "🌐 CDN 성능 (전국 사용자)",
                "period": 300,
                "yAxis": {
                    "left": {
                        "label": "요청 수 / 오류율(%)"
                    }
                }
            }
        },
        {
            "type": "metric",
            "x": 0,
            "y": 12,
            "width": 24,
            "height": 6,
            "properties": {
                "metrics": [
                    [ "AWS/Billing", "EstimatedCharges", "Currency", "USD" ]
                ],
                "view": "timeSeries",
                "stacked": false,
                "region": "us-east-1",
                "title": "💰 월간 비용 추이 (목표: ₩$KRW_BUDGET_LIMIT)",
                "period": 3600,
                "yAxis": {
                    "left": {
                        "label": "비용 (USD)"
                    }
                }
            }
        }
    ]
}
EOF

# 실제 리소스 ID로 대시보드 업데이트
if [ -f "src/aws-exports.js" ]; then
    # GraphQL API ID 추출
    API_ID=$(grep -o 'aws_appsync_graphqlEndpoint.*' src/aws-exports.js | sed 's/.*\/\/\([^.]*\).*/\1/')
    if [ ! -z "$API_ID" ]; then
        sed -i.bak "s/API_ID/$API_ID/g" dashboard-korea.json
    fi
    
    # User Pool ID 추출
    USER_POOL_ID=$(grep -o 'aws_user_pools_id.*' src/aws-exports.js | cut -d'"' -f4)
    if [ ! -z "$USER_POOL_ID" ]; then
        sed -i.bak "s/USER_POOL_ID/$USER_POOL_ID/g" dashboard-korea.json
    fi
fi

# 대시보드 생성
aws cloudwatch put-dashboard \
    --dashboard-name "$PROJECT_NAME-Dashboard-KR" \
    --dashboard-body file://dashboard-korea.json \
    --region $REGION

echo -e "✅ ${GREEN}한국어 CloudWatch 대시보드가 생성되었습니다${NC}"
echo -e "   URL: ${BLUE}https://console.aws.amazon.com/cloudwatch/home?region=$REGION#dashboards:name=$PROJECT_NAME-Dashboard-KR${NC}"

# 4. 한국어 알람 설정
echo -e "\n${BLUE}4. 한국어 CloudWatch 알람 설정${NC}"
echo "----------------------------------------"

if [ ! -z "$SNS_TOPIC_ARN" ]; then
    # API 오류율 알람 (한국어)
    aws cloudwatch put-metric-alarm \
        --alarm-name "${PROJECT_NAME}-높은오류율" \
        --alarm-description "불교 커뮤니티 API 오류율이 높습니다 (1% 초과)" \
        --metric-name "4XXError" \
        --namespace "AWS/AppSync" \
        --statistic "Sum" \
        --period 300 \
        --threshold 10 \
        --comparison-operator "GreaterThanThreshold" \
        --evaluation-periods 2 \
        --alarm-actions "$SNS_TOPIC_ARN" \
        --region $REGION
    
    echo -e "✅ ${GREEN}API 오류율 알람 설정 (한국어)${NC}"
    
    # API 지연시간 알람 (한국어)
    aws cloudwatch put-metric-alarm \
        --alarm-name "${PROJECT_NAME}-높은지연시간" \
        --alarm-description "불교 커뮤니티 API 응답시간이 느립니다 (1초 초과)" \
        --metric-name "Latency" \
        --namespace "AWS/AppSync" \
        --statistic "Average" \
        --period 300 \
        --threshold 1000 \
        --comparison-operator "GreaterThanThreshold" \
        --evaluation-periods 3 \
        --alarm-actions "$SNS_TOPIC_ARN" \
        --region $REGION
    
    echo -e "✅ ${GREEN}API 지연시간 알람 설정 (한국어)${NC}"
    
    # 인증 실패 알람 (한국어)
    aws cloudwatch put-metric-alarm \
        --alarm-name "${PROJECT_NAME}-인증실패급증" \
        --alarm-description "불교 커뮤니티 로그인 실패가 급증했습니다 (20회/5분 초과)" \
        --metric-name "SignInThrottles" \
        --namespace "AWS/Cognito" \
        --statistic "Sum" \
        --period 300 \
        --threshold 20 \
        --comparison-operator "GreaterThanThreshold" \
        --evaluation-periods 2 \
        --alarm-actions "$SNS_TOPIC_ARN" \
        --region $REGION
    
    echo -e "✅ ${GREEN}인증 실패 알람 설정 (한국어)${NC}"
    
    # 비용 알람 (원화 기준)
    aws cloudwatch put-metric-alarm \
        --alarm-name "${PROJECT_NAME}-비용초과위험" \
        --alarm-description "월 비용이 ₩$KRW_BUDGET_LIMIT 목표를 초과할 위험이 있습니다" \
        --metric-name "EstimatedCharges" \
        --namespace "AWS/Billing" \
        --statistic "Maximum" \
        --period 3600 \
        --threshold $USD_BUDGET \
        --comparison-operator "GreaterThanThreshold" \
        --evaluation-periods 1 \
        --alarm-actions "$SNS_TOPIC_ARN" \
        --region us-east-1 \
        --dimensions Name=Currency,Value=USD
    
    echo -e "✅ ${GREEN}비용 초과 알람 설정 (₩$KRW_BUDGET_LIMIT 기준)${NC}"
else
    echo -e "⚠️  ${YELLOW}SNS 토픽이 없어 알람을 설정할 수 없습니다${NC}"
fi

# 5. 한국 사용자 행동 분석 대시보드 추가
echo -e "\n${BLUE}5. 한국 사용자 행동 분석 설정${NC}"
echo "----------------------------------------"

cat > user-analytics-korea.json << 'EOF'
{
    "widgets": [
        {
            "type": "metric",
            "x": 0,
            "y": 0,
            "width": 8,
            "height": 6,
            "properties": {
                "metrics": [
                    [ "BuddhistCommunityKR/Application", "ReviewCreated" ],
                    [ ".", "UserRegistration" ],
                    [ ".", "SessionAttendance" ]
                ],
                "view": "timeSeries",
                "stacked": false,
                "region": "ap-northeast-2",
                "title": "📈 한국 사용자 활동",
                "period": 3600,
                "yAxis": {
                    "left": {
                        "label": "활동 수"
                    }
                }
            }
        },
        {
            "type": "metric",
            "x": 8,
            "y": 0,
            "width": 8,
            "height": 6,
            "properties": {
                "metrics": [
                    [ "AWS/ApplicationELB", "RequestCount", "LoadBalancer", "app/buddhist-kr" ]
                ],
                "view": "timeSeries",
                "stacked": false,
                "region": "ap-northeast-2",
                "title": "🌍 지역별 접속량",
                "period": 3600
            }
        },
        {
            "type": "metric",
            "x": 16,
            "y": 0,
            "width": 8,
            "height": 6,
            "properties": {
                "metrics": [
                    [ "AWS/CloudFront", "OriginLatency", "DistributionId", "DISTRIBUTION_ID" ]
                ],
                "view": "timeSeries",
                "stacked": false,
                "region": "ap-northeast-2",
                "title": "⚡ 서울 리전 성능",
                "period": 300,
                "yAxis": {
                    "left": {
                        "label": "지연시간 (ms)"
                    }
                }
            }
        }
    ]
}
EOF

aws cloudwatch put-dashboard \
    --dashboard-name "$PROJECT_NAME-UserAnalytics-KR" \
    --dashboard-body file://user-analytics-korea.json \
    --region $REGION

echo -e "✅ ${GREEN}한국 사용자 분석 대시보드 생성 완료${NC}"

# 6. 정리 및 완료 정보
rm -f dashboard-korea.json dashboard-korea.json.bak user-analytics-korea.json budget-korea.json budget-notifications.json

cat > monitoring-info-korea.json << EOF
{
    "setupTime": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
    "projectName": "$PROJECT_NAME",
    "region": "$REGION",
    "currency": "KRW",
    "budgetLimit": "$KRW_BUDGET_LIMIT",
    "usdBudgetLimit": "$USD_BUDGET",
    "snsTopicArn": "$SNS_TOPIC_ARN",
    "notificationEmail": "$USER_EMAIL",
    "urls": {
        "mainDashboard": "https://console.aws.amazon.com/cloudwatch/home?region=$REGION#dashboards:name=$PROJECT_NAME-Dashboard-KR",
        "userAnalytics": "https://console.aws.amazon.com/cloudwatch/home?region=$REGION#dashboards:name=$PROJECT_NAME-UserAnalytics-KR",
        "alarms": "https://console.aws.amazon.com/cloudwatch/home?region=$REGION#alarmsV2:",
        "budget": "https://console.aws.amazon.com/billing/home#/budgets"
    },
    "alarms": [
        "${PROJECT_NAME}-높은오류율",
        "${PROJECT_NAME}-높은지연시간", 
        "${PROJECT_NAME}-인증실패급증",
        "${PROJECT_NAME}-비용초과위험"
    ],
    "koreanFeatures": {
        "dashboardLanguage": "한국어",
        "currencyDisplay": "KRW",
        "alarmMessages": "한국어",
        "budgetCurrency": "원화 기준"
    }
}
EOF

echo -e "\n${PURPLE}=================================================="
echo -e "🇰🇷 한국어 모니터링 설정 완료!"
echo -e "==================================================${NC}"

echo -e "\n${BLUE}✅ 설정된 한국어 모니터링:${NC}"
echo -e "  • 📊 한국어 CloudWatch 대시보드"
echo -e "  • 💰 원화 기준 비용 모니터링 (₩$KRW_BUDGET_LIMIT/월)"
echo -e "  • 🚨 한국어 알람 메시지"
echo -e "  • 📈 한국 사용자 행동 분석"
echo -e "  • 📧 한국어 이메일 알림"

echo -e "\n${BLUE}🔗 한국어 모니터링 링크:${NC}"
echo -e "  • 메인 대시보드: ${GREEN}https://console.aws.amazon.com/cloudwatch/home?region=$REGION#dashboards:name=$PROJECT_NAME-Dashboard-KR${NC}"
echo -e "  • 사용자 분석: ${GREEN}https://console.aws.amazon.com/cloudwatch/home?region=$REGION#dashboards:name=$PROJECT_NAME-UserAnalytics-KR${NC}"
echo -e "  • 예산 관리: ${GREEN}https://console.aws.amazon.com/billing/home#/budgets${NC}"

echo -e "\n${BLUE}💰 비용 모니터링:${NC}"
echo -e "  • 월 예산: ${GREEN}₩$KRW_BUDGET_LIMIT${NC}"
echo -e "  • USD 환산: ${GREEN}\$$USD_BUDGET${NC}"
echo -e "  • 알림: ${GREEN}80% 도달 시 이메일${NC}"

echo -e "\n${BLUE}📧 알림 설정:${NC}"
if [ ! -z "$USER_EMAIL" ]; then
    echo -e "  • 이메일: ${GREEN}$USER_EMAIL${NC}"
    echo -e "  • ${YELLOW}이메일 확인을 위해 받은편지함을 확인하세요${NC}"
fi

echo -e "\n${GREEN}🙏 한국어 모니터링 설정이 완료되었습니다!${NC}"