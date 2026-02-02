import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Trophy, 
  Star, 
  Swords, 
  Shield, 
  Target,
  Award,
  Zap,
  CheckCircle2,
  Home,
  Building2,
  Crown
} from 'lucide-react';
import { usePlayerInfo } from '@/hooks/useClanData';
import { Loader } from '@/components/Common/Loader';
import { APIErrorDisplay } from '@/components/Common/ErrorDisplay';
import type { Achievement, Troop, Hero, Spell, HeroEquipment } from '@/types/coc';

// Tab types
type TabType = 'achievements' | 'troops' | 'heroes' | 'spells';

// Format number with commas
const formatNumber = (num: number): string => num.toLocaleString();

// Progress bar component
interface ProgressBarProps {
  current: number;
  max: number;
  color?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, max, color = 'bg-primary' }) => {
  const percentage = Math.min((current / max) * 100, 100);
  const isMaxed = current >= max;

  return (
    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className={`h-full rounded-full transition-all duration-300 ${isMaxed ? 'bg-green-500' : color}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

// Achievement Card
const AchievementCard: React.FC<{ achievement: Achievement }> = ({ achievement }) => {
  const isCompleted = achievement.value >= achievement.target;
  
  return (
    <div className={`bg-white rounded-xl shadow-sm border p-4 ${isCompleted ? 'border-green-200 bg-green-50/30' : 'border-gray-100'}`}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="font-semibold text-gray-900 text-sm">{achievement.name}</h4>
          <p className="text-xs text-gray-500 mt-1">{achievement.info}</p>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <Star 
              key={i} 
              className={`w-4 h-4 ${i < achievement.stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} 
            />
          ))}
        </div>
      </div>
      
      <div className="mt-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-500">Progress</span>
          <span className={`font-medium ${isCompleted ? 'text-green-600' : 'text-gray-700'}`}>
            {formatNumber(achievement.value)} / {formatNumber(achievement.target)}
          </span>
        </div>
        <ProgressBar current={achievement.value} max={achievement.target} />
      </div>

      {achievement.completionInfo && (
        <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
          <CheckCircle2 className="w-3 h-3" />
          {achievement.completionInfo}
        </div>
      )}

      <div className="mt-2">
        <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${
          achievement.village === 'home' ? 'bg-blue-100 text-blue-700' :
          achievement.village === 'builderBase' ? 'bg-purple-100 text-purple-700' :
          'bg-orange-100 text-orange-700'
        }`}>
          {achievement.village === 'home' ? 'Home Village' :
           achievement.village === 'builderBase' ? 'Builder Base' :
           'Clan Capital'}
        </span>
      </div>
    </div>
  );
};

// Troop Card
const TroopCard: React.FC<{ troop: Troop }> = ({ troop }) => {
  const isMaxed = troop.level >= troop.maxLevel;
  const isSuperActive = troop.superTroopIsActive;

  return (
    <div className={`bg-white rounded-xl shadow-sm border p-4 ${isMaxed ? 'border-green-200' : 'border-gray-100'}`}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-gray-900 text-sm">{troop.name}</h4>
        {isSuperActive && (
          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
            SUPER
          </span>
        )}
      </div>
      
      <div className="mt-2">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-500">Level</span>
          <span className={`font-medium ${isMaxed ? 'text-green-600' : 'text-gray-700'}`}>
            {troop.level} / {troop.maxLevel}
          </span>
        </div>
        <ProgressBar current={troop.level} max={troop.maxLevel} color="bg-green-500" />
      </div>

      <div className="mt-2">
        <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${
          troop.village === 'home' ? 'bg-blue-100 text-blue-700' :
          troop.village === 'builderBase' ? 'bg-purple-100 text-purple-700' :
          'bg-orange-100 text-orange-700'
        }`}>
          {troop.village === 'home' ? 'Home Village' :
           troop.village === 'builderBase' ? 'Builder Base' :
           'Clan Capital'}
        </span>
      </div>
    </div>
  );
};

