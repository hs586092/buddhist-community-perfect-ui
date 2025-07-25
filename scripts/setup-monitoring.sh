#!/bin/bash

# 🏛️ Buddhist Community - Monitoring & Alerts Setup
# AWS CloudWatch 모니터링 및 알림 설정 스크립트

set -e

# 색상 코드
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

PROJECT_NAME="BuddhistCommunity"
NOTIFICATION_EMAIL="admin@buddhist-community.com"
REGION="ap-northeast-2"

echo -e "${PURPLE}📊 Buddhist Community 모니터링 설정 시작${NC}"
echo "=================================================="

# 1. SNS 토픽 생성 (알림용)
echo -e "\n${BLUE}1. SNS 알림 토픽 생성${NC}"
echo "----------------------------------------"

SNS_TOPIC_ARN=$(aws sns create-topic \
    --name "${PROJECT_NAME}-alerts" \
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

# 2. CloudWatch 대시보드 생성
echo -e "\n${BLUE}2. CloudWatch 대시보드 생성${NC}"
echo "----------------------------------------"

# 대시보드 JSON 설정 생성
cat > dashboard-config.json << 'EOF'
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
                "title": "GraphQL API 성능",
                "period": 300
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
                "title": "사용자 인증",
                "period": 300
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
                "title": "S3 요청",
                "period": 300
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
                "title": "CloudFront CDN",
                "period": 300
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
        sed -i.bak "s/API_ID/$API_ID/g" dashboard-config.json
    fi
    
    # User Pool ID 추출
    USER_POOL_ID=$(grep -o 'aws_user_pools_id.*' src/aws-exports.js | cut -d'"' -f4)
    if [ ! -z "$USER_POOL_ID" ]; then
        sed -i.bak "s/USER_POOL_ID/$USER_POOL_ID/g" dashboard-config.json
    fi
fi

# 대시보드 생성
aws cloudwatch put-dashboard \
    --dashboard-name "$PROJECT_NAME-Dashboard" \
    --dashboard-body file://dashboard-config.json \
    --region $REGION

echo -e "✅ ${GREEN}CloudWatch 대시보드가 생성되었습니다${NC}"
echo -e "   URL: ${BLUE}https://console.aws.amazon.com/cloudwatch/home?region=$REGION#dashboards:name=$PROJECT_NAME-Dashboard${NC}"

# 정리
rm -f dashboard-config.json dashboard-config.json.bak

# 3. CloudWatch 알람 설정
echo -e "\n${BLUE}3. CloudWatch 알람 설정${NC}"
echo "----------------------------------------"

if [ ! -z "$SNS_TOPIC_ARN" ]; then
    # API 에러율 알람
    aws cloudwatch put-metric-alarm \
        --alarm-name "${PROJECT_NAME}-HighErrorRate" \
        --alarm-description "GraphQL API 에러율이 높습니다" \
        --metric-name "4XXError" \
        --namespace "AWS/AppSync" \
        --statistic "Sum" \
        --period 300 \
        --threshold 10 \
        --comparison-operator "GreaterThanThreshold" \
        --evaluation-periods 2 \
        --alarm-actions "$SNS_TOPIC_ARN" \
        --region $REGION
    
    echo -e "✅ ${GREEN}API 에러율 알람 설정${NC}"
    
    # API 지연시간 알람
    aws cloudwatch put-metric-alarm \
        --alarm-name "${PROJECT_NAME}-HighLatency" \
        --alarm-description "GraphQL API 응답시간이 느립니다" \
        --metric-name "Latency" \
        --namespace "AWS/AppSync" \
        --statistic "Average" \
        --period 300 \
        --threshold 1000 \
        --comparison-operator "GreaterThanThreshold" \
        --evaluation-periods 3 \
        --alarm-actions "$SNS_TOPIC_ARN" \
        --region $REGION
    
    echo -e "✅ ${GREEN}API 지연시간 알람 설정${NC}"
    
    # 인증 실패 알람
    aws cloudwatch put-metric-alarm \
        --alarm-name "${PROJECT_NAME}-AuthFailures" \
        --alarm-description "인증 실패가 급증했습니다" \
        --metric-name "SignInThrottles" \
        --namespace "AWS/Cognito" \
        --statistic "Sum" \
        --period 300 \
        --threshold 20 \
        --comparison-operator "GreaterThanThreshold" \
        --evaluation-periods 2 \
        --alarm-actions "$SNS_TOPIC_ARN" \
        --region $REGION
    
    echo -e "✅ ${GREEN}인증 실패 알람 설정${NC}"
else
    echo -e "⚠️  ${YELLOW}SNS 토픽이 없어 알람을 설정할 수 없습니다${NC}"
fi

# 4. 로그 그룹 설정
echo -e "\n${BLUE}4. CloudWatch 로그 그룹 설정${NC}"
echo "----------------------------------------"

# AppSync 로그 그룹 생성
aws logs create-log-group \
    --log-group-name "/aws/appsync/apis/$API_ID" \
    --region $REGION 2>/dev/null || echo -e "⚠️  ${YELLOW}로그 그룹이 이미 존재하거나 API ID를 찾을 수 없습니다${NC}"

# 로그 보존 기간 설정 (30일)
aws logs put-retention-policy \
    --log-group-name "/aws/appsync/apis/$API_ID" \
    --retention-in-days 30 \
    --region $REGION 2>/dev/null || true

echo -e "✅ ${GREEN}로그 보존 정책 설정 (30일)${NC}"

# 5. 성능 모니터링 메트릭 생성
echo -e "\n${BLUE}5. 사용자 정의 메트릭 설정${NC}"
echo "----------------------------------------"

# 사용자 정의 메트릭 생성 스크립트
cat > custom-metrics.js << 'EOF'
// 클라이언트에서 사용할 사용자 정의 메트릭
import { CloudWatch } from 'aws-sdk';

const cloudwatch = new CloudWatch({ region: 'ap-northeast-2' });

export const sendCustomMetric = async (metricName, value, unit = 'Count') => {
  const params = {
    Namespace: 'BuddhistCommunity/Application',
    MetricData: [
      {
        MetricName: metricName,
        Value: value,
        Unit: unit,
        Timestamp: new Date()
      }
    ]
  };
  
  try {
    await cloudwatch.putMetricData(params).promise();
  } catch (error) {
    console.error('Failed to send metric:', error);
  }
};

// 사용 예시:
// sendCustomMetric('ReviewCreated', 1);
// sendCustomMetric('UserRegistration', 1);
// sendCustomMetric('SessionAttendance', 1);
EOF

echo -e "✅ ${GREEN}사용자 정의 메트릭 스크립트 생성: custom-metrics.js${NC}"

# 6. 성능 대시보드 URL 생성
echo -e "\n${BLUE}6. 모니터링 URL 생성${NC}"
echo "----------------------------------------"

DASHBOARD_URL="https://console.aws.amazon.com/cloudwatch/home?region=$REGION#dashboards:name=$PROJECT_NAME-Dashboard"
ALARMS_URL="https://console.aws.amazon.com/cloudwatch/home?region=$REGION#alarmsV2:"
LOGS_URL="https://console.aws.amazon.com/cloudwatch/home?region=$REGION#logsV2:log-groups"

# 모니터링 정보 파일 생성
cat > monitoring-info.json << EOF
{
    "setupTime": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
    "projectName": "$PROJECT_NAME",
    "region": "$REGION",
    "snsTopicArn": "$SNS_TOPIC_ARN",
    "notificationEmail": "$USER_EMAIL",
    "urls": {
        "dashboard": "$DASHBOARD_URL",
        "alarms": "$ALARMS_URL",
        "logs": "$LOGS_URL"
    },
    "alarms": [
        "${PROJECT_NAME}-HighErrorRate",
        "${PROJECT_NAME}-HighLatency", 
        "${PROJECT_NAME}-AuthFailures"
    ],
    "metrics": {
        "namespace": "BuddhistCommunity/Application",
        "customMetrics": [
            "ReviewCreated",
            "UserRegistration", 
            "SessionAttendance"
        ]
    }
}
EOF

echo -e "✅ ${GREEN}모니터링 정보가 monitoring-info.json에 저장되었습니다${NC}"

# 7. 완료 및 안내
echo -e "\n${PURPLE}=================================================="
echo -e "📊 모니터링 설정 완료!"
echo -e "==================================================${NC}"

echo -e "\n${BLUE}✅ 설정된 모니터링:${NC}"
echo -e "  • CloudWatch 대시보드"
echo -e "  • 에러율/지연시간/인증 실패 알람"
echo -e "  • 로그 보존 정책 (30일)"
echo -e "  • SNS 이메일 알림"

echo -e "\n${BLUE}🔗 모니터링 링크:${NC}"
echo -e "  • 대시보드: ${GREEN}$DASHBOARD_URL${NC}"
echo -e "  • 알람: ${GREEN}$ALARMS_URL${NC}"
echo -e "  • 로그: ${GREEN}$LOGS_URL${NC}"

echo -e "\n${BLUE}📧 알림 설정:${NC}"
if [ ! -z "$USER_EMAIL" ]; then
    echo -e "  • 이메일: ${GREEN}$USER_EMAIL${NC}"
    echo -e "  • ${YELLOW}이메일 확인을 위해 받은편지함을 확인하세요${NC}"
fi

echo -e "\n${BLUE}📝 다음 단계:${NC}"
echo -e "  1. 이메일 구독 확인"
echo -e "  2. 대시보드에서 실시간 메트릭 확인"
echo -e "  3. 알람 테스트 (의도적으로 에러 발생)"
echo -e "  4. 정기적인 성능 리뷰 일정 수립"

echo -e "\n${GREEN}모니터링 설정이 완료되었습니다! 📈${NC}"