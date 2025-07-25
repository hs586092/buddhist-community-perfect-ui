/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createReview = /* GraphQL */ `
  mutation CreateReview(
    $input: CreateReviewInput!
    $condition: ModelReviewConditionInput
  ) {
    createReview(input: $input, condition: $condition) {
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

export const updateReview = /* GraphQL */ `
  mutation UpdateReview(
    $input: UpdateReviewInput!
    $condition: ModelReviewConditionInput
  ) {
    updateReview(input: $input, condition: $condition) {
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

export const deleteReview = /* GraphQL */ `
  mutation DeleteReview(
    $input: DeleteReviewInput!
    $condition: ModelReviewConditionInput
  ) {
    deleteReview(input: $input, condition: $condition) {
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

export const createReviewLike = /* GraphQL */ `
  mutation CreateReviewLike(
    $input: CreateReviewLikeInput!
    $condition: ModelReviewLikeConditionInput
  ) {
    createReviewLike(input: $input, condition: $condition) {
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

export const deleteReviewLike = /* GraphQL */ `
  mutation DeleteReviewLike(
    $input: DeleteReviewLikeInput!
    $condition: ModelReviewLikeConditionInput
  ) {
    deleteReviewLike(input: $input, condition: $condition) {
      id
      reviewId
      userId
      createdAt
      owner
    }
  }
`;

export const createComment = /* GraphQL */ `
  mutation CreateComment(
    $input: CreateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    createComment(input: $input, condition: $condition) {
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

export const updateComment = /* GraphQL */ `
  mutation UpdateComment(
    $input: UpdateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    updateComment(input: $input, condition: $condition) {
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

export const deleteComment = /* GraphQL */ `
  mutation DeleteComment(
    $input: DeleteCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    deleteComment(input: $input, condition: $condition) {
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