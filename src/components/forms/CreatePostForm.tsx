/**
 * 영성 글 작성 폼 컴포넌트
 * 새로운 UI 컴포넌트들을 활용한 실제 사용 예제
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Input, Textarea, Select } from '../ui/Input';
import { Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter } from '../ui/Modal';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { cn } from '../../utils/cn';
import { CreatePostFormData, PostType, PostCategory } from '../../types/spiritual';

interface CreatePostFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePostFormData) => Promise<void>;
}

const POST_TYPES: Array<{ value: PostType; label: string }> = [
  { value: 'reflection', label: '성찰/깨달음' },
  { value: 'teaching', label: '법문/가르침' },
  { value: 'experience', label: '경험담' },
  { value: 'guide', label: '가이드/방법론' },
  { value: 'news', label: '소식/공지' },
  { value: 'question', label: '질문/토론' },
  { value: 'poetry', label: '시/게송' }
];

const POST_CATEGORIES: Array<{ value: PostCategory; label: string }> = [
  { value: 'meditation', label: '명상' },
  { value: 'dharma', label: '법문' },
  { value: 'daily_practice', label: '일상 수행' },
  { value: 'temple_life', label: '사찰 생활' },
  { value: 'buddhist_culture', label: '불교 문화' },
  { value: 'philosophy', label: '철학' },
  { value: 'community', label: '커뮤니티' }
];

const POPULAR_TAGS = [
  '명상', '수행', '깨달음', '마음챙김', '자비', '지혜',
  '평안', '고요', '인내', '감사', '용서', '소통',
  '나눔', '봉사', '연결', '조화'
];

export default function CreatePostForm({ isOpen, onClose, onSubmit }: CreatePostFormProps) {
  const [formData, setFormData] = useState<Partial<CreatePostFormData>>({
    title: '',
    content: '',
    type: 'reflection',
    category: 'meditation',
    tags: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTag, setCurrentTag] = useState('');

  const handleInputChange = (field: keyof CreatePostFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 에러 초기화
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddTag = (tag: string) => {
    if (!tag.trim() || formData.tags?.includes(tag.trim())) return;
    
    const newTags = [...(formData.tags || []), tag.trim()];
    handleInputChange('tags', newTags);
    setCurrentTag('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = formData.tags?.filter(tag => tag !== tagToRemove) || [];
    handleInputChange('tags', newTags);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = '제목을 입력해주세요.';
    } else if (formData.title.length < 5) {
      newErrors.title = '제목은 최소 5자 이상이어야 합니다.';
    }

    if (!formData.content?.trim()) {
      newErrors.content = '내용을 입력해주세요.';
    } else if (formData.content.length < 50) {
      newErrors.content = '내용은 최소 50자 이상이어야 합니다.';
    }

    if (!formData.type) {
      newErrors.type = '글 유형을 선택해주세요.';
    }

    if (!formData.category) {
      newErrors.category = '카테고리를 선택해주세요.';
    }

    if (!formData.tags?.length) {
      newErrors.tags = '최소 1개의 태그를 추가해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData as CreatePostFormData);
      // 폼 초기화
      setFormData({
        title: '',
        content: '',
        type: 'reflection',
        category: 'meditation',
        tags: []
      });
      onClose();
    } catch (error) {
      console.error('포스트 작성 실패:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg" closeOnBackdrop={!isSubmitting}>
      <ModalHeader>
        <ModalTitle>새 영성 글 작성</ModalTitle>
      </ModalHeader>

      <ModalContent>
        <div className="space-y-6">
          {/* 기본 정보 섹션 */}
          <Card variant="outline">
            <CardHeader>
              <CardTitle className="text-base">기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 제목 */}
              <Input
                label="제목"
                placeholder="마음을 울리는 제목을 작성해주세요"
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                error={errors.title}
                fullWidth
                maxLength={100}
              />

              {/* 글 유형과 카테고리 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="글 유형"
                  options={POST_TYPES}
                  value={formData.type || ''}
                  onChange={(e) => handleInputChange('type', e.target.value as PostType)}
                  error={errors.type}
                  fullWidth
                />

                <Select
                  label="카테고리"
                  options={POST_CATEGORIES}
                  value={formData.category || ''}
                  onChange={(e) => handleInputChange('category', e.target.value as PostCategory)}
                  error={errors.category}
                  fullWidth
                />
              </div>
            </CardContent>
          </Card>

          {/* 내용 섹션 */}
          <Card variant="outline">
            <CardHeader>
              <CardTitle className="text-base">글 내용</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                label="내용"
                placeholder="당신의 영적 여정을 나누어주세요. 깊은 성찰과 지혜를 담아 작성해주시면 많은 분들에게 도움이 될 것입니다."
                value={formData.content || ''}
                onChange={(e) => handleInputChange('content', e.target.value)}
                error={errors.content}
                rows={8}
                fullWidth
                description={`현재 ${formData.content?.length || 0}자 (최소 50자 필요)`}
              />
            </CardContent>
          </Card>

          {/* 태그 섹션 */}
          <Card variant="outline">
            <CardHeader>
              <CardTitle className="text-base">태그</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 태그 입력 */}
              <div className="flex gap-2">
                <Input
                  placeholder="태그를 입력하고 Enter를 누르세요"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag(currentTag);
                    }
                  }}
                  className="flex-1"
                />
                <Button 
                  onClick={() => handleAddTag(currentTag)}
                  disabled={!currentTag.trim()}
                  variant="outline"
                >
                  추가
                </Button>
              </div>

              {/* 추가된 태그들 */}
              {formData.tags && formData.tags.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-sage-800">선택된 태그:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <motion.span
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-serenity-100 text-serenity-800 rounded-full text-sm font-medium"
                      >
                        #{tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="text-serenity-600 hover:text-serenity-800 transition-colors"
                        >
                          ×
                        </button>
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}

              {/* 인기 태그 제안 */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-sage-800">인기 태그:</p>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_TAGS.filter(tag => !formData.tags?.includes(tag)).map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleAddTag(tag)}
                      className="px-3 py-1 bg-sage-50 text-sage-700 rounded-full text-sm hover:bg-sage-100 transition-colors"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>

              {errors.tags && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <span>⚠️</span>
                  {errors.tags}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </ModalContent>

      <ModalFooter>
        <Button variant="ghost" onClick={handleClose} disabled={isSubmitting}>
          취소
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit} 
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          {isSubmitting ? '작성 중...' : '글 작성'}
        </Button>
      </ModalFooter>
    </Modal>
  );
}