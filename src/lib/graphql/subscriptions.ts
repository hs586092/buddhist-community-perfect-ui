/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateReview = /* GraphQL */ `
  subscription OnCreateReview($filter: ModelSubscriptionReviewFilterInput) {
    onCreateReview(filter: $filter) {
      id
      dharmaSessionId
      dharmaSession {
        id
        title
        temple
        monk
        category
        status
        avgRating
        reviewCount
        createdAt
        updatedAt
      }
      userId
      user {
        id
        username
        level
        profileImage
        createdAt
        updatedAt
      }
      rating
      title
      content
      contentQuality
      teachingClarity
      atmosphere
      images
      isVerified
      attendanceVerified
      likeCount
      commentCount
      helpfulCount
      isPublished
      language
      createdAt
      updatedAt
      owner
    }
  }
`;

export const onUpdateReview = /* GraphQL */ `
  subscription OnUpdateReview($filter: ModelSubscriptionReviewFilterInput) {
    onUpdateReview(filter: $filter) {
      id
      dharmaSessionId
      dharmaSession {
        id
        title
        temple
        monk
        category
        status
        avgRating
        reviewCount
        createdAt
        updatedAt
      }
      userId
      user {
        id
        username
        level
        profileImage
        createdAt
        updatedAt
      }
      rating
      title
      content
      contentQuality
      teachingClarity
      atmosphere
      images
      isVerified
      attendanceVerified
      likeCount
      commentCount
      helpfulCount
      isPublished
      language
      createdAt
      updatedAt
      owner
    }
  }
`;

export const onDeleteReview = /* GraphQL */ `
  subscription OnDeleteReview($filter: ModelSubscriptionReviewFilterInput) {
    onDeleteReview(filter: $filter) {
      id
      dharmaSessionId
      dharmaSession {
        id
        title
        temple
        monk
        category
        status
        avgRating
        reviewCount
        createdAt
        updatedAt
      }
      userId
      user {
        id
        username
        level
        profileImage
        createdAt
        updatedAt
      }
      rating
      title
      content
      contentQuality
      teachingClarity
      atmosphere
      images
      isVerified
      attendanceVerified
      likeCount
      commentCount
      helpfulCount
      isPublished
      language
      createdAt
      updatedAt
      owner
    }
  }
`;

export const onCreateComment = /* GraphQL */ `
  subscription OnCreateComment($filter: ModelSubscriptionCommentFilterInput) {
    onCreateComment(filter: $filter) {
      id
      reviewId
      review {
        id
        title
        commentCount
      }
      userId
      user {
        id
        username
        level
        profileImage
      }
      parentCommentId
      content
      likeCount
      isActive
      createdAt
      updatedAt
      owner
    }
  }
`;

export const onUpdateComment = /* GraphQL */ `
  subscription OnUpdateComment($filter: ModelSubscriptionCommentFilterInput) {
    onUpdateComment(filter: $filter) {
      id
      reviewId
      userId
      user {
        id
        username
        level
        profileImage
      }
      parentCommentId
      content
      likeCount
      isActive
      createdAt
      updatedAt
      owner
    }
  }
`;

export const onDeleteComment = /* GraphQL */ `
  subscription OnDeleteComment($filter: ModelSubscriptionCommentFilterInput) {
    onDeleteComment(filter: $filter) {
      id
      reviewId
      userId
      parentCommentId
      content
      likeCount
      isActive
      createdAt
      updatedAt
      owner
    }
  }
`;

export const onCreateReviewLike = /* GraphQL */ `
  subscription OnCreateReviewLike($filter: ModelSubscriptionReviewLikeFilterInput) {
    onCreateReviewLike(filter: $filter) {
      id
      reviewId
      review {
        id
        title
        rating
        likeCount
      }
      userId
      user {
        id
        username
      }
      createdAt
      owner
    }
  }
`;

export const onDeleteReviewLike = /* GraphQL */ `
  subscription OnDeleteReviewLike($filter: ModelSubscriptionReviewLikeFilterInput) {
    onDeleteReviewLike(filter: $filter) {
      id
      reviewId
      userId
      createdAt
      owner
    }
  }
`;