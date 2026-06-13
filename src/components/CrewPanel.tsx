import { useGameStore } from '../store/useGameStore';
import {
  CREW_TEMPLATES,
  ROLE_LABELS,
  ROLE_DESCRIPTIONS,
  getNavigatorBonus,
  getEngineerBonus,
  getMerchantBonus,
} from '../data/crew';
import type { CrewRole, CrewMember } from '../types/game';

const roleColors: Record<CrewRole, { text: string; border: string; bg: string; glow: string; btn: string }> = {
  navigator: {
    text: 'text-neon-cyan',
    border: 'border-neon-cyan/60',
    bg: 'bg-neon-cyan',
    glow: 'shadow-neon-cyan',
    btn: 'btn-neon',
  },
  engineer: {
    text: 'text-neon-orange',
    border: 'border-neon-orange/60',
    bg: 'bg-neon-orange',
    glow: 'shadow-neon-orange',
    btn: 'btn-warn',
  },
  merchant: {
    text: 'text-neon-yellow',
    border: 'border-neon-yellow/60',
    bg: 'bg-neon-yellow',
    glow: 'shadow-neon-yellow',
    btn: 'btn-gold',
  },
};

const getBonusForRole = (role: CrewRole, skillLevel: number): number => {
  switch (role) {
    case 'navigator':
      return getNavigatorBonus(skillLevel);
    case 'engineer':
      return getEngineerBonus(skillLevel);
    case 'merchant':
      return getMerchantBonus(skillLevel);
    default:
      return 0;
  }
};

const formatDaysSince = (timestamp: number): string => {
  const msPerDay = 60_000;
  const elapsed = Date.now() - timestamp;
  const days = Math.floor(elapsed / msPerDay);
  if (days <= 0) return '刚刚支付';
  if (days === 1) return '1天前';
  return `${days}天前`;
};

