/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Define the structure of a quiz option
interface QuizOption {
  text: string;
  next: string; // ID of the next step
  value?: any; // Optional value to store for this answer
  imageUrl?: string;
  imagePrompt?: string; // English prompt for image generation
  action?: () => void; // Optional action for special buttons
  isProgramCard?: boolean; // For S5 summary cards
  cardDetails?: string[]; // For S5 summary cards
}

// Define the structure for special action links/buttons within a step
interface QuizActionLink {
  text: string;
  next?: string; // ID of the step to navigate to
  action?: () => void; // Or an action to perform
  customActionId?: string; // For actions not tied to 'next'
}

// Define the structure for a slider configuration
interface SliderConfig {
  min: number;
  max: number;
  step: number;
  defaultValue?: number;
  unit: string;
}

// Define the structure of a quiz step
interface QuizStep {
  id: string;
  type: 'start' | 'question' | 'info' | 'final' | 'placeholder' | 'custom';
  headline?: string;
  subline?: string | string[];
  questionText?: string;
  options?: QuizOption[];
  details?: string[]; // For info screens
  nextButtonText?: string; // For info screens or slider confirm
  next?: string; // For info screens, auto-advance, or slider question's next step
  ctaText?: string; // For start and final screens
  explanation?: string; // For start screen
  closingBlock?: string[]; // For final screens
  back?: string | (() => string); // ID of the previous step or a function to determine it
  actionLinks?: QuizActionLink[]; // Special links like "View all programs"
  imageUrl?: string;
  imagePrompt?: string; // English prompt for image generation
  inputType?: 'buttons' | 'slider'; // Defaults to 'buttons'
  sliderConfig?: SliderConfig;
}

// Define the overall quiz data structure
interface QuizData {
  [key: string]: QuizStep;
}

