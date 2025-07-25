/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getDharmaSession = /* GraphQL */ `
  query GetDharmaSession($id: ID!) {
    getDharmaSession(id: $id) {
      id
      title
      temple
      monk
      date
      duration
      capacity
      description
      category
      tags
      language
      images
      audioUrl
      videoUrl
      avgRating
      reviewCount
      attendeeCount
      status
      isOnline
      onlineUrl
      createdBy
      isActive
      isFeatured
      createdAt
      updatedAt
    }
  }
`;

export const listDharmaSessions = /* GraphQL */ `
  query ListDharmaSessions(
    $filter: ModelDharmaSessionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDharmaSessions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        temple
        monk
        date
        duration
        capacity
        description
        category
        tags
        language
        images
        audioUrl
        videoUrl
        avgRating
        reviewCount
        attendeeCount
        status
        isOnline
        onlineUrl
        createdBy
        isActive
        isFeatured
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const getReview = /* GraphQL */ `
  query GetReview($id: ID!) {
    getReview(id: $id) {
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

export const listReviews = /* GraphQL */ `
  query ListReviews(
    $filter: ModelReviewFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listReviews(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        dharmaSessionId
        userId
        user {
          id
          username
          level
          profileImage
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
      nextToken
    }
  }
`;

export const reviewsByDharmaSession = /* GraphQL */ `
  query ReviewsByDharmaSession(
    $dharmaSessionId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelReviewFilterInput
    $limit: Int
    $nextToken: String
  ) {
    reviewsByDharmaSession(
      dharmaSessionId: $dharmaSessionId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        dharmaSessionId
        userId
        user {
          id
          username
          level
          profileImage
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
      nextToken
    }
  }
`;

export const reviewsByUser = /* GraphQL */ `
  query ReviewsByUser(
    $userId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelReviewFilterInput
    $limit: Int
    $nextToken: String
  ) {
    reviewsByUser(
      userId: $userId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        dharmaSessionId
        dharmaSession {
          id
          title
          temple
          monk
          category
          status
        }
        userId
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
      nextToken
    }
  }
`;