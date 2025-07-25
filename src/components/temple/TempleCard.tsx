import React from 'react';
import { Temple } from '../../types/temple';

interface TempleCardProps {
  temple: Temple;
  onClick?: (temple: Temple) => void;
  compact?: boolean;
}

const TempleCard: React.FC<TempleCardProps> = ({ 
  temple, 
  onClick, 
  compact = false 
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(temple);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-sm ${
          i < Math.floor(rating) 
            ? 'text-yellow-400' 
            : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ));
  };

  const getSectColor = (sect: Temple['sect']) => {
    const colors = {
      '조계종': 'bg-amber-100 text-amber-800',
      '천태종': 'bg-purple-100 text-purple-800',
      '진각종': 'bg-blue-100 text-blue-800',
      '태고종': 'bg-green-100 text-green-800',
      '기타': 'bg-gray-100 text-gray-800'
    };
    return colors[sect] || colors['기타'];
  };

  if (compact) {
    return (
      <div
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
        onClick={handleClick}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-gray-900">{temple.name}</h3>
              <span className={`px-2 py-1 text-xs rounded-full ${getSectColor(temple.sect)}`}>
                {temple.sect}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              📍 {temple.location.city} {temple.location.district}
            </p>
            <div className="flex items-center gap-2">
              <div className="flex">
                {renderStars(temple.rating.average)}
              </div>
              <span className="text-sm text-gray-600">
                {temple.rating.average} ({temple.rating.count}개 리뷰)
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
      onClick={handleClick}
    >
      {/* 이미지 영역 - 나중에 실제 이미지로 교체 */}
      <div className="h-48 bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2">🏛️</div>
          <div className="text-sm text-gray-600">{temple.name}</div>
        </div>
      </div>

      <div className="p-6">
        {/* 헤더 */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-amber-600 transition-colors">
              {temple.name}
            </h3>
            <p className="text-sm text-gray-600">
              📍 {temple.location.address}
            </p>
          </div>
          <span className={`px-3 py-1 text-sm rounded-full flex-shrink-0 ${getSectColor(temple.sect)}`}>
            {temple.sect}
          </span>
        </div>

        {/* 설명 */}
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">
          {temple.description}
        </p>

        {/* 서비스 아이콘 */}
        <div className="flex gap-2 mb-4">
          {temple.services.dharmaHall && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              🏛️ 법회
            </span>
          )}
          {temple.services.meditation && (
            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
              🧘‍♀️ 명상
            </span>
          )}
          {temple.services.templestay && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              🏕️ 템플스테이
            </span>
          )}
        </div>

        {/* 평점 및 정보 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex">
              {renderStars(temple.rating.average)}
            </div>
            <span className="font-semibold text-gray-900">
              {temple.rating.average}
            </span>
            <span className="text-sm text-gray-500">
              ({temple.rating.count}개 리뷰)
            </span>
          </div>
          
          {temple.established && (
            <div className="text-xs text-gray-500">
              창건 {temple.established}년
            </div>
          )}
        </div>

        {/* 연락처 */}
        {temple.contact.phone && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="text-xs text-gray-500">
              📞 {temple.contact.phone}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TempleCard;