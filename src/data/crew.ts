import type { CrewTemplate, CrewRole } from '../types/game';

export const CREW_TEMPLATES: CrewTemplate[] = [
  {
    id: 'nav_alex',
    name: '亚历克斯·星辰',
    role: 'navigator',
    icon: '🧭',
    description: '经验丰富的星际导航员，能规划最优航线大幅缩短旅行时间。',
    skillLevel: 1,
    salary: 50,
    hireCost: 300,
  },
  {
    id: 'nav_maya',
    name: '玛雅·虚空行者',
    role: 'navigator',
    icon: '🧭',
    description: '天才级导航专家，熟悉虫洞捷径，旅行效率极高。',
    skillLevel: 2,
    salary: 120,
    hireCost: 800,
  },
  {
    id: 'nav_kai',
    name: '凯·星图大师',
    role: 'navigator',
    icon: '🧭',
    description: '传说级导航员，据说能在星云中找到最短路径。',
    skillLevel: 3,
    salary: 250,
    hireCost: 2000,
  },
  {
    id: 'eng_rita',
    name: '丽塔·焊火',
    role: 'engineer',
    icon: '🔧',
    description: '熟练的护盾工程师，能在战斗中快速修复护盾系统。',
    skillLevel: 1,
    salary: 60,
    hireCost: 400,
  },
  {
    id: 'eng_victor',
    name: '维克多·钢铁心',
    role: 'engineer',
    icon: '🔧',
    description: '资深飞船工程师，护盾修复速度翻倍。',
    skillLevel: 2,
    salary: 140,
    hireCost: 900,
  },
  {
    id: 'eng_sofia',
    name: '索菲亚·纳米女王',
    role: 'engineer',
    icon: '🔧',
    description: '纳米技术专家，护盾修复效率无人能及。',
    skillLevel: 3,
    salary: 280,
    hireCost: 2200,
  },
  {
    id: 'mer_tom',
    name: '汤姆·金算盘',
    role: 'merchant',
    icon: '💼',
    description: '精明的商人，总能在交易中获得更好的价格。',
    skillLevel: 1,
    salary: 70,
    hireCost: 500,
  },
  {
    id: 'mer_elena',
    name: '艾琳娜·商海之狐',
    role: 'merchant',
    icon: '💼',
    description: '银河商会认证的高级交易员，交易利润丰厚。',
    skillLevel: 2,
    salary: 160,
    hireCost: 1000,
  },
  {
    id: 'mer_cedric',
    name: '塞德里克·贸易之王',
    role: 'merchant',
    icon: '💼',
    description: '传奇商人，据说与他交易从未有人吃过亏。',
    skillLevel: 3,
    salary: 320,
    hireCost: 2500,
  },
];

export const ROLE_LABELS: Record<CrewRole, string> = {
  navigator: '导航员',
  engineer: '工程师',
  merchant: '商人',
};

export const ROLE_DESCRIPTIONS: Record<CrewRole, string> = {
  navigator: '减少星际旅行所需时间',
  engineer: '加速护盾修复，降低修复成本',
  merchant: '提升交易利润（卖价更高，买价更低）',
};

export const getNavigatorBonus = (skillLevel: number): number => {
  switch (skillLevel) {
    case 1: return 0.15;
    case 2: return 0.30;
    case 3: return 0.50;
    default: return 0;
  }
};

export const getEngineerBonus = (skillLevel: number): number => {
  switch (skillLevel) {
    case 1: return 0.20;
    case 2: return 0.40;
    case 3: return 0.60;
    default: return 0;
  }
};

export const getMerchantBonus = (skillLevel: number): number => {
  switch (skillLevel) {
    case 1: return 0.05;
    case 2: return 0.12;
    case 3: return 0.25;
    default: return 0;
  }
};

export const getCrewTemplate = (id: string): CrewTemplate | undefined => {
  return CREW_TEMPLATES.find((c) => c.id === id);
};

export const getCrewsByRole = (role: CrewRole): CrewTemplate[] => {
  return CREW_TEMPLATES.filter((c) => c.role === role);
};
