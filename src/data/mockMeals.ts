import { DailyMealPack, MenuItem, DailyMeal } from '../types';
import { formatDateKey, formatKoreanDate, getKoreanDayOfWeek } from '../utils/dateUtils';

// Helper to convert dishes to rich item list for nutrition calculation
export function getRichMenuItemsForMeal(meal: DailyMeal): MenuItem[] {
  // Let's map dishes to rich items with details
  return meal.dishes.map((dish) => {
    let calories = 50;
    let carbs = 5;
    let protein = 1;
    let fat = 1;
    let tag = '';
    let category: MenuItem['category'] = 'side';

    const cleanDish = dish.trim();

    if (cleanDish.includes('밥')) {
      calories = 300;
      carbs = 65;
      protein = 6;
      fat = 1;
      tag = '탄수화물 65g';
      category = 'rice';
    } else if (cleanDish.includes('국') || cleanDish.includes('찌개') || cleanDish.includes('탕')) {
      calories = 150;
      carbs = 12;
      protein = 8;
      fat = 6;
      tag = cleanDish.includes('돈') || cleanDish.includes('돼지') ? '돼지고기 함유' : '소고기 함유';
      category = 'soup';
    } else if (cleanDish.includes('돈까스') || cleanDish.includes('돈가스')) {
      calories = 380;
      carbs = 30;
      protein = 18;
      fat = 16;
      tag = '치즈 및 돈육 함유';
      category = 'side';
    } else if (cleanDish.includes('강정') || cleanDish.includes('제육') || cleanDish.includes('고기') || cleanDish.includes('불고기') || cleanDish.includes('스테이크')) {
      calories = 240;
      carbs = 14;
      protein = 14;
      fat = 12;
      tag = '육류 선별 가공';
      category = 'side';
    } else if (cleanDish.includes('김치') || cleanDish.includes('깍두기') || cleanDish.includes('단무지') || cleanDish.includes('무침')) {
      calories = 35;
      carbs = 6;
      protein = 1;
      fat = 0.2;
      tag = '식이섬유 일품';
      category = 'side';
    } else if (cleanDish.includes('요구르트') || cleanDish.includes('쥬스') || cleanDish.includes('주스') || cleanDish.includes('귤') || cleanDish.includes('우유') || cleanDish.includes('콘드레싱')) {
      calories = 80;
      carbs = 18;
      protein = 1;
      fat = 0.5;
      tag = '달콤한 디저트';
      category = 'dessert';
    } else {
      calories = 120;
      carbs = 15;
      protein = 5;
      fat = 4;
      tag = '신선 반찬';
      category = 'side';
    }

    return {
      name: cleanDish,
      calories,
      nutrients: { carbs, protein, fat },
      category,
      allergenDetail: tag || undefined,
      isAllergen: tag.includes('함유')
    };
  });
}