// Hero Card
const HeroCard: React.FC<{ hero: Hero }> = ({ hero }) => {
  const isMaxed = hero.level >= hero.maxLevel;

  return (
    <div className={`bg-white rounded-xl shadow-sm border p-4 ${isMaxed ? 'border-yellow-200' : 'border-gray-100'}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isMaxed ? 'bg-yellow-100' : 'bg-gray-100'}`}>
          <Crown className={`w-5 h-5 ${isMaxed ? 'text-yellow-600' : 'text-gray-600'}`} />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">{hero.name}</h4>
          <p className={`text-xs ${isMaxed ? 'text-yellow-600 font-medium' : 'text-gray-500'}`}>
            {isMaxed ? 'MAXED' : `Level ${hero.level}`}
          </p>
        </div>
      </div>
      
      <div className="mt-2">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-500">Progress</span>
          <span className={`font-medium ${isMaxed ? 'text-yellow-600' : 'text-gray-700'}`}>
            {hero.level} / {hero.maxLevel}
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-300 ${isMaxed ? 'bg-yellow-500' : 'bg-gradient-to-r from-yellow-400 to-orange-500'}`}
            style={{ width: `${(hero.level / hero.maxLevel) * 100}%` }}
          />
        </div>
      </div>

      {hero.equipment && hero.equipment.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-2">Equipped:</p>
          <div className="flex flex-wrap gap-1">
            {hero.equipment.map((eq, i) => (
              <span key={i} className="px-2 py-0.5 bg-yellow-50 text-yellow-700 text-xs rounded-full">
                {eq.name} (Lv.{eq.level})
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-2">
        <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
          Home Village
        </span>
      </div>
    </div>
  );
};

// Hero Equipment Card
const HeroEquipmentCard: React.FC<{ equipment: HeroEquipment }> = ({ equipment }) => {
  const isMaxed = equipment.level >= equipment.maxLevel;

  return (
    <div className={`bg-white rounded-xl shadow-sm border p-4 ${isMaxed ? 'border-yellow-200' : 'border-gray-100'}`}>
      <h4 className="font-semibold text-gray-900 text-sm mb-2">{equipment.name}</h4>
      
      <div className="mt-2">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-500">Level</span>
          <span className={`font-medium ${isMaxed ? 'text-yellow-600' : 'text-gray-700'}`}>
            {equipment.level} / {equipment.maxLevel}
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-300 ${isMaxed ? 'bg-yellow-500' : 'bg-gradient-to-r from-yellow-400 to-orange-500'}`}
            style={{ width: `${(equipment.level / equipment.maxLevel) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

// Spell Card
const SpellCard: React.FC<{ spell: Spell }> = ({ spell }) => {
  const isMaxed = spell.level >= spell.maxLevel;

  return (
    <div className={`bg-white rounded-xl shadow-sm border p-4 ${isMaxed ? 'border-blue-200' : 'border-gray-100'}`}>
      <h4 className="font-semibold text-gray-900 text-sm mb-2">{spell.name}</h4>
      
      <div className="mt-2">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-500">Level</span>
          <span className={`font-medium ${isMaxed ? 'text-blue-600' : 'text-gray-700'}`}>
            {spell.level} / {spell.maxLevel}
          </span>
        </div>
        <ProgressBar current={spell.level} max={spell.maxLevel} color="bg-blue-500" />
      </div>

      <div className="mt-2">
        <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${
          spell.village === 'home' ? 'bg-blue-100 text-blue-700' :
          spell.village === 'builderBase' ? 'bg-purple-100 text-purple-700' :
          'bg-orange-100 text-orange-700'
        }`}>
          {spell.village === 'home' ? 'Home Village' :
           spell.village === 'builderBase' ? 'Builder Base' :
           'Clan Capital'}
        </span>
      </div>
    </div>
  );
};

// Player Label Badge
const PlayerLabelBadge: React.FC<{ label: { name: string; iconUrls: { small: string; medium: string } } }> = ({ label }) => {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
      <img src={label.iconUrls.small} alt={label.name} className="w-4 h-4" />
      <span className="text-sm text-gray-700">{label.name}</span>
    </div>
  );
};