const CrewPanel = () => {
  const {
    credits,
    crew,
    hireCrew,
    fireCrew,
    payCrewSalary,
    payAllCrewSalaries,
    getTotalCrewSalary,
    getBestCrewBonus,
  } = useGameStore();

  const totalSalary = getTotalCrewSalary();
  const navBonus = getBestCrewBonus('navigator');
  const engBonus = getBestCrewBonus('engineer');
  const merBonus = getBestCrewBonus('merchant');

  const isHired = (templateId: string) => crew.some((c) => c.templateId === templateId);

  const getLoyaltyColor = (loyalty: number) => {
    if (loyalty > 60) return 'bg-neon-green';
    if (loyalty > 30) return 'bg-neon-yellow';
    return 'bg-neon-red';
  };

  const getLoyaltyTextColor = (loyalty: number) => {
    if (loyalty > 60) return 'text-neon-green';
    if (loyalty > 30) return 'text-neon-yellow';
    return 'text-neon-red';
  };

  const renderHireCard = (template: typeof CREW_TEMPLATES[0]) => {
    const colors = roleColors[template.role];
    const bonus = getBonusForRole(template.role, template.skillLevel);
    const hired = isHired(template.id);
    const canAfford = credits >= template.hireCost;

    return (
      <div key={template.id} className="panel corner-deco p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{template.icon}</span>
            <div>
              <div className={`font-orbitron font-bold ${colors.text}`}>
                {template.name}
              </div>
              <span className={`chip ${colors.text} ${colors.border} text-[10px]`}>
                {ROLE_LABELS[template.role]} · Lv.{template.skillLevel}
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed min-h-[32px]">
          {template.description}
        </p>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded bg-space-800/60 p-2 border border-white/5">
            <div className="text-slate-400">技能加成</div>
            <div className={`font-mono font-bold ${colors.text}`}>
              +{(bonus * 100).toFixed(0)}%
            </div>
          </div>
          <div className="rounded bg-space-800/60 p-2 border border-white/5">
            <div className="text-slate-400">日薪</div>
            <div className="font-mono font-bold text-neon-yellow">
              ₵{template.salary}
            </div>
          </div>
        </div>

        <div className="divider-glow" />

        <button
          onClick={() => hireCrew(template.id)}
          disabled={hired || !canAfford}
          className={`${colors.btn} w-full`}
        >
          {hired ? (
            <span>已雇佣</span>
          ) : (
            <>
              <span>雇佣</span>
              <span className="text-sm opacity-80">💰 {template.hireCost}</span>
            </>
          )}
        </button>
      </div>
    );
  };

  const renderHiredCard = (member: CrewMember) => {
    const colors = roleColors[member.role];
    const bonus = getBonusForRole(member.role, member.skillLevel);
    const canAfford = credits >= member.salary;
    const daysSincePaid = Math.floor((Date.now() - member.lastPaidAt) / 60_000);
    const needsPayment = daysSincePaid >= 1;

    return (
      <div key={member.id} className="panel corner-deco p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{member.icon}</span>
            <div>
              <div className={`font-orbitron font-bold ${colors.text}`}>
                {member.name}
              </div>
              <span className={`chip ${colors.text} ${colors.border} text-[10px]`}>
                {ROLE_LABELS[member.role]} · Lv.{member.skillLevel}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">忠诚度</span>
            <span className={`font-mono font-bold ${getLoyaltyTextColor(member.loyalty)}`}>
              {member.loyalty}/100
            </span>
          </div>
          <div className="h-2.5 rounded-full bg-space-800 overflow-hidden border border-white/5">
            <div
              className={`h-full ${getLoyaltyColor(member.loyalty)} transition-all duration-500`}
              style={{ width: `${member.loyalty}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded bg-space-800/60 p-2 border border-white/5">
            <div className="text-slate-400">技能加成</div>
            <div className={`font-mono font-bold ${colors.text}`}>
              +{(bonus * 100).toFixed(0)}%
            </div>
          </div>
          <div className="rounded bg-space-800/60 p-2 border border-white/5">
            <div className="text-slate-400">上次发薪</div>
            <div className={`font-mono font-bold ${needsPayment ? 'text-neon-red' : 'text-slate-300'}`}>
              {formatDaysSince(member.lastPaidAt)}
            </div>
          </div>
        </div>

        <div className="divider-glow" />

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => payCrewSalary(member.id)}
            disabled={!canAfford}
            className={`${colors.btn} !px-2 !py-2 text-xs`}
          >
            <span>发薪</span>
            <span className="opacity-80">₵{member.salary}</span>
          </button>
          <button
            onClick={() => fireCrew(member.id)}
            className="btn-ghost !px-2 !py-2 text-xs text-red-400 border-red-500/30 hover:text-red-300 hover:bg-red-500/10 hover:border-red-500/50"
          >
            解雇
          </button>
        </div>
      </div>
    );
  };

  const roles: CrewRole[] = ['navigator', 'engineer', 'merchant'];

  return (
    <div className="flex flex-col gap-5 h-full overflow-y-auto">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="title-section">👥 船员管理</h2>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="chip text-neon-yellow border-neon-yellow/40 font-orbitron">
            💰 {credits.toLocaleString()}
          </span>
          {crew.length > 0 && (
            <>
              <span className="chip text-slate-300 border-white/10 font-orbitron">
                👥 {crew.length} 名船员
              </span>
              <span className="chip text-neon-orange border-neon-orange/40 font-orbitron">
                💵 日薪 ₵{totalSalary}
              </span>
              <button
                onClick={payAllCrewSalaries}
                disabled={credits < totalSalary}
                className="btn-gold !px-3 !py-1.5 text-xs"
              >
                全员发薪
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="panel p-4 flex flex-col items-center gap-2 border-neon-cyan/30">
          <span className="text-3xl">🧭</span>
          <div className="font-orbitron font-bold text-neon-cyan text-sm">导航加成</div>
          <div className="text-2xl font-bold text-neon-cyan font-mono">
            {(navBonus * 100).toFixed(0)}%
          </div>
          <div className="text-xs text-slate-400 text-center">
            {ROLE_DESCRIPTIONS.navigator}
          </div>
        </div>
        <div className="panel p-4 flex flex-col items-center gap-2 border-neon-orange/30">
          <span className="text-3xl">🔧</span>
          <div className="font-orbitron font-bold text-neon-orange text-sm">工程师加成</div>
          <div className="text-2xl font-bold text-neon-orange font-mono">
            {(engBonus * 100).toFixed(0)}%
          </div>
          <div className="text-xs text-slate-400 text-center">
            {ROLE_DESCRIPTIONS.engineer}
          </div>
        </div>
        <div className="panel p-4 flex flex-col items-center gap-2 border-neon-yellow/30">
          <span className="text-3xl">💼</span>
          <div className="font-orbitron font-bold text-neon-yellow text-sm">商人加成</div>
          <div className="text-2xl font-bold text-neon-yellow font-mono">
            {(merBonus * 100).toFixed(0)}%
          </div>
          <div className="text-xs text-slate-400 text-center">
            {ROLE_DESCRIPTIONS.merchant}
          </div>
        </div>
      </div>

      {crew.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="font-orbitron font-bold text-white text-sm flex items-center gap-2">
            <span>🚀</span> 我的船员
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {crew.map((m) => renderHiredCard(m))}
          </div>
        </div>
      )}

      {roles.map((role) => {
        const templates = CREW_TEMPLATES.filter((t) => t.role === role && !isHired(t.id));
        if (templates.length === 0) return null;
        const colors = roleColors[role];
        return (
          <div key={role} className="flex flex-col gap-3">
            <h3 className={`font-orbitron font-bold ${colors.text} text-sm flex items-center gap-2`}>
              <span>{templates[0].icon}</span> 可雇佣 {ROLE_LABELS[role]}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((t) => renderHireCard(t))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CrewPanel;
