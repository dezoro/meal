import { useState, useEffect } from 'react';
import { 
  getTodayKST, 
  formatKoreanDate, 
  formatDateKey, 
  getWeekDates, 
  getWeekOfMonth, 
  getDefaultSelectedDate,
  getKoreanDayOfWeek
} from './utils/dateUtils';
import { generateMockMealsForWeek, getRichMenuItemsForMeal } from './data/mockMeals';
import { ActiveTab, DailyMealPack, DailyMeal } from './types';
import { 
  ChefHat, 
  Bell, 
  Calendar, 
  Heart, 
  Flame, 
  Calculator, 
  User, 
  Settings, 
  ChevronRight, 
  LogOut, 
  Check, 
  Star,
  Sparkles,
  Info
} from 'lucide-react';

export default function App() {
  // 1. Core State
  const [todayKST] = useState<Date>(() => getTodayKST());
  const [activeDate, setActiveDate] = useState<Date>(() => getDefaultSelectedDate(getTodayKST()));
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  
  // 2. Meal packs list generated for the active week
  const [mealPacks, setMealPacks] = useState<DailyMealPack[]>([]);
  
  // 3. User interaction state
  const [likedMeals, setLikedMeals] = useState<Record<string, boolean>>({});
  const [selectedDishes, setSelectedDishes] = useState<string[]>([]);
  const [calculatorFilter, setCalculatorFilter] = useState<string>('전체');
  
  // Allergy, notifications interactive settings
  const [allergyAlert, setAllergyAlert] = useState<boolean>(true);
  const [dailyMealAlert, setDailyMealAlert] = useState<boolean>(true);
  
  // Saved profiles trigger popup
  const [savedCalculatorToast, setSavedCalculatorToast] = useState<string | null>(null);

  // Initialize and update meal packs when active week changes
  const activeDateKey = formatDateKey(activeDate);
  const activeWeekMonday = getWeekDates(activeDate)[0];
  const mondayKey = formatDateKey(activeWeekMonday);

  useEffect(() => {
    // Generate meal packs for the selected date's week
    const packs = generateMockMealsForWeek(activeWeekMonday);
    setMealPacks(packs);
  }, [mondayKey]);

  // Sync selected dishes in calculator to match currently active date's Lunch
  useEffect(() => {
    const activePack = mealPacks.find(pack => pack.dateKey === activeDateKey);
    if (activePack) {
      // Auto pre-select all lunch dishes
      setSelectedDishes(activePack.lunch.dishes);
    }
  }, [activeDateKey, mealPacks]);

  // Find the selected day's pack, or default to the closest available
  const selectedPack = mealPacks.find(pack => pack.dateKey === activeDateKey) || mealPacks[0];

  // Check if "today" is weekend
  const todayDay = todayKST.getUTCDay();
  const isWeekendToday = todayDay === 0 || todayDay === 6;

  // Meal list for horizontally scrolling selector
  // Always render the weekdays of today's current week
  const todayWeekMonday = getWeekDates(todayKST)[0];
  const todayWeekPacks = generateMockMealsForWeek(todayWeekMonday);

  // Handle heart click to toggle favorites
  const toggleLike = (mealId: string) => {
    setLikedMeals(prev => ({
      ...prev,
      [mealId]: !prev[mealId]
    }));
  };

  // Helper to show saved confirmation message
  const triggerSaveNotification = () => {
    setSavedCalculatorToast("영양계산 결과 가 기록되었습니다! 대시보드에 반영됩니다.");
    setTimeout(() => {
      setSavedCalculatorToast(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background text-on-background select-none pb-24 md:pb-6 font-sans">
      
      {/* TopAppBar: Remains consistent across all views */}
      <header className="fixed top-0 left-0 w-full z-50 h-16 bg-background dark:bg-on-background border-b border-surface-container flex justify-between items-center px-4 md:px-12 backdrop-blur-md bg-opacity-95">
        <div className="flex items-center gap-2 text-primary">
          <ChefHat className="w-6 h-6 fill-primary" />
          <h1 className="font-bold text-lg md:text-xl tracking-tight text-primary">
            씨마스고등학교 급식
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          {isWeekendToday && activeTab === 'home' && (
            <span className="hidden sm:inline-flex items-center gap-1 text-xs bg-secondary-container text-on-secondary-container px-2.5 py-1 rounded-full font-medium">
              <Calendar className="w-3.5 h-3.5" />
              다음 급식일 자동 연동
            </span>
          )}
          <button className="p-2 text-primary hover:opacity-80 transition-transform active:scale-90">
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-[768px] md:max-w-[1200px] mx-auto px-4 pt-20 pb-12 flex flex-col gap-6">
        
        {/* TAB 1: HOME SCREEN */}
        {activeTab === 'home' && selectedPack && (
          <div className="flex flex-col gap-6 animate-fade-in">
            
            {/* Weekend Notice (방식 B implementation) */}
            {isWeekendToday && (
              <div className="bg-secondary-container/30 border border-secondary-container text-on-secondary-container p-4 rounded-xl flex items-start gap-3">
                <Info className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                <div className="text-sm">
                  <span className="font-bold block text-secondary">오늘은 맛있는 주말입니다! 🍕</span>
                  <p className="opacity-90">
                    화면이 비지 않도록, 다음 가장 가까운 급식일인 <strong className="underline text-primary">{formatKoreanDate(activeDate)}</strong>의 메뉴 슬롯을 보여 드리고 있습니다.
                  </p>
                </div>
              </div>
            )}

            {/* HeroMealCard (오늘의 추천 메뉴) */}
            <section className="relative bg-surface-container-low rounded-xl overflow-hidden shadow-ambient-low group transition-all duration-300">
              <div className="h-64 md:h-96 w-full relative">
                <img 
                  alt="오늘의 추천 메뉴 이미지" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoV46Z0wC9P0PQj4EgQFPDhr8RGaUXXify3tQPOO8dd7nQlufAAoqaYPQ35nxmUw_YcZDHc92xfPzNF3hKBdKAZ_CTST67dNG3qRWfcs2yDDSWKhXfrA72MMHGSNBotonWHACWa17sMF5W77muCZPdhvDBob9JcgZ2pmRgX2ZCv_QwKMy3OMjXVJhpyLzBBrJlVo73Mgm37VR7lipawjBYFCDzjC8maNjjRhc-JdVBFmKrXgXh-VIhuHROQwqSRVuEHk51ix-mcKc"
                  referrerPolicy="no-referrer"
                />
                
                {/* Gradient tint over hero card */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                
                {/* Star rating label overlay */}
                <div className="absolute top-4 left-4 bg-tertiary-fixed text-on-tertiary-fixed-variant px-3 py-1 rounded-full text-xs font-medium shadow-ambient-high flex items-center gap-1.5 border border-white/20">
                  <Star className="w-3.5 h-3.5 fill-on-tertiary-fixed-variant text-on-tertiary-fixed-variant" />
                  오늘의 추천 급식
                </div>

                {isWeekendToday && (
                  <div className="absolute top-4 right-4 bg-primary text-on-primary text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1 shadow-md">
                    <Sparkles className="w-3.5 h-3.5" />
                    다음 급식일 식단
                  </div>
                )}

                {/* Bottom title details */}
                <div className="absolute bottom-6 left-6 right-6 text-white flex justify-between items-end">
                  <div>
                    <p className="text-xs text-white/80 font-medium mb-1 drop-shadow-sm">
                      {selectedPack.dateStr}
                    </p>
                    <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white drop-shadow-md">
                      {selectedPack.lunch.title}
                    </h2>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="bg-primary/90 backdrop-blur-sm text-on-primary px-3 py-1.5 rounded-full text-xs font-bold border border-white/20 shadow-sm whitespace-nowrap">
                      {selectedPack.lunch.totalCalories} kcal
                    </span>
                    <button 
                      onClick={() => toggleLike(selectedPack.lunch.id)}
                      className="bg-white/20 backdrop-blur-md p-2.5 rounded-full hover:bg-white/30 transition-all border border-white/10 shadow-sm flex items-center justify-center cursor-pointer active:scale-90"
                    >
                      <Heart 
                        className={`w-5 h-5 transition-colors ${likedMeals[selectedPack.lunch.id] ? 'fill-red-500 text-red-500 scale-110' : 'text-white'}`} 
                      />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Home Horizontal Date Carousel Selection */}
            <section className="w-full py-1">
              <span className="text-xs font-medium text-primary block mb-2 px-1">📅 급식 요일 빠르게 보기</span>
              <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
                {todayWeekPacks.map((pack) => {
                  const isCurrentActive = pack.dateKey === activeDateKey;
                  const packDate = new Date(
                    parseInt(pack.dateKey.substring(0, 4)),
                    parseInt(pack.dateKey.substring(4, 6)) - 1,
                    parseInt(pack.dateKey.substring(6, 8))
                  );
                  return (
                    <button
                      key={pack.dateKey}
                      onClick={() => setActiveDate(packDate)}
                      className={`whitespace-nowrap px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-250 cursor-pointer ${
                        isCurrentActive 
                          ? 'bg-primary text-on-primary shadow-ambient-high scale-[1.03] border-b-2 border-primary-container'
                          : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                      }`}
                    >
                      {pack.dateKey.substring(6, 8)}일 ({pack.dayOfWeek})
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Meals Grid (Lunch & Dinner layout) */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* 중식 (Lunch) Card */}
              <article className="bg-surface rounded-xl shadow-ambient-low p-6 border border-surface-container flex flex-col gap-4 relative overflow-hidden group">
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-secondary-fixed rounded-full blur-[40px] opacity-20 pointer-events-none"></div>
                
                <header className="flex justify-between items-center border-b border-surface-container-high pb-3 z-10">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
                    <h3 className="text-xl font-bold text-primary">중식</h3>
                  </div>
                  <div className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full text-xs font-medium border border-outline-variant/30 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-primary" />
                    {selectedPack.lunch.totalCalories} kcal
                  </div>
                </header>

                <div className="z-10 bg-white/60 dark:bg-on-surface/5 rounded-xl p-5 flex-grow border border-surface-container/60 backdrop-blur-sm">
                  <ul className="text-base text-on-surface space-y-3">
                    {selectedPack.lunch.dishes.map((dish, idx) => {
                      // Highlights 3rd item as main course dish just like markup screenshot
                      const isMainDish = idx === 2;
                      return (
                        <li 
                          key={dish}
                          className={`flex items-center gap-2 ${isMainDish ? 'font-bold text-primary' : 'text-on-surface/90'}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isMainDish ? 'bg-primary' : 'bg-primary/40'}`}></span>
                          {dish}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <footer className="z-10 mt-2 border-t border-surface-container-high pt-3">
                  <h4 className="text-xs font-medium text-outline mb-2">알레르기 정보 및 경고</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPack.lunch.allergens.map((allergy) => (
                      <span 
                        key={allergy}
                        className="bg-error-container/40 text-on-error-container px-2.5 py-1 rounded-lg text-xs font-medium border border-error-container/30"
                      >
                        {allergy}
                      </span>
                    ))}
                  </div>
                </footer>
              </article>

              {/* 석식 (Dinner) Card */}
              <article className="bg-surface rounded-xl shadow-ambient-low p-6 border border-surface-container flex flex-col gap-4 relative overflow-hidden group">
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary-container rounded-full blur-[40px] opacity-10 pointer-events-none"></div>

                <header className="flex justify-between items-center border-b border-surface-container-high pb-3 z-10">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    <h3 className="text-xl font-bold text-primary">석식</h3>
                  </div>
                  <div className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full text-xs font-medium border border-outline-variant/30 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-secondary" />
                    {selectedPack.dinner.totalCalories} kcal
                  </div>
                </header>

                <div className="z-10 bg-white/60 dark:bg-on-surface/5 rounded-xl p-5 flex-grow border border-surface-container/60 backdrop-blur-sm">
                  <ul className="text-base text-on-surface space-y-3">
                    {selectedPack.dinner.dishes.map((dish, idx) => {
                      const isMainDish = idx === 0;
                      return (
                        <li 
                          key={dish}
                          className={`flex items-center gap-2 ${isMainDish ? 'font-bold text-primary' : 'text-on-surface/90'}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isMainDish ? 'bg-primary' : 'bg-primary/40'}`}></span>
                          {dish}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <footer className="z-10 mt-2 border-t border-surface-container-high pt-3">
                  <h4 className="text-xs font-medium text-outline mb-2">알레르기 정보 및 경고</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPack.dinner.allergens.map((allergy) => (
                      <span 
                        key={allergy}
                        className="bg-error-container/40 text-on-error-container px-2.5 py-1 rounded-lg text-xs font-medium border border-error-container/30"
                      >
                        {allergy}
                      </span>
                    ))}
                  </div>
                </footer>
              </article>

            </section>
          </div>
        )}

        {/* TAB 2: MEAL CALENDAR TABLE (식단표) */}
        {activeTab === 'schedule' && selectedPack && (
          <div className="flex flex-col gap-6 animate-fade-in">
            {/* Header info */}
            <section className="flex flex-col gap-1 px-1">
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">주간 식단 대시보드</span>
              {/* Dynamic M월 N주차 calculation based on active date */}
              <h2 className="text-3xl font-extrabold text-on-background tracking-tight">
                {getWeekOfMonth(activeDate).month}월 {getWeekOfMonth(activeDate).week}주차
              </h2>
            </section>

            {/* Week Date selector - Mon to Fri dynamically calculated */}
            <section className="bg-surface border border-surface-container p-4 rounded-xl shadow-ambient-low">
              <div className="grid grid-cols-5 gap-2 md:gap-4 justify-items-center">
                {mealPacks.map((pack) => {
                  const isDayActive = pack.dateKey === activeDateKey;
                  const packDate = new Date(
                    parseInt(pack.dateKey.substring(0, 4)),
                    parseInt(pack.dateKey.substring(4, 6)) - 1,
                    parseInt(pack.dateKey.substring(6, 8))
                  );
                  return (
                    <button
                      key={pack.dateKey}
                      onClick={() => setActiveDate(packDate)}
                      className={`w-full max-w-20 aspect-[4/5] rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                        isDayActive
                          ? 'bg-primary text-on-primary shadow-ambient-high scale-105 border-b-2 border-primary-container'
                          : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      <span className="text-xs font-medium opacity-80 mb-1">{pack.dayOfWeek}</span>
                      <span className="text-base md:text-lg font-bold">{pack.dateKey.substring(6, 8)}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Weekly Detailed Cards (with Protein Goal Bars) */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Lunch Calendar detailed view */}
              <article className="bg-surface-container-lowest border border-surface-container rounded-xl p-6 shadow-ambient-low hover:shadow-ambient-high transition-all flex flex-col gap-4 relative overflow-hidden group">
                <div className="absolute -top-20 -right-20 w-48 h-48 bg-tertiary-fixed rounded-full opacity-15 blur-3xl pointer-events-none"></div>
                
                <div className="flex justify-between items-start z-10">
                  <h3 className="text-xl font-bold text-primary">중식</h3>
                  <span className="text-xs font-semibold text-outline bg-surface-container px-3 py-1 rounded-full border border-surface-container-high shadow-sm">
                    {selectedPack.lunch.totalCalories} kcal
                  </span>
                </div>

                <div className="z-10 flex-grow">
                  <ul className="text-base text-on-surface space-y-2.5">
                    {selectedPack.lunch.dishes.map((dish, idx) => {
                      const isMain = idx === 2;
                      return (
                        <li key={dish} className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${isMain ? 'bg-primary' : 'bg-primary-container/50'}`}></span>
                          <span className={isMain ? 'text-primary font-bold' : 'text-on-surface'}>{dish}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-2 z-10">
                  {selectedPack.lunch.allergens.map((allergy) => (
                    <span key={allergy} className="bg-surface-container text-on-surface-variant text-xs px-2.5 py-1 rounded-full">
                      {allergy}
                    </span>
                  ))}
                </div>

                <div className="mt-auto pt-4 border-t border-surface-container z-10">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-semibold text-on-surface-variant">단백질 달성률</span>
                    <span className="text-xs font-bold text-primary">85%</span>
                  </div>
                  <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden shadow-inner">
                    <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </article>

              {/* Dinner Calendar detailed view */}
              <article className="bg-tertiary-fixed border border-tertiary-container/10 rounded-xl p-6 shadow-ambient-low hover:shadow-ambient-high transition-all flex flex-col gap-4 relative overflow-hidden group">
                <div className="flex justify-between items-start z-10">
                  <h3 className="text-xl font-bold text-tertiary">석식</h3>
                  <span className="text-xs font-semibold text-tertiary/80 bg-surface-container-lowest/55 px-3 py-1 rounded-full shadow-sm">
                    {selectedPack.dinner.totalCalories} kcal
                  </span>
                </div>

                <div className="z-10 flex-grow">
                  <ul className="text-base text-on-tertiary-fixed-variant space-y-2.5">
                    {selectedPack.dinner.dishes.map((dish) => (
                      <li key={dish} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container/50"></span>
                        <span className="text-on-tertiary-fixed-variant">{dish}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto pt-4 border-t border-tertiary-fixed-dim/30 z-10">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-semibold text-on-tertiary-fixed-variant/80">단백질 달성률</span>
                    <span className="text-xs font-bold text-tertiary">60%</span>
                  </div>
                  <div className="w-full bg-surface-container-lowest/40 rounded-full h-2 overflow-hidden shadow-inner">
                    <div className="bg-tertiary/60 h-2 rounded-full transition-all duration-500" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </article>

            </section>
          </div>
        )}

        {/* TAB 3: NUTRITION CALCULATOR (영양 계산) */}
        {activeTab === 'calculator' && selectedPack && (
          <div className="flex flex-col gap-6 animate-fade-in relative">
            
            {/* Custom Interactive Floating Success Toast */}
            {savedCalculatorToast && (
              <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-primary text-on-primary font-bold px-6 py-3 rounded-full shadow-lg z-50 flex items-center gap-2 animate-bounce">
                <Check className="w-4 h-4 fill-white text-primary" />
                {savedCalculatorToast}
              </div>
            )}

            {/* NutritionSummaryCard (Sticky panel at the top) */}
            <section className="bg-surface/90 backdrop-blur-md rounded-xl p-6 border border-surface-container-high shadow-ambient-low">
              <div className="flex justify-between items-end mb-4 border-b border-surface-container pb-4">
                <div>
                  <h2 className="text-xl font-bold text-primary flex items-center gap-1.5">
                    <Calculator className="w-5 h-5 text-primary" />
                    오늘의 선택 영양 ({formatKoreanDate(activeDate).split(' ')[1] + ' ' + formatKoreanDate(activeDate).split(' ')[2]})
                  </h2>
                  <p className="text-xs text-on-surface-variant">
                    선택한 중식 밥상을 기반으로 직접 칼로리 조절을 해보세요.
                  </p>
                </div>
                <div className="text-right">
                  {/* Calulate total calories based on selected rich items */}
                  <span className="text-3xl font-extrabold text-primary">
                    {getRichMenuItemsForMeal(selectedPack.lunch)
                      .filter(item => selectedDishes.includes(item.name))
                      .reduce((sum, item) => sum + item.calories, 0)}
                  </span>
                  <span className="text-sm font-medium text-on-surface-variant ml-1">kcal</span>
                </div>
              </div>

              {/* Progress bars for Carbohydrates, Protein, Fats */}
              <div className="space-y-4">
                {/* Carbs */}
                <div>
                  <div className="flex justify-between text-sm font-medium mb-1">
                    <span className="text-on-surface-variant flex items-center gap-1">탄수화물</span>
                    <span className="text-tertiary font-bold">
                      {getRichMenuItemsForMeal(selectedPack.lunch)
                        .filter(item => selectedDishes.includes(item.name))
                        .reduce((sum, item) => sum + item.nutrients.carbs, 0)}g
                    </span>
                  </div>
                  <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="bg-tertiary h-full rounded-full transition-all duration-300" 
                      style={{ 
                        width: `${Math.min(
                          100, 
                          (getRichMenuItemsForMeal(selectedPack.lunch)
                            .filter(item => selectedDishes.includes(item.name))
                            .reduce((sum, item) => sum + item.nutrients.carbs, 0) / 120) * 100
                        )}%` 
                      }}
                    ></div>
                  </div>
                </div>

                {/* Protein */}
                <div>
                  <div className="flex justify-between text-sm font-medium mb-1">
                    <span className="text-on-surface-variant">단백질</span>
                    <span className="text-primary font-bold">
                      {getRichMenuItemsForMeal(selectedPack.lunch)
                        .filter(item => selectedDishes.includes(item.name))
                        .reduce((sum, item) => sum + item.nutrients.protein, 0)}g
                    </span>
                  </div>
                  <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="bg-primary h-full rounded-full transition-all duration-300" 
                      style={{ 
                        width: `${Math.min(
                          100, 
                          (getRichMenuItemsForMeal(selectedPack.lunch)
                            .filter(item => selectedDishes.includes(item.name))
                            .reduce((sum, item) => sum + item.nutrients.protein, 0) / 40) * 100
                        )}%` 
                      }}
                    ></div>
                  </div>
                </div>

                {/* Fat */}
                <div>
                  <div className="flex justify-between text-sm font-medium mb-1">
                    <span className="text-on-surface-variant">지방</span>
                    <span className="text-secondary font-bold">
                      {getRichMenuItemsForMeal(selectedPack.lunch)
                        .filter(item => selectedDishes.includes(item.name))
                        .reduce((sum, item) => sum + item.nutrients.fat, 0)}g
                    </span>
                  </div>
                  <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="bg-secondary h-full rounded-full transition-all duration-300" 
                      style={{ 
                        width: `${Math.min(
                          100, 
                          (getRichMenuItemsForMeal(selectedPack.lunch)
                            .filter(item => selectedDishes.includes(item.name))
                            .reduce((sum, item) => sum + item.nutrients.fat, 0) / 30) * 100
                        )}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </section>

            {/* MenuFilterChips with active filters */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {['전체', '밥류', '국/찌개', '반찬', '디저트'].map((chip) => {
                const isSelected = calculatorFilter === chip;
                return (
                  <button
                    key={chip}
                    onClick={() => setCalculatorFilter(chip)}
                    className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold shadow-sm transition-transform active:scale-95 cursor-pointer ${
                      isSelected 
                        ? 'bg-primary text-on-primary' 
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-variant'
                    }`}
                  >
                    {chip}
                  </button>
                );
              })}
            </div>

            {/* Selectable Ingredients List dynamically populated from activeDate Lunch */}
            <div className="flex flex-col gap-4">
              {getRichMenuItemsForMeal(selectedPack.lunch)
                .filter((item) => {
                  if (calculatorFilter === '전체') return true;
                  if (calculatorFilter === '밥류') return item.category === 'rice';
                  if (calculatorFilter === '국/찌개') return item.category === 'soup';
                  if (calculatorFilter === '반찬') return item.category === 'side';
                  if (calculatorFilter === '디저트') return item.category === 'dessert';
                  return true;
                })
                .map((item) => {
                  const isSelected = selectedDishes.includes(item.name);
                  
                  // Toggle dishes selection
                  const handleToggleDish = () => {
                    if (isSelected) {
                      setSelectedDishes(prev => prev.filter(name => name !== item.name));
                    } else {
                      setSelectedDishes(prev => [...prev, item.name]);
                    }
                  };

                  return (
                    <button
                      key={item.name}
                      onClick={handleToggleDish}
                      className={`flex items-center justify-between p-5 rounded-xl border-2 transition-all cursor-pointer text-left active:scale-[0.98] ${
                        isSelected
                          ? 'border-primary bg-primary-container/10'
                          : 'border-transparent bg-surface-container-low hover:bg-surface-container'
                      }`}
                    >
                      <div className="flex-1">
                        <h3 className={`text-lg font-bold mb-1 ${isSelected ? 'text-primary' : 'text-on-surface'}`}>
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-on-surface-variant flex-wrap">
                          <span className="bg-surface-container px-2 py-1 rounded-md font-medium">
                            {item.calories} kcal
                          </span>
                          {item.allergenDetail && (
                            <span className={`px-2 py-1 rounded-md font-medium ${item.isAllergen ? 'bg-error-container text-on-error-container' : 'bg-surface-container'}`}>
                              {item.allergenDetail}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        isSelected 
                          ? 'bg-primary text-on-primary shadow-sm' 
                          : 'border-2 border-outline-variant text-transparent bg-white'
                      }`}>
                        <Check className="w-5 h-5 stroke-[2.5px]" />
                      </div>
                    </button>
                  );
                })}
            </div>

            {/* Float Bottom Fixed Calc Button */}
            <div className="mt-8">
              <button 
                onClick={triggerSaveNotification}
                className="w-full bg-primary text-on-primary font-bold py-4 rounded-full shadow-[0_10px_30px_rgba(42,36,26,0.15)] hover:bg-surface-tint active:scale-95 transition-all text-base md:text-lg cursor-pointer"
              >
                계산 결과 저장하기
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: PROFILE SCREEN (프로필) */}
        {activeTab === 'profile' && (
          <div className="flex flex-col gap-6 animate-fade-in">
            {/* Header Settings row */}
            <section className="flex justify-between items-center px-1">
              <h2 className="text-2xl font-bold text-primary">마이 페이지</h2>
              <button className="p-2 text-outline hover:opacity-80 transition-transform active:scale-95">
                <Settings className="w-5 h-5 text-outline" />
              </button>
            </section>

            {/* Profile Avatar Card with standard styles */}
            <section className="relative rounded-xl p-6 overflow-hidden flex flex-col items-center text-center shadow-[0_20px_40px_-15px_rgba(79,111,0,0.1)] bg-gradient-to-br from-surface-container-lowest to-tertiary-fixed border border-surface-container-high">
              <div className="relative mb-4">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-surface-container-lowest shadow-md bg-white">
                  <img 
                    alt="Student Profile" 
                    className="w-full h-full object-cover" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOkLNT8L81bU2p6u15AAlMtrK2P7j3wGAFhe1EPdR8H_K66Smiy_RaEM2mz1r0FB0qnxppU5frjMw2qes1Vjrv--G9lJPrwU--YmgX-kGI266AbDz_059B6iASUA-ItfXyCAYoXBnsLChawNfRL47T_q9sA-WR4EE0FXIjNv3hupPV8seHI8kbHTU_d4Kxu_XsM93GpvH61fXT1Xl2J9XwnaTHEEhoR26244JIEjCcCj47bMyyGI4YbwEai8V2wspoav7O-oYavEg"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {/* Float Camera Edit Badge */}
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-lg hover:bg-surface-tint transition-colors active:scale-95 cursor-pointer border border-white/25">
                  <span className="text-xs font-bold">수정</span>
                </button>
              </div>

              <h2 className="text-2xl font-bold text-primary mb-1">김학생</h2>
              <p className="text-sm font-medium text-on-surface-variant">2학년 3반 15번</p>
            </section>

            {/* Interactive Alert/Settings list cards */}
            <section className="flex flex-col gap-4">
              <h3 className="text-lg font-bold text-on-surface px-1">설정 및 알림</h3>
              
              <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-ambient-low border border-surface-container-high divide-y divide-surface-container-high">
                
                {/* Allergy Setting Toggle */}
                <div className="flex items-center justify-between p-5 hover:bg-surface-container-low transition-colors">
                  <div className="flex flex-col gap-1">
                    <span className="text-base font-bold text-on-surface flex items-center gap-1.5">
                      알레르기 경고 알림
                    </span>
                    <div className="flex gap-1.5 mt-1">
                      <span className="px-3 py-1 bg-surface-container rounded-full text-xs font-medium text-on-surface-variant">우유</span>
                      <span className="px-3 py-1 bg-surface-container rounded-full text-xs font-medium text-on-surface-variant">땅콩</span>
                    </div>
                  </div>
                  
                  {/* Custom Toggle Switch wrapper */}
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={allergyAlert}
                      onChange={() => setAllergyAlert(!allergyAlert)}
                    />
                    <div className="w-13 h-7 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container border border-outline-variant/30"></div>
                  </label>
                </div>

                {/* Daily meal notification */}
                <div className="flex items-center justify-between p-5 hover:bg-surface-container-low transition-colors">
                  <div className="flex flex-col gap-1">
                    <span className="text-base font-bold text-on-surface">일일 식단 알림</span>
                    <span className="text-xs text-on-surface-variant font-medium">매일 아침 8시 식단 정보 푸시 알림</span>
                  </div>
                  
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={dailyMealAlert}
                      onChange={() => setDailyMealAlert(!dailyMealAlert)}
                    />
                    <div className="w-13 h-7 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container border border-outline-variant/30"></div>
                  </label>
                </div>

                {/* Customer Service Link page */}
                <button className="w-full flex items-center justify-between p-5 hover:bg-surface-container text-left active:bg-surface-container-high transition-colors cursor-pointer">
                  <span className="text-base font-bold text-on-surface">고객센터 / 문의하기</span>
                  <ChevronRight className="w-5 h-5 text-outline" />
                </button>

                {/* Terms of Use links */}
                <button className="w-full flex items-center justify-between p-5 hover:bg-surface-container text-left active:bg-surface-container-high transition-colors cursor-pointer">
                  <span className="text-base font-bold text-on-surface">이용약관</span>
                  <ChevronRight className="w-5 h-5 text-outline" />
                </button>

                {/* Logout row red action */}
                <button className="w-full flex items-center justify-between p-5 hover:bg-error-container/40 text-left active:bg-error-container transition-colors group cursor-pointer">
                  <span className="text-base font-bold text-error group-hover:text-on-error-container transition-colors">
                    로그아웃 및 서비스 종료
                  </span>
                  <LogOut className="w-5 h-5 text-error group-hover:text-on-error-container transition-colors" />
                </button>

              </div>
            </section>

            {/* Footer containing credentials */}
            <footer className="mt-8 py-6 text-center border-t border-surface-container">
              <p className="text-xs text-outline font-medium mb-1">© 2026 씨마스고등학교 급식</p>
              <p className="text-xs text-outline-variant">건강하고 활기찬 고교 배식 라이프를 디자인합니다.</p>
            </footer>
          </div>
        )}

      </main>

      {/* Bottom Fixed Navigation Bar -> Fluid container, hides on tablet/large screens if requested, but matches mobile perfectly */}
      <nav className="fixed bottom-0 left-0 w-full z-50 h-16 bg-surface-container dark:bg-inverse-surface border-t border-surface-container-high flex justify-around items-center px-4 pb-safe shadow-lg rounded-t-2xl">
        
        {/* Nav Item 1: 홈 */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center rounded-xl py-1 px-4 transition-all duration-200 cursor-pointer ${
            activeTab === 'home'
              ? 'bg-secondary-container text-on-secondary-container scale-105 shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-variant'
          }`}
        >
          <ChefHat className={`w-5 h-5 mb-0.5 ${activeTab === 'home' ? 'fill-on-secondary-container' : ''}`} />
          <span className="text-[11px] font-bold">홈</span>
        </button>

        {/* Nav Item 2: 식단표 */}
        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex flex-col items-center justify-center rounded-xl py-1 px-4 transition-all duration-200 cursor-pointer ${
            activeTab === 'schedule'
              ? 'bg-secondary-container text-on-secondary-container scale-105 shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-variant'
          }`}
        >
          <Calendar className={`w-5 h-5 mb-0.5 ${activeTab === 'schedule' ? 'fill-none' : ''}`} />
          <span className="text-[11px] font-bold">식단표</span>
        </button>

        {/* Nav Item 3: 영양계산 */}
        <button
          onClick={() => setActiveTab('calculator')}
          className={`flex flex-col items-center justify-center rounded-xl py-1 px-4 transition-all duration-200 cursor-pointer ${
            activeTab === 'calculator'
              ? 'bg-secondary-container text-on-secondary-container scale-105 shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-variant'
          }`}
        >
          <Calculator className={`w-5 h-5 mb-0.5 ${activeTab === 'calculator' ? 'fill-none' : ''}`} />
          <span className="text-[11px] font-bold">영양계산</span>
        </button>

        {/* Nav Item 4: 프로필 */}
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center rounded-xl py-1 px-4 transition-all duration-200 cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-secondary-container text-on-secondary-container scale-105 shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-variant'
          }`}
        >
          <User className={`w-5 h-5 mb-0.5 ${activeTab === 'profile' ? 'fill-on-secondary-container' : ''}`} />
          <span className="text-[11px] font-bold">프로필</span>
        </button>

      </nav>
    </div>
  );
}