export const PlayerProfile: React.FC = () => {
  const { playerTag } = useParams<{ playerTag: string }>();
  const { data: player, loading, error, refetch } = usePlayerInfo(decodeURIComponent(playerTag || ''));
  const [activeTab, setActiveTab] = useState<TabType>('achievements');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Loader fullScreen text="Loading player profile..." />
        </div>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <APIErrorDisplay error={error} onRetry={refetch} />
        </div>
      </div>
    );
  }

  // Calculate completion percentages
  const troopCompletion = player.troops.length > 0
    ? (player.troops.filter(t => t.level >= t.maxLevel).length / player.troops.length) * 100
    : 0;

  const heroCompletion = player.heroes.length > 0
    ? (player.heroes.filter(h => h.level >= h.maxLevel).length / player.heroes.length) * 100
    : 0;

  const achievementCompletion = player.achievements.length > 0
    ? (player.achievements.filter(a => a.stars === 3).length / player.achievements.length) * 100
    : 0;

  // Get all hero equipment
  const allEquipment = player.heroEquipment || [];

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link 
          to="/members" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Members
        </Link>

        {/* Player Header Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              {/* Player Avatar */}
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-4xl font-bold text-white">
                  {player.name.charAt(0).toUpperCase()}
                </span>
              </div>

              {/* Player Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{player.name}</h1>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-mono rounded-full">
                    {player.tag}
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Target className="w-4 h-4 text-primary" />
                    Level {player.expLevel}
                  </span>
                  <span className="flex items-center gap-1">
                    <Home className="w-4 h-4 text-blue-500" />
                    TH {player.townHallLevel}
                    {player.townHallWeaponLevel && ` (Weapon ${player.townHallWeaponLevel})`}
                  </span>
                  {player.builderHallLevel && (
                    <span className="flex items-center gap-1">
                      <Building2 className="w-4 h-4 text-purple-500" />
                      BH {player.builderHallLevel}
                    </span>
                  )}
                </div>
              </div>

              {/* League */}
              {player.league && (
                <div className="flex items-center gap-3 bg-white/50 backdrop-blur rounded-xl p-4">
                  <img 
                    src={player.league.iconUrls?.medium}
                    alt={player.league.name}
                    className="w-12 h-12"
                  />
                  <div>
                    <p className="text-xs text-gray-500">League</p>
                    <p className="font-semibold text-gray-900">{player.league.name}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100">
            <div className="p-4 md:p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span className="text-xl md:text-2xl font-bold text-gray-900">{formatNumber(player.trophies)}</span>
              </div>
              <p className="text-xs text-gray-500">Current Trophies</p>
              <p className="text-xs text-gray-400">Best: {formatNumber(player.bestTrophies)}</p>
            </div>
            <div className="p-4 md:p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Star className="w-5 h-5 text-purple-500" />
                <span className="text-xl md:text-2xl font-bold text-gray-900">{formatNumber(player.warStars)}</span>
              </div>
              <p className="text-xs text-gray-500">War Stars</p>
            </div>
            <div className="p-4 md:p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Swords className="w-5 h-5 text-red-500" />
                <span className="text-xl md:text-2xl font-bold text-gray-900">{formatNumber(player.attackWins)}</span>
              </div>
              <p className="text-xs text-gray-500">Attack Wins</p>
            </div>
            <div className="p-4 md:p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Shield className="w-5 h-5 text-blue-500" />
                <span className="text-xl md:text-2xl font-bold text-gray-900">{formatNumber(player.defenseWins)}</span>
              </div>
              <p className="text-xs text-gray-500">Defense Wins</p>
            </div>
          </div>
        </div>

        {/* Clan Info */}
        {player.clan && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Clan Information</h3>
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <img 
                src={player.clan.badgeUrls?.medium}
                alt={player.clan.name}
                className="w-16 h-16 rounded-xl"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{player.clan.name}</h4>
                <p className="text-sm text-gray-500">{player.clan.tag} • Level {player.clan.clanLevel}</p>
              </div>
              <div className="flex flex-wrap gap-4">
                {player.role && (
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Role</p>
                    <p className="font-semibold text-gray-900 capitalize">{player.role.replace(/([A-Z])/g, ' $1').trim()}</p>
                  </div>
                )}
                <div className="text-center">
                  <p className="text-xs text-gray-500">Donations</p>
                  <p className="font-semibold text-green-600">{formatNumber(player.donations)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Received</p>
                  <p className="font-semibold text-orange-600">{formatNumber(player.donationsReceived)}</p>
                </div>
                {player.clanCapitalContributions && (
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Capital</p>
                    <p className="font-semibold text-purple-600">{formatNumber(player.clanCapitalContributions)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900">Troops</h4>
              <span className="text-2xl font-bold text-green-600">{troopCompletion.toFixed(0)}%</span>
            </div>
            <ProgressBar current={troopCompletion} max={100} color="bg-green-500" />
            <p className="text-sm text-gray-500 mt-2">
              {player.troops.filter(t => t.level >= t.maxLevel).length} / {player.troops.length} maxed
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900">Heroes</h4>
              <span className="text-2xl font-bold text-yellow-600">{heroCompletion.toFixed(0)}%</span>
            </div>
            <ProgressBar current={heroCompletion} max={100} color="bg-yellow-500" />
            <p className="text-sm text-gray-500 mt-2">
              {player.heroes.filter(h => h.level >= h.maxLevel).length} / {player.heroes.length} maxed
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900">Achievements</h4>
              <span className="text-2xl font-bold text-blue-600">{achievementCompletion.toFixed(0)}%</span>
            </div>
            <ProgressBar current={achievementCompletion} max={100} color="bg-blue-500" />
            <p className="text-sm text-gray-500 mt-2">
              {player.achievements.filter(a => a.stars === 3).length} / {player.achievements.length} completed
            </p>
          </div>
        </div>

        {/* Player Labels */}
        {player.labels && player.labels.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Player Labels</h3>
            <div className="flex flex-wrap gap-2">
              {player.labels.map((label, index) => (
                <PlayerLabelBadge key={index} label={label} />
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Tab Headers */}
          <div className="flex border-b border-gray-100 overflow-x-auto">
            {[
              { id: 'achievements', label: 'Achievements', icon: Award },
              { id: 'troops', label: 'Troops', icon: Swords },
              { id: 'heroes', label: 'Heroes', icon: Crown },
              { id: 'spells', label: 'Spells', icon: Zap },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'achievements' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {player.achievements.map((achievement, index) => (
                  <AchievementCard key={index} achievement={achievement} />
                ))}
              </div>
            )}

            {activeTab === 'troops' && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {player.troops.map((troop, index) => (
                  <TroopCard key={index} troop={troop} />
                ))}
              </div>
            )}

            {activeTab === 'heroes' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {player.heroes.map((hero, index) => (
                    <HeroCard key={index} hero={hero} />
                  ))}
                </div>
                
                {allEquipment.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Hero Equipment</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {allEquipment.map((equipment, index) => (
                        <HeroEquipmentCard key={index} equipment={equipment} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'spells' && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {player.spells.map((spell, index) => (
                  <SpellCard key={index} spell={spell} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;