const quizData: QuizData = {
  start: {
    id: 'start',
    type: 'start',
    headline: 'Как купить дом в коттеджном посёлке “Заповедный” — без переплат, с выгодой и точно под ваш бюджет',
    imagePrompt: "Vibrant, welcoming illustration of a modern cottage village 'Zapovedny', sunny day, lush green landscape, families walking around.",
    subline: [
      'Ответьте на 4–5 коротких вопросов — и получите персональный сценарий покупки:',
      '— вид ипотеки (или скидку при оплате наличными),',
      '— доступные дома,',
      '— ежемесячный платёж,',
      '— бонусы от застройщика.'
    ],
    ctaText: 'Начать подбор дома',
    explanation: 'Это не займёт больше 1 минуты. Без регистрации и звонков.',
    next: 'q_financingSource'
  },
  q_financingSource: {
    id: 'q_financingSource',
    type: 'question',
    questionText: 'Как вы планируете купить дом?',
    options: [
      { text: 'За собственные накопления', next: 's1_intro', value: 'cash' },
      { text: 'В ипотеку', next: 'q_mortgageType', value: 'mortgage' },
      { text: 'Пока не знаю', next: 's5_intro', value: 'unknown_financing' }
    ],
    back: 'start'
  },
  q_mortgageType: {
    id: 'q_mortgageType',
    type: 'question',
    questionText: 'Какая программа вам подходит?',
    options: [
      { text: 'Семейная ипотека', next: 's2_intro', value: 'family_mortgage' },
      { text: 'ИТ-ипотека', next: 's3_intro', value: 'it_mortgage' },
      { text: 'Сельская ипотека', next: 's4_intro', value: 'rural_mortgage' },
      { text: 'Не знаю', next: 's5_intro', value: 'unknown_mortgage_type' }
    ],
    actionLinks: [
        { text: 'Выбрать другой вариант (вернуться к выбору финансирования)', next: 'q_financingSource' },
        { text: 'Посмотреть все программы', next: 's5_intro' },
        { text: 'Покупка за накопления', next: 's1_intro' }
    ],
    back: 'q_financingSource'
  },
  // Scenario 1: Cash Purchase
  s1_intro: {
    id: 's1_intro',
    type: 'info',
    headline: 'У вас есть собственные средства — это даёт вам значительные преимущества.',
    imagePrompt: "Illustration of a smiling person holding keys, standing proudly in front of a newly acquired, beautiful modern cottage. Text overlay: 'Your Advantage!'",
    details: [
      '— Вы экономите до 2 000 000 рублей за счёт отсутствия процентов, банковских комиссий и страховок.',
      '— Въезжаете в дом сразу — без ожиданий, согласований и бюрократии.',
      '— Получаете бонусы: кухня в подарок, улучшенная отделка, дополнительные опции.',
      '— Имеете возможность выбрать лучший дом без ограничений по сумме.'
    ],
    nextButtonText: 'Продолжить',
    next: 's1_q1',
    back: 'q_financingSource'
  },
  s1_q1: {
    id: 's1_q1',
    type: 'question',
    questionText: 'На какую сумму вы рассчитываете?',
    imagePrompt: "Clean, minimalist illustration of a hand adjusting a sleek slider interface element, with currency symbols and house icons in the background. Theme: financial planning.",
    inputType: 'slider',
    sliderConfig: {
      min: 10,
      max: 25, // To accommodate 20+
      step: 1,
      defaultValue: 15,
      unit: 'млн рублей'
    },
    nextButtonText: 'Продолжить с этой суммой',
    next: 's1_q2',
    back: 's1_intro'
  },
  s1_q2: {
    id: 's1_q2',
    type: 'question',
    questionText: 'Что для вас важнее всего при выборе дома?',
    options: [
      { text: 'Дом полностью готов к проживанию', next: 's1_q3', value: 'ready_to_live', imagePrompt: "Photo-realistic interior of a bright, modern living room, fully furnished and move-in ready. Sunlight streaming through windows." },
      { text: 'Возможность самому доделать и сэкономить', next: 's1_q3', value: 'diy_finish', imagePrompt: "Upbeat illustration of a person joyfully painting a wall in a new house, DIY tools scattered, a sense of accomplishment." },
      { text: 'Участок с баней, навесом, гаражом', next: 's1_q3', value: 'extra_buildings', imagePrompt: "Charming illustration of a cottage backyard featuring a cozy wooden banya (sauna), a stylish carport, and a neat garage." },
      { text: 'Высокое качество и индивидуальные решения', next: 's1_q3', value: 'high_quality_custom' }
    ],
    back: 's1_q1'
  },
  s1_q3: {
    id: 's1_q3',
    type: 'question',
    questionText: 'Кто будет жить в этом доме?',
    options: [
      { text: 'Семья с детьми', next: 's1_q4', value: 'family_with_kids' },
      { text: 'Пара без детей', next: 's1_q4', value: 'couple_no_kids' },
      { text: 'Несколько поколений (с родителями/детьми)', next: 's1_q4', value: 'multi_generation' },
      { text: 'Для отдыха (дача, выходные)', next: 's1_q4', value: 'vacation_home' }
    ],
    back: 's1_q2'
  },
  s1_q4: {
    id: 's1_q4',
    type: 'question',
    questionText: 'Когда вы планируете переезд?',
    options: [
      { text: 'В ближайшее время', next: 's1_final', value: 'asap' },
      { text: 'Через 2–3 месяца', next: 's1_final', value: '2-3_months' },
      { text: 'Через 4–6 месяцев', next: 's1_final', value: '4-6_months' },
      { text: 'Пока просто смотрю, интересуюсь', next: 's1_final', value: 'just_looking' }
    ],
    back: 's1_q3'
  },
  s1_final: {
    id: 's1_final',
    type: 'final',
    headline: 'Ваш сценарий покупки — это готовое решение без компромиссов.',
    subline: [
      'С учётом ваших ответов, мы предлагаем следующие варианты домов:',
      '— Дом 169 м² с отделкой «под ключ», тёплыми полами и фильтрацией воды',
      '— Бонус: кухня в подарок или участок с баней',
      '— Полностью готов к проживанию, въезд — в течение месяца'
    ],
    closingBlock: [
      '— Без процентов',
      '— Без ремонта',
      '— Без стресса'
    ],
    ctaText: 'Получить список подходящих домов и расчёт',
    actionLinks: [ {text: 'Начать заново', next: 'start'}],
    back: 's1_q4'
  },

  // Scenario 2: Family Mortgage
  s2_intro: {
    id: 's2_intro',
    type: 'info',
    headline: 'Вы можете воспользоваться семейной ипотекой — это реальная возможность взять дом с минимальным первоначальным взносом и доступным ежемесячным платежом.',
    imagePrompt: "Warm, inviting illustration of a happy family with young children playing in the yard of their new cottage.",
    details: [
      '— До 6 миллионов рублей на одного супруга. До 12 миллионов рублей на семью.',
      '— Первоначальный взнос от 15–20 процентов.',
      '— Ежемесячный платёж — от 38 000 до 56 000 рублей (в зависимости от суммы кредита и условий банка).',
      '— Дома с отделкой "под ключ" доступны в пределах бюджета, особенно при доплате маткапиталом, средствами с продажи квартиры или собственными накоплениями.'
    ],
    nextButtonText: 'Продолжить',
    next: 's2_q1',
    back: 'q_mortgageType'
  },
  s2_q1: {
    id: 's2_q1',
    type: 'question',
    questionText: 'У вас есть дети младше 18 лет?',
    options: [
      { text: 'Да', next: 's2_q2', value: true },
      { text: 'Нет', next: 'q_mortgageType', value: false } // Logic: If "Нет" — направляем в другую ветку
    ],
    back: 's2_intro'
  },
  s2_q2: {
    id: 's2_q2',
    type: 'question',
    questionText: 'Вы покупаете дом вместе с супругом/супругой?',
    options: [
      { text: 'Да, покупаем вдвоем', next: 's2_q3', value: 'together' },
      { text: 'Нет, только на одного', next: 's2_q3', value: 'single' }
    ],
    back: 's2_q1'
  },
  s2_q3: {
    id: 's2_q3',
    type: 'question',
    questionText: 'Есть ли у вас дополнительные средства?',
    options: [
      { text: 'Да, есть материнский капитал', next: 's2_q4', value: 'mat_capital' },
      { text: 'Да, есть накопления / квартира на продажу', next: 's2_q4', value: 'savings_property' },
      { text: 'Нет, только ипотека', next: 's2_q4', value: 'only_mortgage' }
    ],
    back: 's2_q2'
  },
  s2_q4: {
    id: 's2_q4',
    type: 'question',
    questionText: 'Что для вас важнее всего?',
    options: [
      { text: 'Въехать сразу, без ремонта', next: 's2_final', value: 'move_in_ready' },
      { text: 'Сделать отделку самостоятельно', next: 's2_final', value: 'diy_finish' },
      { text: 'Получить максимум за минимальные деньги', next: 's2_final', value: 'max_for_min' },
      { text: 'Индивидуальный проект под запрос', next: 's2_final', value: 'custom_project' }
    ],
    back: 's2_q3'
  },
  s2_final: {
    id: 's2_final',
    type: 'final',
    headline: 'Вы можете взять дом, полностью готовый к жизни, с минимальным взносом.',
    subline: [
      'Мы рассчитали для вас оптимальный сценарий:',
      '— Дом за 13.9 млн рублей (например, 169 м² с навесом)',
      '— Семейная ипотека на 12 млн, доплата из маткапитала/накоплений',
      '— Ежемесячный платёж — около 56 000 рублей',
      '— Включены: ровные стены, тёплый пол, натяжные потолки, кухня в подарок, септик и система водоочистки'
    ],
    closingBlock: [
      '— Без дополнительного ремонта',
      '— Гарантия на дом 5 лет',
      '— Возможность въезда в ближайшие месяцы'
    ],
    ctaText: 'Получить список доступных домов и рассчитать платёж',
    actionLinks: [{ text: 'Начать заново', next: 'start' }],
    back: 's2_q4'
  },

  // Scenario 3: IT Mortgage
  s3_intro: {
    id: 's3_intro',
    type: 'info',
    headline: 'Если вы работаете в сфере IT, у вас есть возможность оформить ИТ-ипотеку на выгодных условиях.',
    imagePrompt: "Sleek, modern graphic of a laptop displaying code, with a stylish cottage silhouette in the background. Theme: tech and home.",
    details: [
      '— Лимит по кредиту — до 9 миллионов рублей',
      '— Льготная ставка от 5% (в зависимости от региона и банка)',
      '— Нужна подтверждённая "белая" заработная плата',
      '— Возможность построить или купить дом в пределах бюджета, в том числе дуплекс'
    ],
    nextButtonText: 'Продолжить',
    next: 's3_q1',
    back: 'q_mortgageType'
  },
  s3_q1: {
    id: 's3_q1',
    type: 'question',
    questionText: 'Вы работаете официально в IT-сфере?',
    options: [
      { text: 'Да', next: 's3_q2', value: true },
      { text: 'Нет', next: 's5_intro', value: false } // Logic: Если "Нет" — переход на сценарий «Пока не знаю» или предложение рассмотреть сельскую ипотеку.
    ],
    back: 's3_intro'
  },
  s3_q2: {
    id: 's3_q2',
    type: 'question',
    questionText: 'Ваша заработная плата официально подтверждена (удостоверена 2-НДФЛ или справкой по форме банка)?',
    options: [
      { text: 'Да', next: 's3_q3', value: 'official_salary_yes' },
      { text: 'Нет', next: 's3_q3', value: 'official_salary_no' } // Logic: предупреждаем о возможных ограничениях, но продолжаем
    ],
    back: 's3_q1'
  },
  s3_q3: {
    id: 's3_q3',
    type: 'question',
    questionText: 'У вас есть накопления или недвижимость, которую можно использовать как первоначальный взнос?',
    options: [
      { text: 'Да, накопления', next: 's3_q4', value: 'savings' },
      { text: 'Да, продаю квартиру/дачу', next: 's3_q4', value: 'selling_property' },
      { text: 'Нет, рассчитываю только на ипотеку', next: 's3_q4', value: 'only_mortgage' }
    ],
    back: 's3_q2'
  },
  s3_q4: {
    id: 's3_q4',
    type: 'question',
    questionText: 'Какой формат дома вам интересен?',
    options: [
      { text: 'Дуплекс (совместный участок)', next: 's3_final', value: 'duplex' },
      { text: 'Отдельный дом', next: 's3_final', value: 'separate_house' },
      { text: 'Всё равно, главное — качество', next: 's3_final', value: 'quality_focus' },
      { text: 'Индивидуальный проект', next: 's3_final', value: 'custom_project' }
    ],
    back: 's3_q3'
  },
  s3_final: {
    id: 's3_final',
    type: 'final',
    headline: 'Вы можете воспользоваться ИТ-ипотекой и въехать в современный дом в ближайшее время.',
    subline: [
      'С учётом ваших ответов, мы подобрали оптимальный сценарий:',
      '— ИТ-ипотека до 9 млн рублей',
      '— Дом площадью 139–150 м²',
      '— Первоначальный взнос из накоплений или с продажи квартиры',
      '— Возможны варианты с отделкой «под ключ» или предчистовой',
      '— Включены коммуникации, участок 7–9 соток, современная архитектура'
    ],
    closingBlock: [
      '— Быстрое оформление',
      '— Бонусы от застройщика',
      '— Возможность улучшить комплектацию за счёт дополнительных средств'
    ],
    ctaText: 'Узнать условия ИТ-ипотеки и получить список подходящих домов',
    actionLinks: [{ text: 'Начать заново', next: 'start' }],
    back: 's3_q4'
  },

  // Scenario 4: Rural Mortgage
  s4_intro: {
    id: 's4_intro',
    type: 'info',
    headline: 'Сельская ипотека — это самый выгодный способ приобрести дом, если вы работаете в социальной сфере или на сельской территории.',
    imagePrompt: "Peaceful, scenic illustration of a cottage nestled in a rural landscape, with elements representing social sphere workers (e.g., a medical symbol, a book).",
    details: [
      '— Льготная ставка — 3% годовых',
      '— Сумма кредита — до 6 млн рублей на человека',
      '— При покупке вдвоём — до 12 млн рублей',
      '— Ставка фиксируется на весь срок, не зависит от экономической ситуации',
      '— Особенно подходит: участникам СВО, врачам, учителям, работникам АПК и социальной сферы'
    ],
    nextButtonText: 'Продолжить',
    next: 's4_q1',
    back: 'q_mortgageType'
  },
  s4_q1: {
    id: 's4_q1',
    type: 'question',
    questionText: 'Относитесь ли вы или супруг(а) к одной из категорий?',
    options: [
      { text: 'Работаю на селе (учитель, врач, агро, администрация)', next: 's4_q2', value: 'rural_worker' },
      { text: 'Участвую или участвовал в СВО', next: 's4_q2', value: 'svo_participant' },
      { text: 'Нет, но хочу узнать, подхожу ли', next: 's4_consultation_needed', value: 'want_to_know' }, // Special logic
      { text: 'Нет, не подхожу', next: 'q_mortgageType', value: 'not_applicable' } // Logic: направляем в другие сценарии
    ],
    back: 's4_intro'
  },
  s4_consultation_needed: {
    id: 's4_consultation_needed',
    type: 'final', // Or 'info' with a CTA that acts like a final one for this small branch
    headline: 'Уточним детали для Сельской ипотеки',
    subline: ['Мы готовы помочь вам разобраться, подходите ли вы под условия сельской ипотеки. Наши специалисты свяжутся с вами для бесплатной консультации.'],
    ctaText: 'Записаться на консультацию',
    actionLinks: [
        {text: 'Выбрать другую программу', next: 'q_mortgageType'},
        {text: 'Начать заново', next: 'start'}
    ],
    back: 's4_q1'
  },
  s4_q2: {
    id: 's4_q2',
    type: 'question',
    questionText: 'Планируете ли покупать дом с супругом/супругой?',
    options: [
      { text: 'Да, вместе', next: 's4_q3', value: 'together' },
      { text: 'Нет, только на себя', next: 's4_q3', value: 'single' }
    ],
    back: 's4_q1'
  },
  s4_q3: {
    id: 's4_q3',
    type: 'question',
    questionText: 'Есть ли у вас дополнительные средства?',
    options: [
      { text: 'Да, есть материнский капитал', next: 's4_q4', value: 'mat_capital' },
      { text: 'Да, есть накопления', next: 's4_q4', value: 'savings' },
      { text: 'Да, есть квартира / дом на продажу', next: 's4_q4', value: 'selling_property' },
      { text: 'Нет, только ипотека', next: 's4_q4', value: 'only_mortgage' }
    ],
    back: 's4_q2'
  },
  s4_q4: {
    id: 's4_q4',
    type: 'question',
    questionText: 'Что для вас важнее всего?',
    options: [
      { text: 'Въехать сразу в готовый дом', next: 's4_final', value: 'ready_to_move' },
      { text: 'Купить дом и доделывать постепенно', next: 's4_final', value: 'diy_gradual' },
      { text: 'Минимальный платёж', next: 's4_final', value: 'min_payment' },
      { text: 'Участок и природная среда', next: 's4_final', value: 'plot_nature' }
    ],
    back: 's4_q3'
  },
  s4_final: {
    id: 's4_final',
    type: 'final',
    headline: 'Сельская ипотека — реальный шанс купить дом с минимальной ставкой и без переплаты.',
    subline: [
      'По вашим вводным мы рассчитали оптимальный путь:',
      '— Сумма: до 12 млн рублей на семью (или 6 млн на одного)',
      '— Ежемесячный платёж — от 28 000 рублей',
      '— Дом площадью 139–170 м², с участком, всеми коммуникациями и готовой отделкой',
      '— Возможность получения бонусов: кухня, фильтрация воды, участок с ландшафтом'
    ],
    closingBlock: [
      '— Ставка фиксирована — 3% на весь срок',
      '— Нет риска повышения условий',
      '— Гарантия на дом 5 лет'
    ],
    ctaText: 'Узнать, подходите ли вы под сельскую ипотеку и получить подборку домов',
    actionLinks: [{ text: 'Начать заново', next: 'start' }],
    back: 's4_q4'
  },

  // Scenario 5: "Не знаю, какая ипотека мне подходит"
  s5_intro: {
    id: 's5_intro',
    type: 'info',
    headline: 'Давайте разберёмся вместе — мы подскажем, какие программы покупки дома могут вам подойти.',
    imagePrompt: "Friendly and helpful consultant character pointing towards different pathways or options on a map.",
    details: [
      '— Вы не обязаны всё знать. Мы подберём подходящие варианты по ключевым критериям.',
      '— Всё займёт не больше 1 минуты.',
      '— На выходе вы получите персональный сценарий: ипотека, сумма, ежемесячный платёж и список домов.'
    ],
    nextButtonText: 'Начать подбор',
    next: 's5_q1',
    back: () => (userAnswers['financingSource'] === 'mortgage' ? 'q_mortgageType' : 'q_financingSource')
  },
  s5_q1: {
    id: 's5_q1',
    type: 'question',
    questionText: 'У вас есть дети младше 18 лет?',
    options: [
      { text: 'Да', next: 's5_q2', value: true },
      { text: 'Нет', next: 's5_q2', value: false }
    ],
    back: 's5_intro'
  },
  s5_q2: {
    id: 's5_q2',
    type: 'question',
    questionText: 'Где вы работаете?',
    options: [
      { text: 'В IT-сфере', next: 's5_q3', value: 'it_sphere' },
      { text: 'В социальной сфере (учитель, врач, госслужба, СВО и т. д.)', next: 's5_q3', value: 'social_sphere' },
      { text: 'В другой сфере', next: 's5_q3', value: 'other_sphere' }
    ],
    back: 's5_q1'
  },
  s5_q3: {
    id: 's5_q3',
    type: 'question',
    questionText: 'Как планируете покупать дом?',
    options: [
      { text: 'В ипотеку', next: 's5_screen2_summary', value: 'mortgage_plan' }, // Logic to determine which mortgage type based on s5_q1 & s5_q2 handled in s5_screen2_summary
      { text: 'За собственные накопления', next: 's1_intro', value: 'cash_plan' }, // Direct to S1
      { text: 'Пока не решил', next: 's5_screen2_summary', value: 'undecided_plan' } // Show all options
    ],
    back: 's5_q2'
  },
  s5_screen2_summary: { // This is a "custom" type screen that will be rendered with cards
    id: 's5_screen2_summary',
    type: 'custom', // Special type to indicate card rendering handled by renderStep
    headline: 'Вам могут подойти следующие программы:',
    imagePrompt: "Visual layout of four distinct cards, each representing a mortgage type or cash purchase, with clear icons and key benefits.",
    // Options represent the cards themselves and what happens when clicked
    options: [
      {
        text: 'Семейная ипотека',
        next: 's2_intro', // Navigate to the start of Scenario 2
        value: 's2_intro_card',
        isProgramCard: true,
        cardDetails: [
          '— до 6 млн на каждого родителя',
          '— подходит, если есть дети',
          '— ставка от 6%, платёж от 38 000 рублей'
        ]
      },
      {
        text: 'ИТ-ипотека',
        next: 's3_intro', // Navigate to the start of Scenario 3
        value: 's3_intro_card',
        isProgramCard: true,
        cardDetails: [
          '— до 9 млн рублей',
          '— для работающих в IT',
          '— ставка от 5%, платёж от 45 000 рублей'
        ]
      },
      {
        text: 'Сельская ипотека',
        next: 's4_intro', // Navigate to the start of Scenario 4
        value: 's4_intro_card',
        isProgramCard: true,
        cardDetails: [
          '— до 6 млн рублей (или 12 — на семью)',
          '— ставка 3%',
          '— подходит бюджетникам, участникам СВО, работникам на селе'
        ]
      },
      {
        text: 'Покупка за собственные средства',
        next: 's1_intro', // Navigate to the start of Scenario 1
        value: 's1_intro_card',
        isProgramCard: true,
        cardDetails: [
          '— экономия до 2 млн',
          '— бонусы от застройщика',
          '— возможность въехать без ожиданий'
        ]
      },
      {
        text: 'Не уверен, нужна помощь специалиста',
        next: 's5_final_specialist_help',
        value: 'specialist_help_card',
        isProgramCard: false, // Not a program card, but an option below them
      }
    ],
    questionText: 'Какой вариант вам ближе?', // Acts as a prompt for the cards
    back: 's5_q3'
  },
  s5_final_specialist_help: {
    id: 's5_final_specialist_help',
    type: 'final',
    headline: 'Мы готовы помочь вам определиться',
    subline: [
      'Пожалуйста, оставьте ваши контакты, и наш специалист свяжется с вами, чтобы подобрать индивидуальный план покупки дома и ответить на все ваши вопросы.'
    ],
    // Ideally, here you'd have a form, but for this quiz, a CTA suffices.
    ctaText: 'Получить консультацию специалиста',
    actionLinks: [{ text: 'Начать заново', next: 'start' }],
    back: 's5_screen2_summary'
  }

};

