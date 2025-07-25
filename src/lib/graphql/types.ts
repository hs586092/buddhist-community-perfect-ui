/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateReviewInput = {
  id?: string | null,
  dharmaSessionId: string,
  userId: string,
  rating: number,
  title: string,
  content: string,
  contentQuality?: number | null,
  teachingClarity?: number | null,
  atmosphere?: number | null,
  images?: Array< string | null > | null,
  isVerified?: boolean | null,
  attendanceVerified?: boolean | null,
  likeCount?: number | null,
  commentCount?: number | null,
  helpfulCount?: number | null,
  isPublished?: boolean | null,
  language?: Language | null,
};

export type Language =
  "KOREAN" |
  "ENGLISH" |
  "CHINESE" |
  "JAPANESE";


export type ModelReviewConditionInput = {
  dharmaSessionId?: ModelIDInput | null,
  userId?: ModelIDInput | null,
  rating?: ModelIntInput | null,
  title?: ModelStringInput | null,
  content?: ModelStringInput | null,
  contentQuality?: ModelIntInput | null,
  teachingClarity?: ModelIntInput | null,
  atmosphere?: ModelIntInput | null,
  images?: ModelStringInput | null,
  isVerified?: ModelBooleanInput | null,
  attendanceVerified?: ModelBooleanInput | null,
  likeCount?: ModelIntInput | null,
  commentCount?: ModelIntInput | null,
  helpfulCount?: ModelIntInput | null,
  isPublished?: ModelBooleanInput | null,
  language?: ModelLanguageInput | null,
  and?: Array< ModelReviewConditionInput | null > | null,
  or?: Array< ModelReviewConditionInput | null > | null,
  not?: ModelReviewConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelAttributeTypes =
  "_null" |
  "_bool" |
  "_num" |
  "_s" |
  "_l" |
  "_m" |
  "_bs" |
  "_ns" |
  "_ss";


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type ModelLanguageInput = {
  eq?: Language | null,
  ne?: Language | null,
};

export type Review = {
  __typename: "Review",
  id: string,
  dharmaSessionId: string,
  dharmaSession: DharmaSession,
  userId: string,
  user: User,
  rating: number,
  title: string,
  content: string,
  contentQuality?: number | null,
  teachingClarity?: number | null,
  atmosphere?: number | null,
  images?: Array< string | null > | null,
  isVerified?: boolean | null,
  attendanceVerified?: boolean | null,
  comments: ModelCommentConnection,
  likes: ModelReviewLikeConnection,
  reports: ModelReviewReportConnection,
  likeCount?: number | null,
  commentCount?: number | null,
  helpfulCount?: number | null,
  isPublished: boolean,
  language: Language,
  createdAt: string,
  updatedAt: string,
  owner?: string | null,
};

export type DharmaSession = {
  __typename: "DharmaSession",
  id: string,
  title: string,
  temple: string,
  monk: string,
  date: string,
  duration?: number | null,
  capacity?: number | null,
  description?: string | null,
  category: DharmaCategory,
  tags?: Array< string | null > | null,
  language: Language,
  images?: Array< string | null > | null,
  audioUrl?: string | null,
  videoUrl?: string | null,
  reviews: ModelReviewConnection,
  attendees: ModelAttendanceConnection,
  avgRating?: number | null,
  reviewCount?: number | null,
  attendeeCount?: number | null,
  status: SessionStatus,
  isOnline: boolean,
  onlineUrl?: string | null,
  createdBy: string,
  isActive: boolean,
  isFeatured?: boolean | null,
  createdAt: string,
  updatedAt: string,
};

export type DharmaCategory =
  "MEDITATION" |
  "SUTRA_STUDY" |
  "DHARMA_TALK" |
  "CEREMONY" |
  "RETREAT" |
  "DISCUSSION" |
  "CHANTING" |
  "TEA_CEREMONY" |
  "WALKING_MEDITATION" |
  "COMMUNITY_SERVICE";


export type ModelReviewConnection = {
  __typename: "ModelReviewConnection",
  items: Array< Review | null >,
  nextToken?: string | null,
};

export type ModelAttendanceConnection = {
  __typename: "ModelAttendanceConnection",
  items: Array< Attendance | null >,
  nextToken?: string | null,
};

export type Attendance = {
  __typename: "Attendance",
  id: string,
  dharmaSessionId: string,
  dharmaSession: DharmaSession,
  userId: string,
  user: User,
  status: AttendanceStatus,
  checkInTime?: string | null,
  checkOutTime?: string | null,
  notes?: string | null,
  createdAt: string,
  updatedAt: string,
  owner?: string | null,
};

export type User = {
  __typename: "User",
  id: string,
  username: string,
  email: string,
  fullName?: string | null,
  temple?: string | null,
  dharmaName?: string | null,
  level: UserLevel,
  joinDate: string,
  profileImage?: string | null,
  practiceYears?: number | null,
  specialties?: Array< PracticeSpecialty | null > | null,
  reviews: ModelReviewConnection,
  posts: ModelPostConnection,
  chatMessages: ModelChatMessageConnection,
  meditationSessions: ModelMeditationSessionConnection,
  following: ModelFollowConnection,
  followers: ModelFollowConnection,
  reviewCount?: number | null,
  postCount?: number | null,
  meditationMinutes?: number | null,
  isActive: boolean,
  notifications?: NotificationSettings | null,
  privacy?: PrivacySettings | null,
  createdAt: string,
  updatedAt: string,
  owner?: string | null,
};

export type UserLevel =
  "SEEKER" |
  "PRACTITIONER" |
  "EXPERIENCED" |
  "GUIDE" |
  "TEACHER" |
  "MASTER";


export type PracticeSpecialty =
  "MEDITATION" |
  "SUTRA_STUDY" |
  "CHANTING" |
  "MINDFULNESS" |
  "YOGA" |
  "TEA_CEREMONY";


export type ModelPostConnection = {
  __typename: "ModelPostConnection",
  items: Array< Post | null >,
  nextToken?: string | null,
};

export type Post = {
  __typename: "Post",
  id: string,
  authorId: string,
  author: User,
  title: string,
  content: string,
  excerpt?: string | null,
  category: PostCategory,
  tags?: Array< string | null > | null,
  images?: Array< string | null > | null,
  attachments?: Array< string | null > | null,
  comments: ModelPostCommentConnection,
  likes: ModelPostLikeConnection,
  viewCount?: number | null,
  likeCount?: number | null,
  commentCount?: number | null,
  shareCount?: number | null,
  status: PostStatus,
  isPinned?: boolean | null,
  isFeatured?: boolean | null,
  createdAt: string,
  updatedAt: string,
  owner?: string | null,
};

export type PostCategory =
  "DISCUSSION" |
  "QUESTION" |
  "SHARING" |
  "NEWS" |
  "EVENT" |
  "STUDY" |
  "MEDITATION" |
  "DAILY_LIFE";


export type ModelPostCommentConnection = {
  __typename: "ModelPostCommentConnection",
  items: Array< PostComment | null >,
  nextToken?: string | null,
};

export type PostComment = {
  __typename: "PostComment",
  id: string,
  postId: string,
  post: Post,
  userId: string,
  user: User,
  content: string,
  parentCommentId?: string | null,
  createdAt: string,
  updatedAt: string,
  owner?: string | null,
};

export type ModelPostLikeConnection = {
  __typename: "ModelPostLikeConnection",
  items: Array< PostLike | null >,
  nextToken?: string | null,
};

export type PostLike = {
  __typename: "PostLike",
  id: string,
  postId: string,
  post: Post,
  userId: string,
  user: User,
  createdAt: string,
  owner?: string | null,
};

export type PostStatus =
  "DRAFT" |
  "PUBLISHED" |
  "HIDDEN" |
  "DELETED";


export type ModelChatMessageConnection = {
  __typename: "ModelChatMessageConnection",
  items: Array< ChatMessage | null >,
  nextToken?: string | null,
};

export type ChatMessage = {
  __typename: "ChatMessage",
  id: string,
  chatRoomId: string,
  chatRoom: ChatRoom,
  userId: string,
  user: User,
  content: string,
  messageType: MessageType,
  mediaUrl?: string | null,
  mediaType?: string | null,
  reactions: ModelMessageReactionConnection,
  isEdited?: boolean | null,
  isDeleted?: boolean | null,
  createdAt: string,
  updatedAt: string,
  owner?: string | null,
};

export type ChatRoom = {
  __typename: "ChatRoom",
  id: string,
  name: string,
  description?: string | null,
  type: ChatRoomType,
  category: ChatCategory,
  members: ModelChatMemberConnection,
  messages: ModelChatMessageConnection,
  maxMembers?: number | null,
  isActive: boolean,
  memberCount?: number | null,
  messageCount?: number | null,
  createdAt: string,
  updatedAt: string,
};

export type ChatRoomType =
  "PUBLIC" |
  "PRIVATE" |
  "DIRECT_MESSAGE";


export type ChatCategory =
  "GENERAL" |
  "MEDITATION" |
  "STUDY" |
  "TEMPLE_LIFE" |
  "BEGINNERS" |
  "ADVANCED";


export type ModelChatMemberConnection = {
  __typename: "ModelChatMemberConnection",
  items: Array< ChatMember | null >,
  nextToken?: string | null,
};

export type ChatMember = {
  __typename: "ChatMember",
  id: string,
  chatRoomId: string,
  chatRoom: ChatRoom,
  userId: string,
  user: User,
  role: ChatRole,
  joinedAt: string,
  lastReadAt?: string | null,
  createdAt: string,
  updatedAt: string,
};

export type ChatRole =
  "ADMIN" |
  "MODERATOR" |
  "MEMBER";


export type MessageType =
  "TEXT" |
  "IMAGE" |
  "FILE" |
  "AUDIO" |
  "SYSTEM";


export type ModelMessageReactionConnection = {
  __typename: "ModelMessageReactionConnection",
  items: Array< MessageReaction | null >,
  nextToken?: string | null,
};

export type MessageReaction = {
  __typename: "MessageReaction",
  id: string,
  messageId: string,
  message: ChatMessage,
  userId: string,
  user: User,
  reaction: string,
  createdAt: string,
};

export type ModelMeditationSessionConnection = {
  __typename: "ModelMeditationSessionConnection",
  items: Array< MeditationSession | null >,
  nextToken?: string | null,
};

export type MeditationSession = {
  __typename: "MeditationSession",
  id: string,
  userId: string,
  user: User,
  title?: string | null,
  type: MeditationType,
  duration: number,
  scheduledDate?: string | null,
  actualStartTime?: string | null,
  actualEndTime?: string | null,
  notes?: string | null,
  mood?: MoodLevel | null,
  focus?: FocusLevel | null,
  insights?: string | null,
  guidedBy?: string | null,
  audioGuide?: string | null,
  status: SessionStatus,
  isCompleted: boolean,
  createdAt: string,
  updatedAt: string,
  owner?: string | null,
};

export type MeditationType =
  "SITTING" |
  "WALKING" |
  "CHANTING" |
  "BREATHING" |
  "MINDFULNESS" |
  "LOVING_KINDNESS" |
  "BODY_SCAN" |
  "VISUALIZATION";


export type MoodLevel =
  "VERY_LOW" |
  "LOW" |
  "NEUTRAL" |
  "HIGH" |
  "VERY_HIGH";


export type FocusLevel =
  "VERY_POOR" |
  "POOR" |
  "AVERAGE" |
  "GOOD" |
  "EXCELLENT";


export type SessionStatus =
  "SCHEDULED" |
  "ONGOING" |
  "COMPLETED" |
  "CANCELLED" |
  "POSTPONED";


export type ModelFollowConnection = {
  __typename: "ModelFollowConnection",
  items: Array< Follow | null >,
  nextToken?: string | null,
};

export type Follow = {
  __typename: "Follow",
  id: string,
  followerId: string,
  follower: User,
  followingId: string,
  following: User,
  createdAt: string,
  owner?: string | null,
};

export type NotificationSettings = {
  __typename: "NotificationSettings",
  reviews: boolean,
  comments: boolean,
  mentions: boolean,
  follows: boolean,
  dharmaUpdates: boolean,
};

export type PrivacySettings = {
  __typename: "PrivacySettings",
  profileVisibility: VisibilityLevel,
  reviewVisibility: VisibilityLevel,
  practiceVisibility: VisibilityLevel,
};

export type VisibilityLevel =
  "PUBLIC" |
  "FRIENDS" |
  "PRIVATE";


export type AttendanceStatus =
  "REGISTERED" |
  "CHECKED_IN" |
  "ATTENDED" |
  "NO_SHOW" |
  "CANCELLED";


export type ModelCommentConnection = {
  __typename: "ModelCommentConnection",
  items: Array< Comment | null >,
  nextToken?: string | null,
};

export type Comment = {
  __typename: "Comment",
  id: string,
  reviewId: string,
  review: Review,
  userId: string,
  user: User,
  parentCommentId?: string | null,
  parentComment?: Comment | null,
  replies: ModelCommentConnection,
  content: string,
  likes: ModelCommentLikeConnection,
  likeCount?: number | null,
  isActive: boolean,
  createdAt: string,
  updatedAt: string,
  owner?: string | null,
};

export type ModelCommentLikeConnection = {
  __typename: "ModelCommentLikeConnection",
  items: Array< CommentLike | null >,
  nextToken?: string | null,
};

export type CommentLike = {
  __typename: "CommentLike",
  id: string,
  commentId: string,
  comment: Comment,
  userId: string,
  user: User,
  createdAt: string,
  owner?: string | null,
};

export type ModelReviewLikeConnection = {
  __typename: "ModelReviewLikeConnection",
  items: Array< ReviewLike | null >,
  nextToken?: string | null,
};

export type ReviewLike = {
  __typename: "ReviewLike",
  id: string,
  reviewId: string,
  review: Review,
  userId: string,
  user: User,
  createdAt: string,
  owner?: string | null,
};

export type ModelReviewReportConnection = {
  __typename: "ModelReviewReportConnection",
  items: Array< ReviewReport | null >,
  nextToken?: string | null,
};

export type ReviewReport = {
  __typename: "ReviewReport",
  id: string,
  reviewId: string,
  review: Review,
  reporterId: string,
  reporter: User,
  reason: ReportReason,
  description?: string | null,
  status: ReportStatus,
  createdAt: string,
  updatedAt: string,
  owner?: string | null,
};

export type ReportReason =
  "INAPPROPRIATE_CONTENT" |
  "SPAM" |
  "HARASSMENT" |
  "FALSE_INFORMATION" |
  "COPYRIGHT_VIOLATION" |
  "OTHER";


export type ReportStatus =
  "PENDING" |
  "REVIEWED" |
  "RESOLVED" |
  "REJECTED";


export type UpdateReviewInput = {
  id: string,
  dharmaSessionId?: string | null,
  userId?: string | null,
  rating?: number | null,
  title?: string | null,
  content?: string | null,
  contentQuality?: number | null,
  teachingClarity?: number | null,
  atmosphere?: number | null,
  images?: Array< string | null > | null,
  isVerified?: boolean | null,
  attendanceVerified?: boolean | null,
  likeCount?: number | null,
  commentCount?: number | null,
  helpfulCount?: number | null,
  isPublished?: boolean | null,
  language?: Language | null,
};

export type DeleteReviewInput = {
  id: string,
};

export type ModelDharmaSessionFilterInput = {
  id?: ModelIDInput | null,
  title?: ModelStringInput | null,
  temple?: ModelStringInput | null,
  monk?: ModelStringInput | null,
  date?: ModelStringInput | null,
  duration?: ModelIntInput | null,
  capacity?: ModelIntInput | null,
  description?: ModelStringInput | null,
  category?: ModelDharmaCategoryInput | null,
  tags?: ModelStringInput | null,
  language?: ModelLanguageInput | null,
  images?: ModelStringInput | null,
  audioUrl?: ModelStringInput | null,
  videoUrl?: ModelStringInput | null,
  avgRating?: ModelFloatInput | null,
  reviewCount?: ModelIntInput | null,
  attendeeCount?: ModelIntInput | null,
  status?: ModelSessionStatusInput | null,
  isOnline?: ModelBooleanInput | null,
  onlineUrl?: ModelStringInput | null,
  createdBy?: ModelStringInput | null,
  isActive?: ModelBooleanInput | null,
  isFeatured?: ModelBooleanInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelDharmaSessionFilterInput | null > | null,
  or?: Array< ModelDharmaSessionFilterInput | null > | null,
  not?: ModelDharmaSessionFilterInput | null,
};

export type ModelDharmaCategoryInput = {
  eq?: DharmaCategory | null,
  ne?: DharmaCategory | null,
};

export type ModelFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type ModelSessionStatusInput = {
  eq?: SessionStatus | null,
  ne?: SessionStatus | null,
};

export type ModelDharmaSessionConnection = {
  __typename: "ModelDharmaSessionConnection",
  items: Array< DharmaSession | null >,
  nextToken?: string | null,
};

export type ModelReviewFilterInput = {
  id?: ModelIDInput | null,
  dharmaSessionId?: ModelIDInput | null,
  userId?: ModelIDInput | null,
  rating?: ModelIntInput | null,
  title?: ModelStringInput | null,
  content?: ModelStringInput | null,
  contentQuality?: ModelIntInput | null,
  teachingClarity?: ModelIntInput | null,
  atmosphere?: ModelIntInput | null,
  images?: ModelStringInput | null,
  isVerified?: ModelBooleanInput | null,
  attendanceVerified?: ModelBooleanInput | null,
  likeCount?: ModelIntInput | null,
  commentCount?: ModelIntInput | null,
  helpfulCount?: ModelIntInput | null,
  isPublished?: ModelBooleanInput | null,
  language?: ModelLanguageInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelReviewFilterInput | null > | null,
  or?: Array< ModelReviewFilterInput | null > | null,
  not?: ModelReviewFilterInput | null,
};

export type CreateReviewMutation = {
  __typename: "Review",
  id: string,
  dharmaSessionId: string,
  dharmaSession: DharmaSession,
  userId: string,
  user: User,
  rating: number,
  title: string,
  content: string,
  contentQuality?: number | null,
  teachingClarity?: number | null,
  atmosphere?: number | null,
  images?: Array< string | null > | null,
  isVerified?: boolean | null,
  attendanceVerified?: boolean | null,
  comments: ModelCommentConnection,
  likes: ModelReviewLikeConnection,
  reports: ModelReviewReportConnection,
  likeCount?: number | null,
  commentCount?: number | null,
  helpfulCount?: number | null,
  isPublished: boolean,
  language: Language,
  createdAt: string,
  updatedAt: string,
  owner?: string | null,
};

export type UpdateReviewMutation = {
  __typename: "Review",
  id: string,
  dharmaSessionId: string,
  dharmaSession: DharmaSession,
  userId: string,
  user: User,
  rating: number,
  title: string,
  content: string,
  contentQuality?: number | null,
  teachingClarity?: number | null,
  atmosphere?: number | null,
  images?: Array< string | null > | null,
  isVerified?: boolean | null,
  attendanceVerified?: boolean | null,
  comments: ModelCommentConnection,
  likes: ModelReviewLikeConnection,
  reports: ModelReviewReportConnection,
  likeCount?: number | null,
  commentCount?: number | null,
  helpfulCount?: number | null,
  isPublished: boolean,
  language: Language,
  createdAt: string,
  updatedAt: string,
  owner?: string | null,
};

export type DeleteReviewMutation = {
  __typename: "Review",
  id: string,
  dharmaSessionId: string,
  dharmaSession: DharmaSession,
  userId: string,
  user: User,
  rating: number,
  title: string,
  content: string,
  contentQuality?: number | null,
  teachingClarity?: number | null,
  atmosphere?: number | null,
  images?: Array< string | null > | null,
  isVerified?: boolean | null,
  attendanceVerified?: boolean | null,
  comments: ModelCommentConnection,
  likes: ModelReviewLikeConnection,
  reports: ModelReviewReportConnection,
  likeCount?: number | null,
  commentCount?: number | null,
  helpfulCount?: number | null,
  isPublished: boolean,
  language: Language,
  createdAt: string,
  updatedAt: string,
  owner?: string | null,
};

export type ListDharmaSessionsQuery = {
  __typename: "ModelDharmaSessionConnection",
  items: Array< {
    __typename: "DharmaSession",
    id: string,
    title: string,
    temple: string,
    monk: string,
    date: string,
    duration?: number | null,
    capacity?: number | null,
    description?: string | null,
    category: DharmaCategory,
    tags?: Array< string | null > | null,
    language: Language,
    images?: Array< string | null > | null,
    audioUrl?: string | null,
    videoUrl?: string | null,
    avgRating?: number | null,
    reviewCount?: number | null,
    attendeeCount?: number | null,
    status: SessionStatus,
    isOnline: boolean,
    onlineUrl?: string | null,
    createdBy: string,
    isActive: boolean,
    isFeatured?: boolean | null,
    createdAt: string,
    updatedAt: string,
  } | null >,
  nextToken?: string | null,
};

export type ListReviewsQuery = {
  __typename: "ModelReviewConnection",
  items: Array< {
    __typename: "Review",
    id: string,
    dharmaSessionId: string,
    userId: string,
    rating: number,
    title: string,
    content: string,
    contentQuality?: number | null,
    teachingClarity?: number | null,
    atmosphere?: number | null,
    images?: Array< string | null > | null,
    isVerified?: boolean | null,
    attendanceVerified?: boolean | null,
    likeCount?: number | null,
    commentCount?: number | null,
    helpfulCount?: number | null,
    isPublished: boolean,
    language: Language,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null >,
  nextToken?: string | null,
};

export type GetDharmaSessionQuery = {
  __typename: "DharmaSession",
  id: string,
  title: string,
  temple: string,
  monk: string,
  date: string,
  duration?: number | null,
  capacity?: number | null,
  description?: string | null,
  category: DharmaCategory,
  tags?: Array< string | null > | null,
  language: Language,
  images?: Array< string | null > | null,
  audioUrl?: string | null,
  videoUrl?: string | null,
  reviews: {
    __typename: "ModelReviewConnection",
    nextToken?: string | null,
  },
  attendees: {
    __typename: "ModelAttendanceConnection",
    nextToken?: string | null,
  },
  avgRating?: number | null,
  reviewCount?: number | null,
  attendeeCount?: number | null,
  status: SessionStatus,
  isOnline: boolean,
  onlineUrl?: string | null,
  createdBy: string,
  isActive: boolean,
  isFeatured?: boolean | null,
  createdAt: string,
  updatedAt: string,
};

export type GetReviewQuery = {
  __typename: "Review",
  id: string,
  dharmaSessionId: string,
  dharmaSession: DharmaSession,
  userId: string,
  user: User,
  rating: number,
  title: string,
  content: string,
  contentQuality?: number | null,
  teachingClarity?: number | null,
  atmosphere?: number | null,
  images?: Array< string | null > | null,
  isVerified?: boolean | null,
  attendanceVerified?: boolean | null,
  comments: ModelCommentConnection,
  likes: ModelReviewLikeConnection,
  reports: ModelReviewReportConnection,
  likeCount?: number | null,
  commentCount?: number | null,
  helpfulCount?: number | null,
  isPublished: boolean,
  language: Language,
  createdAt: string,
  updatedAt: string,
  owner?: string | null,
};

export type OnCreateReviewSubscription = {
  __typename: "Review",
  id: string,
  dharmaSessionId: string,
  dharmaSession: DharmaSession,
  userId: string,
  user: User,
  rating: number,
  title: string,
  content: string,
  contentQuality?: number | null,
  teachingClarity?: number | null,
  atmosphere?: number | null,
  images?: Array< string | null > | null,
  isVerified?: boolean | null,
  attendanceVerified?: boolean | null,
  comments: ModelCommentConnection,
  likes: ModelReviewLikeConnection,
  reports: ModelReviewReportConnection,
  likeCount?: number | null,
  commentCount?: number | null,
  helpfulCount?: number | null,
  isPublished: boolean,
  language: Language,
  createdAt: string,
  updatedAt: string,
  owner?: string | null,
};

export type OnUpdateReviewSubscription = {
  __typename: "Review",
  id: string,
  dharmaSessionId: string,
  dharmaSession: DharmaSession,
  userId: string,
  user: User,
  rating: number,
  title: string,
  content: string,
  contentQuality?: number | null,
  teachingClarity?: number | null,
  atmosphere?: number | null,
  images?: Array< string | null > | null,
  isVerified?: boolean | null,
  attendanceVerified?: boolean | null,
  comments: ModelCommentConnection,
  likes: ModelReviewLikeConnection,
  reports: ModelReviewReportConnection,
  likeCount?: number | null,
  commentCount?: number | null,
  helpfulCount?: number | null,
  isPublished: boolean,
  language: Language,
  createdAt: string,
  updatedAt: string,
  owner?: string | null,
};

export type OnDeleteReviewSubscription = {
  __typename: "Review",
  id: string,
  dharmaSessionId: string,
  dharmaSession: DharmaSession,
  userId: string,
  user: User,
  rating: number,
  title: string,
  content: string,
  contentQuality?: number | null,
  teachingClarity?: number | null,
  atmosphere?: number | null,
  images?: Array< string | null > | null,
  isVerified?: boolean | null,
  attendanceVerified?: boolean | null,
  comments: ModelCommentConnection,
  likes: ModelReviewLikeConnection,
  reports: ModelReviewReportConnection,
  likeCount?: number | null,
  commentCount?: number | null,
  helpfulCount?: number | null,
  isPublished: boolean,
  language: Language,
  createdAt: string,
  updatedAt: string,
  owner?: string | null,
};