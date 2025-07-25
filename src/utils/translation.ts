// Simple translation service
export const translateText = async (text: string, targetLanguage: 'en' | 'cn'): Promise<string> => {
  console.log(`translateText called with: "${text}" -> ${targetLanguage}`);
  
  if (!text.trim()) return '';
  
  try {
    // In a real application, you would use a translation service like Google Translate API
    // For now, using simulated translations
    
    const translations: Record<string, Record<string, string>> = {
      'en': {
        // Common short phrases
        'Хороший карбюратор': 'Good carburetor',
        'Хорошие наушники': 'Good headphones',
        'Отличный товар': 'Excellent product',
        'Качественный продукт': 'High-quality product',
        // Existing longer descriptions
        'Премиум беспроводные наушники с активным шумоподавлением. Поддержка Hi-Res Audio и LDAC. Время работы до 30 часов. Быстрая зарядка - 3 минуты заряда дают 3 часа прослушивания. Совместимы с Google Assistant и Amazon Alexa. Часто задаваемые вопросы: Подходят ли для спорта? Да, имеют защиту от влаги IPX4. Можно ли подключить к двум устройствам одновременно? Да, поддерживается мультипоинт соединение.': 'Premium wireless headphones with active noise cancellation. Hi-Res Audio and LDAC support. Battery life up to 30 hours. Quick charge - 3 minutes of charging gives 3 hours of listening. Compatible with Google Assistant and Amazon Alexa. FAQ: Are they suitable for sports? Yes, they have IPX4 moisture protection. Can you connect to two devices simultaneously? Yes, multipoint connection is supported.',
        'Умный фитнес-трекер с GPS и пульсометром. Отслеживает более 100 видов спорта. Водонепроницаемый корпус 5ATM. Мониторинг сна и стресса. Время работы до 14 дней.': 'Smart fitness tracker with GPS and heart rate monitor. Tracks over 100 sports activities. Waterproof 5ATM case. Sleep and stress monitoring. Battery life up to 14 days.',
        'Мощный игровой ноутбук с RTX 4060. Процессор Intel i7-13700H. 16GB RAM, 1TB SSD. Дисплей 15.6" 144Hz.': 'Powerful gaming laptop with RTX 4060. Intel i7-13700H processor. 16GB RAM, 1TB SSD. 15.6" 144Hz display.'
      },
      'cn': {
        // Common short phrases
        'Хороший карбюратор': '好化油器',
        'Хорошие наушники': '好耳机',
        'Отличный товар': '优秀产品',
        'Качественный продукт': '高质量产品',
        // Existing longer descriptions
        'Премиум беспроводные наушники с активным шумоподавлением. Поддержка Hi-Res Audio и LDAC. Время работы до 30 часов. Быстрая зарядка - 3 минуты заряда дают 3 часа прослушивания. Совместимы с Google Assistant и Amazon Alexa. Часто задаваемые вопросы: Подходят ли для спорта? Да, имеют защиту от влаги IPX4. Можно ли подключить к двум устройствам одновременно? Да, поддерживается мультипоинт соединение.': '高级无线耳机，具有主动降噪功能。支持Hi-Res Audio和LDAC。续航时间长达30小时。快速充电 - 充电3分钟可听音乐3小时。兼容Google Assistant和Amazon Alexa。常见问题：适合运动吗？是的，具有IPX4防潮保护。可以同时连接两个设备吗？是的，支持多点连接。',
        'Умный фитнес-трекер с GPS и пульсометром. Отслеживает более 100 видов спорта. Водонепроницаемый корпус 5ATM. Мониторинг сна и стресса. Время работы до 14 дней.': '智能健身追踪器，配备GPS和心率监测器。追踪100多种运动活动。5ATM防水机身。睡眠和压力监测。续航时间长达14天。',
        'Мощный игровой ноутбук с RTX 4060. Процессор Intel i7-13700H. 16GB RAM, 1TB SSD. Дисплей 15.6" 144Hz.': '强大的游戏笔记本电脑，搭载RTX 4060。Intel i7-13700H处理器。16GB内存，1TB SSD。15.6英寸144Hz显示屏。'
      }
    };

    // Try to find exact match first
    const exactMatch = translations[targetLanguage][text];
    console.log(`Exact match found for "${text}":`, exactMatch);
    if (exactMatch) {
      console.log(`Returning exact match: "${exactMatch}"`);
      return exactMatch;
    }

    // Simple fallback translation for new text
    // In real implementation, you would call Google Translate API here
    console.log(`No exact match, using fallback translation for ${targetLanguage}`);
    if (targetLanguage === 'en') {
      // Enhanced keyword-based translation
      let translatedText = text
        // Common product descriptions
        .replace(/хороший карбюратор/gi, 'good carburetor')
        .replace(/хорошие наушники/gi, 'good headphones')
        .replace(/отличный/gi, 'excellent')
        .replace(/хороший/gi, 'good')
        .replace(/качественный/gi, 'high-quality')
        .replace(/надежный/gi, 'reliable')
        .replace(/прочный/gi, 'durable')
        .replace(/современный/gi, 'modern')
        .replace(/новый/gi, 'new')
        .replace(/премиум/gi, 'premium')
        .replace(/профессиональный/gi, 'professional')
        // Products
        .replace(/карбюратор/gi, 'carburetor')
        .replace(/наушники/gi, 'headphones')
        .replace(/телефон/gi, 'phone')
        .replace(/компьютер/gi, 'computer')
        .replace(/ноутбук/gi, 'laptop')
        .replace(/планшет/gi, 'tablet')
        .replace(/клавиатура/gi, 'keyboard')
        .replace(/мышь/gi, 'mouse')
        .replace(/монитор/gi, 'monitor')
        .replace(/зарядное устройство/gi, 'charger')
        // Technical specs
        .replace(/беспроводные наушники/gi, 'wireless headphones')
        .replace(/активным шумоподавлением/gi, 'active noise cancellation')
        .replace(/время работы/gi, 'battery life')
        .replace(/быстрая зарядка/gi, 'quick charge')
        .replace(/фитнес-трекер/gi, 'fitness tracker')
        .replace(/водонепроницаемый/gi, 'waterproof')
        .replace(/игровой ноутбук/gi, 'gaming laptop')
        .replace(/процессор/gi, 'processor')
        .replace(/дисплей/gi, 'display')
        .replace(/память/gi, 'memory')
        .replace(/хранилище/gi, 'storage')
        .replace(/батарея/gi, 'battery');
      
      const result = translatedText !== text ? translatedText : `[Auto-EN] ${text}`;
      console.log(`EN translation result: "${result}"`);
      return result;
    } else if (targetLanguage === 'cn') {
      let translatedText = text
        // Common product descriptions
        .replace(/хороший карбюратор/gi, '好化油器')
        .replace(/хорошие наушники/gi, '好耳机')
        .replace(/отличный/gi, '优秀的')
        .replace(/хороший/gi, '好')
        .replace(/качественный/gi, '高质量')
        .replace(/надежный/gi, '可靠的')
        .replace(/прочный/gi, '耐用的')
        .replace(/современный/gi, '现代的')
        .replace(/новый/gi, '新的')
        .replace(/премиум/gi, '高端')
        .replace(/профессиональный/gi, '专业的')
        // Products
        .replace(/карбюратор/gi, '化油器')
        .replace(/наушники/gi, '耳机')
        .replace(/телефон/gi, '电话')
        .replace(/компьютер/gi, '电脑')
        .replace(/ноутбук/gi, '笔记本电脑')
        .replace(/планшет/gi, '平板电脑')
        .replace(/клавиатура/gi, '键盘')
        .replace(/мышь/gi, '鼠标')
        .replace(/монитор/gi, '显示器')
        .replace(/зарядное устройство/gi, '充电器')
        // Technical specs
        .replace(/беспроводные наушники/gi, '无线耳机')
        .replace(/активным шумоподавлением/gi, '主动降噪')
        .replace(/время работы/gi, '续航时间')
        .replace(/быстрая зарядка/gi, '快速充电')
        .replace(/фитнес-трекер/gi, '健身追踪器')
        .replace(/водонепроницаемый/gi, '防水')
        .replace(/игровой ноутбук/gi, '游戏笔记本')
        .replace(/процессор/gi, '处理器')
        .replace(/дисплей/gi, '显示屏')
        .replace(/память/gi, '内存')
        .replace(/хранилище/gi, '存储')
        .replace(/батарея/gi, '电池');
      
      const result = translatedText !== text ? translatedText : `[自动中文] ${text}`;
      console.log(`CN translation result: "${result}"`);
      return result;
    }

    console.log(`No translation, returning original: "${text}"`);
    return text;
  } catch (error) {
    console.error('Translation failed:', error);
    return text;
  }
};

// Batch translate function
export const translateDescriptions = async (ruText: string): Promise<{en: string, cn: string}> => {
  const [enText, cnText] = await Promise.all([
    translateText(ruText, 'en'),
    translateText(ruText, 'cn')
  ]);

  return { en: enText, cn: cnText };
};