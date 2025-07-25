/**
 * Lotus Components Storybook Stories
 * 연꽃 컴포넌트들의 시각적 테스트 및 문서화
 */

import type { Meta, StoryObj } from '@storybook/react';
import { LotusBloom, LotusBud, LotusLeaf, LotusIcon } from './index';

// LotusBloom Stories
const meta: Meta<typeof LotusBloom> = {
  title: 'Lotus Components/LotusBloom',
  component: LotusBloom,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '완전히 핀 연꽃 - Hero 섹션이나 메인 영역에 사용'
      }
    }
  },
  argTypes: {
    size: {
      control: { type: 'range', min: 50, max: 200, step: 10 },
      description: '연꽃 크기'
    },
    color: {
      control: 'color',
      description: '연꽃 색상'
    },
    strokeWidth: {
      control: { type: 'range', min: 0.5, max: 3, step: 0.1 },
      description: '선 두께'
    },
    animate: {
      control: 'boolean',
      description: '애니메이션 효과'
    }
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 120,
    color: '#4ade80',
    strokeWidth: 1.5,
    animate: false
  }
};

export const Animated: Story = {
  args: {
    size: 120,
    color: '#6366f1',
    strokeWidth: 1.5,
    animate: true
  }
};

export const Large: Story = {
  args: {
    size: 200,
    color: '#ec4899',
    strokeWidth: 2,
    animate: false
  }
};

// LotusBud Stories
export const BudDefault: Story = {
  render: (args) => <LotusBud {...args} />,
  args: {
    size: 60,
    color: '#10b981',
    strokeWidth: 1.5,
    animate: false
  }
};

export const BudAnimated: Story = {
  render: (args) => <LotusBud {...args} />,
  args: {
    size: 60,
    color: '#3b82f6',
    strokeWidth: 1.5,
    animate: true
  }
};

// LotusLeaf Stories
export const LeafDefault: Story = {
  render: (args) => <LotusLeaf {...args} />,
  args: {
    size: 80,
    color: '#059669',
    strokeWidth: 1.5,
    animate: false,
    rotate: 0
  }
};

export const LeafRotated: Story = {
  render: (args) => <LotusLeaf {...args} />,
  args: {
    size: 80,
    color: '#059669',
    strokeWidth: 1.5,
    animate: false,
    rotate: 45
  }
};

// LotusIcon Stories
export const IconDefault: Story = {
  render: (args) => <LotusIcon {...args} />,
  args: {
    size: 24,
    color: '#6b7280',
    strokeWidth: 1.5,
    filled: false
  }
};

export const IconFilled: Story = {
  render: (args) => <LotusIcon {...args} />,
  args: {
    size: 24,
    color: '#7c3aed',
    strokeWidth: 1.5,
    filled: true
  }
};

// Showcase all components
export const AllComponents: Story = {
  render: () => (
    <div className="flex flex-wrap gap-8 items-center justify-center p-8">
      <div className="text-center">
        <LotusBloom size={100} color="#4ade80" animate={true} />
        <p className="mt-2 text-sm text-gray-600">LotusBloom</p>
      </div>
      <div className="text-center">
        <LotusBud size={60} color="#3b82f6" animate={true} />
        <p className="mt-2 text-sm text-gray-600">LotusBud</p>
      </div>
      <div className="text-center">
        <LotusLeaf size={80} color="#059669" animate={false} />
        <p className="mt-2 text-sm text-gray-600">LotusLeaf</p>
      </div>
      <div className="text-center">
        <LotusIcon size={32} color="#7c3aed" filled={true} />
        <p className="mt-2 text-sm text-gray-600">LotusIcon</p>
      </div>
    </div>
  )
};