export interface NutrientInfo {
  carbs: number;    // g
  protein: number;  // g
  fat: number;      // g
}

export interface MenuItem {
  name: string;
  calories: number;
  nutrients: NutrientInfo;
  isAllergen?: boolean;
  allergenDetail?: string;
  category: 'rice' | 'soup' | 'side' | 'dessert' | 'etc';
}

export interface DailyMeal {
  id: string;
  schoolName: string;
  dateStr: string;     // e.g., "5월 15일 금요일"
  dateKey: string;     // e.g., "20260515"
  dayOfWeek: string;   // e.g., "월", "화", "수", "목", "금"
  mealType: 'lunch' | 'dinner';
  title: string;       // e.g., "치즈돈까스 정식"
  dishes: string[];    // e.g., ["치즈돈까스", "친환경현미밥", ...]
  totalCalories: number;
  nutrition: NutrientInfo;
  allergens: string[];
}

export interface DailyMealPack {
  dateKey: string;
  dateStr: string;
  dayOfWeek: string;
  isWeekend?: boolean;
  isNextMealOfWeekend?: boolean;
  lunch: DailyMeal;
  dinner: DailyMeal;
}

export type ActiveTab = 'home' | 'schedule' | 'calculator' | 'profile';
