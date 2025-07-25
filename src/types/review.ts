/**
 * 법회 리뷰 타입 정의
 */

export interface DharmaReview {
  id: string
  dharmaName: string      // 법회명
  date: string           // 법회 날짜
  location: string       // 장소 (절명, 사찰명)
  reviewContent: string  // 리뷰 내용
  createdAt: string     // 작성일
  authorName?: string   // 작성자명 (선택사항)
}

export interface ReviewFormData {
  dharmaName: string
  date: string
  location: string
  reviewContent: string
  authorName?: string
}