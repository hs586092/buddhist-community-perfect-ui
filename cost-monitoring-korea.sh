#!/bin/bash

# 한국 원화 기준 비용 모니터링 설정

# 1. 예산 알림 설정 (월 5만원)
aws budgets create-budget \
  --account-id $(aws sts get-caller-identity --query Account --output text) \
  --budget '{
    "BudgetName": "BuddhistCommunityKR-Monthly",
    "BudgetLimit": {
      "Amount": "50",
      "Unit": "USD"
    },
    "TimeUnit": "MONTHLY",
    "BudgetType": "COST",
    "CostFilters": {
      "Region": ["ap-northeast-2"]
    }
  }' \
  --notifications-with-subscribers '[{
    "Notification": {
      "NotificationType": "ACTUAL",
      "ComparisonOperator": "GREATER_THAN",
      "Threshold": 80,
      "ThresholdType": "PERCENTAGE"
    },
    "Subscribers": [{
      "SubscriptionType": "EMAIL",
      "Address": "admin@buddhist-community-kr.com"
    }]
  }]'

# 2. 리소스 태깅 (비용 추적용)
aws resourcegroupstaggingapi tag-resources \
  --resource-arn-list \
    "arn:aws:s3:::buddhist-community-kr-*" \
    "arn:aws:cloudfront::*:distribution/*" \
    "arn:aws:cognito-idp:ap-northeast-2:*:userpool/*" \
  --tags "Project=BuddhistCommunityKR,Environment=Production,CostCenter=Korea"

echo "✅ 비용 모니터링 설정 완료 (월 5만원 기준)"