const appElement = document.getElementById('app') as HTMLElement;
let currentStepId: string = 'start';
let historyStack: string[] = [];
let userAnswers: Record<string, any> = {};

function renderStep(stepId: string) {
  const step = quizData[stepId];
  if (!step) {
    appElement.innerHTML = '<p>Ошибка: Шаг не найден.</p>';
    return;
  }

  // Clear previous content
  appElement.innerHTML = '';

  const quizStepDiv = document.createElement('div');
  quizStepDiv.className = `quiz-step quiz-step-${step.type}`;
  quizStepDiv.setAttribute('aria-live', 'polite');


  if (step.imagePrompt || step.imageUrl) {
    const imgContainer = document.createElement('div');
    const img = document.createElement('img');
    img.className = 'quiz-step-image';
    if (step.imageUrl) {
        img.src = step.imageUrl;
        img.alt = step.headline || step.questionText || 'Иллюстрация к шагу';
    } else if (step.imagePrompt) {
        // Use placeholder for prompts
        img.src = `https://via.placeholder.com/600x200/E8F5E9/4CAF50?text=Image+Area`;
        img.alt = `Placeholder for: ${step.imagePrompt}`;
        const caption = document.createElement('p');
        caption.className = 'quiz-image-prompt-caption';
        caption.textContent = `Prompt: "${step.imagePrompt}"`;
        imgContainer.appendChild(img);
        imgContainer.appendChild(caption);
    }
     quizStepDiv.appendChild(imgContainer);
  }


  if (step.headline) {
    const headlineElement = document.createElement('h2');
    headlineElement.className = 'quiz-headline';
    headlineElement.textContent = step.headline;
    quizStepDiv.appendChild(headlineElement);
  }

  if (step.subline) {
    const sublineContent = Array.isArray(step.subline) ? step.subline.join('<br>') : step.subline;
    const sublineElement = document.createElement('p');
    sublineElement.className = 'quiz-subline';
    sublineElement.innerHTML = sublineContent;
    quizStepDiv.appendChild(sublineElement);
  }

  if (step.details) {
    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'quiz-details';
    step.details.forEach(detailText => {
      const p = document.createElement('p');
      p.textContent = detailText;
      detailsDiv.appendChild(p);
    });
    quizStepDiv.appendChild(detailsDiv);
  }

  if (step.questionText) {
    const questionElement = document.createElement('p');
    questionElement.className = 'quiz-question';
    questionElement.textContent = step.questionText;
    quizStepDiv.appendChild(questionElement);
  }


  if (step.type === 'custom' && step.id === 's5_screen2_summary' && step.options) {
    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'quiz-program-cards-container';

    step.options.forEach(option => {
      if (option.isProgramCard) {
        const card = document.createElement('div');
        card.className = 'quiz-program-card';
        card.dataset.next = option.next;
        card.dataset.value = option.value;

        const title = document.createElement('h4');
        title.textContent = option.text;
        card.appendChild(title);

        if (option.cardDetails) {
          option.cardDetails.forEach(detail => {
            const p = document.createElement('p');
            p.innerHTML = detail; // Use innerHTML to render <br> if needed
            card.appendChild(p);
          });
        }
        // Add a button within the card for clearer action
        const cardButton = document.createElement('button');
        cardButton.className = 'quiz-option-button'; // Re-use styling
        cardButton.textContent = `Выбрать "${option.text}"`;
        cardButton.dataset.next = option.next;
        cardButton.dataset.value = option.value;

        card.appendChild(cardButton);
        cardsContainer.appendChild(card);
      }
    });
    quizStepDiv.appendChild(cardsContainer);

    // Add "Not sure, need specialist help" as a regular option button below cards
    const specialistOption = step.options.find(opt => opt.value === 'specialist_help_card');
    if (specialistOption) {
        const button = document.createElement('button');
        button.className = 'quiz-option-button specialist-help-button';
        button.textContent = specialistOption.text;
        button.dataset.next = specialistOption.next;
        button.dataset.value = specialistOption.value;
        quizStepDiv.appendChild(button);
    }


  } else if (step.inputType === 'slider' && step.sliderConfig) {
    const sliderConfig = step.sliderConfig;
    const sliderContainer = document.createElement('div');
    sliderContainer.className = 'quiz-slider-container';

    const labelsContainer = document.createElement('div');
    labelsContainer.className = 'quiz-slider-labels-container';
    const minLabel = document.createElement('span');
    minLabel.className = 'quiz-slider-label';
    minLabel.textContent = `${sliderConfig.min} ${sliderConfig.unit.split(' ')[1] || ''}`;
    const maxLabel = document.createElement('span');
    maxLabel.className = 'quiz-slider-label';
    maxLabel.textContent = `${sliderConfig.max} ${sliderConfig.unit.split(' ')[1] || ''}`;
    labelsContainer.appendChild(minLabel);
    labelsContainer.appendChild(maxLabel);
    sliderContainer.appendChild(labelsContainer);

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = String(sliderConfig.min);
    slider.max = String(sliderConfig.max);
    slider.step = String(sliderConfig.step);
    slider.value = String(sliderConfig.defaultValue ?? sliderConfig.min);
    slider.id = `slider-${step.id}`;
    sliderContainer.appendChild(slider);

    const valueDisplay = document.createElement('div');
    valueDisplay.className = 'quiz-slider-value-display';
    valueDisplay.textContent = `${slider.value} ${sliderConfig.unit}`;
    slider.oninput = () => {
      valueDisplay.textContent = `${slider.value} ${sliderConfig.unit}`;
    };
    sliderContainer.appendChild(valueDisplay);
    quizStepDiv.appendChild(sliderContainer);

    const submitButton = document.createElement('button');
    submitButton.className = 'quiz-slider-submit-button';
    submitButton.textContent = step.nextButtonText || 'Продолжить';
    submitButton.dataset.next = step.next;
    submitButton.dataset.valueProvider = `#${slider.id}`; // Store where to get value from
    quizStepDiv.appendChild(submitButton);

  } else if (step.options && step.type !== 'custom') { // Standard button options
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'quiz-options';
    step.options.forEach(option => {
      const button = document.createElement('button');
      button.className = 'quiz-option-button';
      button.dataset.next = option.next;
      if (option.value !== undefined) {
        button.dataset.value = String(option.value);
      }

      if (option.imagePrompt || option.imageUrl) {
        const imgContainer = document.createElement('div');
        imgContainer.className = 'quiz-option-image-placeholder';
        const img = document.createElement('img');
        img.className = 'quiz-option-image';
        if (option.imageUrl) {
            img.src = option.imageUrl;
            img.alt = option.text;
        } else if (option.imagePrompt) {
            img.src = `https://via.placeholder.com/200x100/E0F2F1/00796B?text=Option+Img`;
            img.alt = `Placeholder for: ${option.imagePrompt}`;
            const caption = document.createElement('p');
            caption.className = 'option-prompt-caption';
            caption.textContent = `Prompt: "${option.imagePrompt}"`;
            imgContainer.appendChild(img);
            imgContainer.appendChild(caption);

        }
        button.appendChild(imgContainer);
      }
      const textSpan = document.createElement('span');
      textSpan.className = 'quiz-option-text';
      textSpan.textContent = option.text;
      button.appendChild(textSpan);

      optionsDiv.appendChild(button);
    });
    quizStepDiv.appendChild(optionsDiv);
  }

  if (step.nextButtonText && (step.type === 'info' || step.type === 'start' && !step.ctaText)) {
    const nextButton = document.createElement('button');
    nextButton.className = 'quiz-next-button';
    nextButton.textContent = step.nextButtonText;
    nextButton.dataset.next = step.next;
    quizStepDiv.appendChild(nextButton);
  }

  if (step.ctaText && (step.type === 'start' || step.type === 'final')) {
    const ctaButton = document.createElement('button');
    ctaButton.className = 'quiz-cta-button';
    if (step.type === 'final') ctaButton.classList.add('final-cta');
    ctaButton.textContent = step.ctaText;
    if (step.next) { // Start screen's CTA
        ctaButton.dataset.next = step.next;
    } else { // Final screen's CTA might be for an external action
        ctaButton.addEventListener('click', () => {
            console.log(`CTA clicked for: ${step.headline || step.id}. Implement action.`);
            // Potentially show a "Thank you" message or redirect
            alert('Спасибо за участие! Ваш запрос обрабатывается.');
        });
    }
    quizStepDiv.appendChild(ctaButton);
  }


  if (step.explanation) {
    const explanationElement = document.createElement('p');
    explanationElement.className = 'quiz-explanation';
    explanationElement.textContent = step.explanation;
    quizStepDiv.appendChild(explanationElement);
  }

  if (step.closingBlock) {
    const closingDiv = document.createElement('div');
    closingDiv.className = 'quiz-closing-block';
    step.closingBlock.forEach(detailText => {
      const p = document.createElement('p');
      p.textContent = detailText;
      closingDiv.appendChild(p);
    });
    quizStepDiv.appendChild(closingDiv);
  }

  // Navigation (Back button, Action Links)
  const navDiv = document.createElement('div');
  navDiv.className = 'quiz-navigation';
  let hasNavContent = false;


  if (step.actionLinks) {
    step.actionLinks.forEach(link => {
      const linkButton = document.createElement('button');
      linkButton.className = 'quiz-action-link-button';
      linkButton.textContent = link.text;
      if (link.next) {
        linkButton.dataset.next = link.next;
      }
      if (link.customActionId) {
        linkButton.dataset.customActionId = link.customActionId;
      }
      if (link.action) {
        // This direct action assignment might be tricky with re-renders.
        // Consider customActionId for more complex scenarios.
        linkButton.addEventListener('click', link.action);
      }
      navDiv.appendChild(linkButton);
      hasNavContent = true;
    });
  }

  if (step.back && stepId !== 'start') {
    const backButton = document.createElement('button');
    backButton.className = 'quiz-back-button';
    backButton.textContent = 'Назад';
    backButton.dataset.back = 'true';
    navDiv.appendChild(backButton);
    hasNavContent = true;
  }

  if (hasNavContent) {
    quizStepDiv.appendChild(navDiv);
  }


  appElement.appendChild(quizStepDiv);
  window.scrollTo(0, 0); // Scroll to top on step change
}

