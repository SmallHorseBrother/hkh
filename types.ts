
export interface Nutrients {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
}

export interface FoodItem {
  id: string;
  name: string;
  estimatedWeightGrams: number; // 当前数值（用户可能修改过）
  originalWeightGrams: number;  // AI 初始数值（用于计算偏差）
  nutrients: Nutrients;
  consumedPercentage: number; // 0-100
}

export interface FoodScan {
  id: string;
  timestamp: number;
  imageUrl: string;
  description: string;
  insight: string; 
  items: FoodItem[];
  globalScale: number; // 0-100
}

// 重点样本：偏差超过阈值的记录
export interface CriticalSample {
  id: string;
  timestamp: number;
  imageUrl: string;
  foodName: string;
  aiWeight: number;
  userWeight: number;
  deviationPercent: number; // e.g. +50% or -30%
}

// 常餐模版：用户保存的固定搭配
export interface StapleMeal {
  id: string;
  name: string;
  imageUrl: string;
  items: Omit<FoodItem, 'id'>[]; // 存储模版时的组成
  totalCalories: number;
}

export enum AppState {
  IDLE = 'IDLE',
  CAMERA = 'CAMERA',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
  HISTORY = 'HISTORY',
  CRITICAL_SAMPLES = 'CRITICAL_SAMPLES' // 新增状态
}