export function generateMockMealsForWeek(mondayDate: Date): DailyMealPack[] {
  const packs: DailyMealPack[] = [];
  const dayNames = ['월', '화', '수', '목', '금'];
  
  // Custom meal patterns for 5 school days
  const patterns = [
    // Monday (Mon)
    {
      lunchTitle: '수재치킨까스 정식',
      lunchDishes: ['수제치킨가스', '친환경오분도미밥', '얼큰순두부찌개', '풋고추된장무침', '깍두기'],
      lunchCalories: 810,
      lunchNutrition: { protein: 28, carbs: 105, fat: 22 },
      lunchAllergens: ['대두', '밀', '닭고기'],
      dinnerTitle: '무공해날치알비빔밥',
      dinnerDishes: ['날치알비빔밥', '우유장국', '순살양념치킨', '단무지', '배추김치'],
      dinnerCalories: 750,
      dinnerNutrition: { protein: 24, carbs: 98, fat: 18 },
      dinnerAllergens: ['난류', '대두', '밀', '닭고기']
    },
    // Tuesday (Tue)
    {
      lunchTitle: '고기듬뿍 김치찌개 정식',
      lunchDishes: ['보리밥', '돼지고기 김치찌개', '양파제육볶음', '모듬쌈 & 쌈장', '열무김치'],
      lunchCalories: 830,
      lunchNutrition: { protein: 30, carbs: 115, fat: 20 },
      lunchAllergens: ['대두', '밀', '돼지고기'],
      dinnerTitle: '소고기규동 덮밥',
      dinnerDishes: ['소고기규동덮밥', '미니우동', '소시지피자빵', '깍두기', '요구르트'],
      dinnerCalories: 780,
      dinnerNutrition: { protein: 28, carbs: 102, fat: 22 },
      dinnerAllergens: ['대두', '밀', '쇠고기', '우유']
    },
    // Wednesday (Wed)
    {
      lunchTitle: '수제함박스테이크',
      lunchDishes: ['혼합잡곡밥', '돈육김치찌개', '수제함박스테이크', '숙주미나리무침', '깍두기', '콘드레싱'],
      lunchCalories: 850,
      lunchNutrition: { protein: 32, carbs: 110, fat: 28 },
      lunchAllergens: ['난류', '우유', '대두', '돼지고기'],
      dinnerTitle: '참치마요덮밥 세트',
      dinnerDishes: ['참치마요덮밥', '미니우동', '단무지무침', '배추김치', '요구르트'],
      dinnerCalories: 720,
      dinnerNutrition: { protein: 26, carbs: 90, fat: 18 },
      dinnerAllergens: ['난류', '우유', '대두', '밀']
    },
    // Thursday (Thu)
    {
      lunchTitle: '치즈돈까스 정식',
      lunchDishes: ['친환경현미밥', '쇠고기미역국', '매콤돈육강정', '숙주미나리무침', '배추김치'],
      lunchCalories: 845,
      lunchNutrition: { protein: 32, carbs: 110, fat: 25 },
      lunchAllergens: ['대두', '밀', '쇠고기', '돼지고기', '우유'],
      dinnerTitle: '스팸마요덮밥과 컵떡볶이',
      dinnerDishes: ['스팸마요덮밥', '가쓰오유부장국', '매콤떡볶이', '깍두기', '요구르트'],
      dinnerCalories: 760,
      dinnerNutrition: { protein: 25, carbs: 108, fat: 20 },
      dinnerAllergens: ['난류', '우유', '대두', '밀', '돼지고기']
    },
    // Friday (Fri)
    {
      lunchTitle: '소불고기 덮밥 정식',
      lunchDishes: ['친환경현미밥', '맑은어묵국', '소불고기볶음', '실부추사과무침', '배추김치', '무농약귤'],
      lunchCalories: 820,
      lunchNutrition: { protein: 35, carbs: 104, fat: 18 },
      lunchAllergens: ['대두', '밀', '쇠고기'],
      dinnerTitle: '베이컨버터볶음밥 정식',
      dinnerDishes: ['베이컨버터볶음밥', '가쓰오장국', '크리스피핫도그', '배추김치', '아이스망고'],
      dinnerCalories: 740,
      dinnerNutrition: { protein: 22, carbs: 101, fat: 21 },
      dinnerAllergens: ['난류', '우유', '대두', '밀', '돼지고기']
    }
  ];

  for (let i = 0; i < 5; i++) {
    // Calculate date for the day of the week
    const currentDate = new Date(mondayDate.getTime() + (i * 24 * 60 * 60 * 1000));
    const dKey = formatDateKey(currentDate);
    const dStr = formatKoreanDate(currentDate);
    const pattern = patterns[i];

    const lunch: DailyMeal = {
      id: `${dKey}_lunch`,
      schoolName: '씨마스고등학교',
      dateStr: dStr,
      dateKey: dKey,
      dayOfWeek: dayNames[i],
      mealType: 'lunch',
      title: pattern.lunchTitle,
      dishes: pattern.lunchDishes,
      totalCalories: pattern.lunchCalories,
      nutrition: pattern.lunchNutrition,
      allergens: pattern.lunchAllergens
    };

    const dinner: DailyMeal = {
      id: `${dKey}_dinner`,
      schoolName: '씨마스고등학교',
      dateStr: dStr,
      dateKey: dKey,
      dayOfWeek: dayNames[i],
      mealType: 'dinner',
      title: pattern.dinnerTitle,
      dishes: pattern.dinnerDishes,
      totalCalories: pattern.dinnerCalories,
      nutrition: pattern.dinnerNutrition,
      allergens: pattern.dinnerAllergens
    };

    packs.push({
      dateKey: dKey,
      dateStr: dStr,
      dayOfWeek: dayNames[i],
      lunch,
      dinner
    });
  }

  return packs;
}