function handleClick(event: MouseEvent) {
  let target = event.target as HTMLElement;
  // Traverse up if the click was on an inner element (e.g., span or img inside a button)
  const button: HTMLElement | null = target.closest('button, .quiz-program-card[data-next]');


  if (!button) return;

  if (button.dataset.back) {
    if (historyStack.length > 0) {
      const previousStepId = historyStack.pop() as string;
      // When going back, don't re-add to history, just set currentStepId
      currentStepId = previousStepId;
      renderStep(currentStepId);
    }
    return;
  }
  
  const nextStepId = button.dataset.next;
  const value = button.dataset.value;
  const valueProviderSelector = button.dataset.valueProvider;


  if (value !== undefined) {
    // Attempt to parse if it looks like a boolean or number
    let parsedValue: any = value;
    if (value.toLowerCase() === 'true') parsedValue = true;
    else if (value.toLowerCase() === 'false') parsedValue = false;
    else if (!isNaN(parseFloat(value)) && isFinite(Number(value))) parsedValue = parseFloat(value);
    userAnswers[currentStepId] = parsedValue;
  }

  if (valueProviderSelector) { // For sliders
    const valueProviderElement = document.querySelector(valueProviderSelector) as HTMLInputElement;
    if (valueProviderElement) {
        userAnswers[currentStepId] = valueProviderElement.value; // Store slider value
    }
  }


  if (nextStepId) {
    if (nextStepId === 'start') { // Handle "Start Over"
        historyStack = [];
        userAnswers = {};
        currentStepId = 'start';
    } else {
        historyStack.push(currentStepId); // Add current step to history before moving
        currentStepId = nextStepId;
    }
    renderStep(currentStepId);
  } else if (button.dataset.customActionId) {
    // Handle custom actions if any are defined for buttons
    console.log(`Custom action: ${button.dataset.customActionId}`);
  }
}

appElement.addEventListener('click', handleClick);

// Initial render
renderStep(currentStepId);

// Expose for debugging
// Expose functions and state for debugging and tests
(window as any).quizData = quizData;
(window as any).userAnswers = userAnswers;
(window as any).historyStack = historyStack;
(window as any).renderStep = renderStep;
(window as any).getCurrentStep = () => currentStepId;

export { renderStep, handleClick };
export const getCurrentStep = () => currentStepId;
