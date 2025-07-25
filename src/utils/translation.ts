// Simple translation service
export const translateText = async (text: string, targetLanguage: 'en' | 'cn'): Promise<string> => {
  if (!text.trim()) return '';
  
  try {
    // In a real application, you would use a translation service like Google Translate API
    // For now, using simulated translations
    
    const translations: Record<string, Record<string, string>> = {
      'en': {
        'Премиум беспроводные наушники с активным шумоподавлением. Поддержка Hi-Res Audio и LDAC. Время работы до 30 часов. Быстрая зарядка - 3 минуты заряда дают 3 часа прослушивания. Совместимы с Google Assistant и Amazon Alexa. Часто задаваемые вопросы: Подходят ли для спорта? Да, имеют защиту от влаги IPX4. Можно ли подключить к двум устройствам одновременно? Да, поддерживается мультипоинт соединение.': 'Premium wireless headphones with active noise cancellation. Hi-Res Audio and LDAC support. Battery life up to 30 hours. Quick charge - 3 minutes of charging gives 3 hours of listening. Compatible with Google Assistant and Amazon Alexa. FAQ: Are they suitable for sports? Yes, they have IPX4 moisture protection. Can you connect to two devices simultaneously? Yes, multipoint connection is supported.',
        'Умный фитнес-трекер с GPS и пульсометром. Отслеживает более 100 видов спорта. Водонепроницаемый корпус 5ATM. Мониторинг сна и стресса. Время работы до 14 дней.': 'Smart fitness tracker with GPS and heart rate monitor. Tracks over 100 sports activities. Waterproof 5ATM case. Sleep and stress monitoring. Battery life up to 14 days.',
        'Мощный игровой ноутбук с RTX 4060. Процессор Intel i7-13700H. 16GB RAM, 1TB SSD. Дисплей 15.6" 144Hz.': 'Powerful gaming laptop with RTX 4060. Intel i7-13700H processor. 16GB RAM, 1TB SSD. 15.6" 144Hz display.'
      },
      'cn': {
        'Премиум беспроводные наушники с активным шумоподавлением. Поддержка Hi-Res Audio и LDAC. Время работы до 30 часов. Быстрая зарядка - 3 минуты заряда дают 3 часа прослушивания. Совместимы с Google Assistant и Amazon Alexa. Часто задаваемые вопросы: Подходят ли для спорта? Да, имеют защиту от влаги IPX4. Можно ли подключить к двум устройствам одновременно? Да, поддерживается мультипоинт соединение.': '高级无线耳机，具有主动降噪功能。支持Hi-Res Audio和LDAC。续航时间长达30小时。快速充电 - 充电3分钟可听音乐3小时。兼容Google Assistant和Amazon Alexa。常见问题：适合运动吗？是的，具有IPX4防潮保护。可以同时连接两个设备吗？是的，支持多点连接。',
        'Умный фитнес-трекер с GPS и пульсометром. Отслеживает более 100 видов спорта. Водонепроницаемый корпус 5ATM. Мониторинг сна и стресса. Время работы до 14 дней.': '智能健身追踪器，配备GPS和心率监测器。追踪100多种运动活动。5ATM防水机身。睡眠和压力监测。续航时间长达14天。',
        'Мощный игровой ноутбук с RTX 4060. Процессор Intel i7-13700H. 16GB RAM, 1TB SSD. Дисплей 15.6" 144Hz.': '强大的游戏笔记本电脑，搭载RTX 4060。Intel i7-13700H处理器。16GB内存，1TB SSD。15.6英寸144Hz显示屏。'
      }
    };

    // Try to find exact match first
    const exactMatch = translations[targetLanguage][text];
    if (exactMatch) {
      return exactMatch;
    }

    // Simple fallback translation for new text
    if (targetLanguage === 'en') {
      return `[EN] ${text}`;
    } else if (targetLanguage === 'cn') {
      return `[中文] ${text}`;
    }

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