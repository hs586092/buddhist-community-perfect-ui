import React, { useState } from 'react';
import { Upload, X, AlertCircle, Star } from 'lucide-react';
import { Rating } from './Rating';
import { CreateReviewForm, DharmaSession } from '../../types';

interface ReviewFormProps {
  session: DharmaSession;
  onSubmit: (reviewData: CreateReviewForm) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  className?: string;
}

interface FormData {
  rating: number;
  title: string;
  content: string;
  contentQuality: number;
  teachingClarity: number;
  atmosphere: number;
  images: File[];
}

interface FormErrors {
  rating?: string;
  title?: string;
  content?: string;
  contentQuality?: string;
  teachingClarity?: string;
  atmosphere?: string;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  session,
  onSubmit,
  onCancel,
  isSubmitting = false,
  className = ''
}) => {
  const [formData, setFormData] = useState<FormData>({
    rating: 0,
    title: '',
    content: '',
    contentQuality: 0,
    teachingClarity: 0,
    atmosphere: 0,
    images: []
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isDragging, setIsDragging] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (formData.rating === 0) {
      newErrors.rating = '전체 평점을 선택해주세요';
    }

    if (!formData.title.trim()) {
      newErrors.title = '리뷰 제목을 입력해주세요';
    } else if (formData.title.length > 100) {
      newErrors.title = '제목은 100자 이내로 입력해주세요';
    }

    if (!formData.content.trim()) {
      newErrors.content = '리뷰 내용을 입력해주세요';
    } else if (formData.content.length < 20) {
      newErrors.content = '내용은 20자 이상 입력해주세요';
    } else if (formData.content.length > 2000) {
      newErrors.content = '내용은 2000자 이내로 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const reviewData: CreateReviewForm = {
      dharmaSessionId: session.id,
      rating: formData.rating,
      title: formData.title,
      content: formData.content,
      contentQuality: formData.contentQuality || undefined,
      teachingClarity: formData.teachingClarity || undefined,
      atmosphere: formData.atmosphere || undefined,
      images: formData.images.length > 0 ? formData.images : undefined
    };

    try {
      await onSubmit(reviewData);
    } catch (error) {
      console.error('Review submission failed:', error);
    }
  };

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;

    const newImages: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        newImages.push(file);
      }
    }

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages].slice(0, 5) // 최대 5개
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleImageUpload(e.dataTransfer.files);
  };

  return (
    <div className={`max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6 ${className}`}>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">리뷰 작성</h2>
          <p className="text-gray-600 mt-1">{session.title}</p>
        </div>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 전체 평점 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            전체 평점 <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-4">
            <Rating
              value={formData.rating}
              onChange={(rating) => setFormData(prev => ({ ...prev, rating }))}
              size="lg"
            />
            <span className="text-lg font-medium text-gray-900">
              {formData.rating > 0 ? `${formData.rating}점` : '평점을 선택하세요'}
            </span>
          </div>
          {errors.rating && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.rating}
            </p>
          )}
        </div>

        {/* 세부 평가 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              내용 품질
            </label>
            <Rating
              value={formData.contentQuality}
              onChange={(rating) => setFormData(prev => ({ ...prev, contentQuality: rating }))}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              설법 명확성
            </label>
            <Rating
              value={formData.teachingClarity}
              onChange={(rating) => setFormData(prev => ({ ...prev, teachingClarity: rating }))}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              분위기
            </label>
            <Rating
              value={formData.atmosphere}
              onChange={(rating) => setFormData(prev => ({ ...prev, atmosphere: rating }))}
            />
          </div>
        </div>

        {/* 리뷰 제목 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            리뷰 제목 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="법회에 대한 간단한 요약을 입력하세요"
            className={`
              w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              ${errors.title ? 'border-red-300' : 'border-gray-300'}
            `}
            maxLength={100}
          />
          <div className="flex justify-between mt-1">
            {errors.title && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.title}
              </p>
            )}
            <p className="text-sm text-gray-500 ml-auto">
              {formData.title.length}/100
            </p>
          </div>
        </div>

        {/* 리뷰 내용 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            리뷰 내용 <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            placeholder="법회 경험, 느낀 점, 다른 분들께 도움이 될 만한 내용을 자세히 작성해주세요"
            rows={6}
            className={`
              w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              ${errors.content ? 'border-red-300' : 'border-gray-300'}
            `}
            maxLength={2000}
          />
          <div className="flex justify-between mt-1">
            {errors.content && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.content}
              </p>
            )}
            <p className="text-sm text-gray-500 ml-auto">
              {formData.content.length}/2000
            </p>
          </div>
        </div>

        {/* 이미지 업로드 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            사진 첨부 (선택사항)
          </label>
          
          <div
            className={`
              border-2 border-dashed rounded-lg p-6 text-center transition-colors
              ${isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              이미지를 드래그하거나 클릭하여 업로드하세요
            </p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files)}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
            >
              파일 선택
            </label>
            <p className="text-xs text-gray-500 mt-1">
              최대 5개, 각 10MB 이하
            </p>
          </div>

          {/* 업로드된 이미지 미리보기 */}
          {formData.images.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {formData.images.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Upload preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 제출 버튼 */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            disabled={isSubmitting}
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '작성 중...' : '리뷰 작성'}
          </button>
        </div>
      </form>
    </div>
  );
};