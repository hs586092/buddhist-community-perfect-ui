import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { isAmplifyConfigured } from '../lib/amplify';
import type { 
  DharmaSession, 
  Review, 
  CreateReviewInput,
  UpdateReviewInput,
  DeleteReviewInput 
} from '../lib/graphql/types';

const client = generateClient();

// GraphQL 쿼리/뮤테이션 훅
export const useGraphQL = () => {
  const [isConfigured] = useState(isAmplifyConfigured());

  // 법회 세션 조회
  const getDharmaSession = async (id: string): Promise<DharmaSession | null> => {
    if (!isConfigured) {
      console.log('Amplify not configured, returning mock data');
      return null;
    }

    try {
      const result = await client.graphql({
        query: `
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
        `,
        variables: { id }
      });
      
      return (result as any).data?.getDharmaSession;
    } catch (error) {
      console.error('Error fetching dharma session:', error);
      return null;
    }
  };

  // 법회 세션 목록 조회
  const listDharmaSessions = async (filter?: any): Promise<DharmaSession[]> => {
    if (!isConfigured) {
      console.log('Amplify not configured, returning mock data');
      return [];
    }

    try {
      const result = await client.graphql({
        query: `
          query ListDharmaSessions($filter: ModelDharmaSessionFilterInput) {
            listDharmaSessions(filter: $filter) {
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
          }
        `,
        variables: { filter }
      });
      
      return (result as any).data?.listDharmaSessions?.items || [];
    } catch (error) {
      console.error('Error fetching dharma sessions:', error);
      return [];
    }
  };

  // 리뷰 생성
  const createReview = async (input: CreateReviewInput): Promise<Review | null> => {
    if (!isConfigured) {
      console.log('Amplify not configured, simulating review creation');
      return null;
    }

    try {
      const result = await client.graphql({
        query: `
          mutation CreateReview($input: CreateReviewInput!) {
            createReview(input: $input) {
              id
              dharmaSessionId
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
          }
        `,
        variables: { input }
      });
      
      return (result as any).data?.createReview;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  };

  // 리뷰 수정
  const updateReview = async (input: UpdateReviewInput): Promise<Review | null> => {
    if (!isConfigured) {
      console.log('Amplify not configured, simulating review update');
      return null;
    }

    try {
      const result = await client.graphql({
        query: `
          mutation UpdateReview($input: UpdateReviewInput!) {
            updateReview(input: $input) {
              id
              dharmaSessionId
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
          }
        `,
        variables: { input }
      });
      
      return (result as any).data?.updateReview;
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  };

  // 리뷰 삭제
  const deleteReview = async (input: DeleteReviewInput): Promise<boolean> => {
    if (!isConfigured) {
      console.log('Amplify not configured, simulating review deletion');
      return true;
    }

    try {
      await client.graphql({
        query: `
          mutation DeleteReview($input: DeleteReviewInput!) {
            deleteReview(input: $input) {
              id
            }
          }
        `,
        variables: { input }
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting review:', error);
      return false;
    }
  };

  // 특정 법회의 리뷰 목록 조회
  const getReviewsBySession = async (dharmaSessionId: string): Promise<Review[]> => {
    if (!isConfigured) {
      console.log('Amplify not configured, returning mock data');
      return [];
    }

    try {
      const result = await client.graphql({
        query: `
          query ReviewsByDharmaSession($dharmaSessionId: ID!) {
            reviewsByDharmaSession(dharmaSessionId: $dharmaSessionId) {
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
            }
          }
        `,
        variables: { dharmaSessionId }
      });
      
      return (result as any).data?.reviewsByDharmaSession?.items || [];
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
  };

  return {
    isConfigured,
    getDharmaSession,
    listDharmaSessions,
    createReview,
    updateReview,
    deleteReview,
    getReviewsBySession,
  };
};

// 리뷰 데이터 관리 훅
export const useReviews = (dharmaSessionId?: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getReviewsBySession, createReview, updateReview, deleteReview } = useGraphQL();

  // 리뷰 목록 로드
  const loadReviews = async () => {
    if (!dharmaSessionId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await getReviewsBySession(dharmaSessionId);
      setReviews(data);
    } catch (err) {
      setError('리뷰를 불러오는데 실패했습니다');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 리뷰 추가
  const addReview = async (reviewData: Omit<CreateReviewInput, 'dharmaSessionId'>) => {
    if (!dharmaSessionId) return false;

    try {
      const newReview = await createReview({
        ...reviewData,
        dharmaSessionId
      });
      
      if (newReview) {
        setReviews(prev => [newReview, ...prev]);
        return true;
      }
      return false;
    } catch (err) {
      setError('리뷰 작성에 실패했습니다');
      console.error(err);
      return false;
    }
  };

  // 컴포넌트 마운트 시 리뷰 로드
  useEffect(() => {
    loadReviews();
  }, [dharmaSessionId]);

  return {
    reviews,
    loading,
    error,
    loadReviews,
    addReview,
    setReviews,
  };
};

// 법회 세션 데이터 관리 훅
export const useDharmaSessions = () => {
  const [sessions, setSessions] = useState<DharmaSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { listDharmaSessions } = useGraphQL();

  const loadSessions = async (filter?: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await listDharmaSessions(filter);
      setSessions(data);
    } catch (err) {
      setError('법회 목록을 불러오는데 실패했습니다');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  return {
    sessions,
    loading,
    error,
    loadSessions,
    setSessions,
  };
};