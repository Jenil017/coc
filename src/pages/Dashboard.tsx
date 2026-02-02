import React from 'react';
import { 
  Users, 
  Trophy, 
  Swords, 
  Flame, 
  Shield, 
  TrendingUp,
  Target
} from 'lucide-react';
import { useClanInfo, useWarData, useWarLog, useCapitalRaidData } from '@/hooks/useClanData';
import { Loader } from '@/components/Common/Loader';
import { APIErrorDisplay } from '@/components/Common/ErrorDisplay';
import { BarChart } from '@/components/Charts/BarChart';
import { DoughnutChart } from '@/components/Charts/DoughnutChart';

// Format war frequency for display
const formatWarFrequency = (frequency: string): string => {
  const map: Record<string, string> = {
    'always': 'Always',
    'moreThanOncePerWeek': 'More than once per week',
    'oncePerWeek': 'Once per week',
    'lessThanOncePerWeek': 'Less than once per week',
    'never': 'Never',
    'unknown': 'Unknown',
  };
  return map[frequency] || frequency;
};

// Format clan type for display
const formatClanType = (type: string): string => {
  const map: Record<string, string> = {
    'open': 'Open',
    'inviteOnly': 'Invite Only',
    'closed': 'Closed',
  };
  return map[type] || type;
};

// Format war state for display
const formatWarState = (state: string): string => {
  const map: Record<string, string> = {
    'notInWar': 'Not in War',
    'preparation': 'Preparation',
    'inWar': 'In War',
    'warEnded': 'War Ended',
  };
  return map[state] || state;
};

export const Dashboard: React.FC = () => {
  const { 
    data: clanInfo, 
    loading: clanLoading, 
    error: clanError, 
    refetch: refetchClan 
} = useClanInfo();
  const { 
    data: warData, 
    loading: warLoading 
} = useWarData();
  const { 
    data: warLog, 
    loading: warLogLoading 
} = useWarLog();
  const { 
    data: capitalRaidData, 
    loading: capitalLoading 
} = useCapitalRaidData();

  const isLoading = clanLoading || warLoading || warLogLoading || capitalLoading;

  // Calculate war statistics from war log
  const warStats = React.useMemo(() => {
    if (!warLog?.items) return { wins: 0, losses: 0, ties: 0 };
    
    return warLog.items.reduce((acc, war) => {
      if (war.result === 'win') acc.wins++;
      else if (war.result === 'lose') acc.losses++;
      else if (war.result === 'tie') acc.ties++;
      return acc;
    }, { wins: 0, losses: 0, ties: 0 });
  }, [warLog]);

  // Get top donors from clan members
  const topDonors = React.useMemo(() => {
    if (!clanInfo?.memberList) return [];
    
    return [...clanInfo.memberList]
      .sort((a, b) => b.donations - a.donations)
      .slice(0, 8);
  }, [clanInfo]);

  // Get top capital contributors
  const topCapitalContributors = React.useMemo(() => {
    if (!capitalRaidData || capitalRaidData.length === 0) return [];
    
    const latestSeason = capitalRaidData[0];
    if (!latestSeason.members) return [];
    
    return [...latestSeason.members]
      .sort((a, b) => b.capitalResourcesLooted - a.capitalResourcesLooted)
      .slice(0, 6);
  }, [capitalRaidData]);

  if (isLoading && !clanInfo) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Loader fullScreen text="Loading dashboard..." />
        </div>
      </div>
    );
  }

  if (clanError) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <APIErrorDisplay error={clanError} onRetry={refetchClan} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of your clan's performance</p>
        </div>

        {/* Clan Overview Card */}
        {clanInfo && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 border-b border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                {/* Clan Badge */}
                <div className="flex-shrink-0">
                  <img 
                    src={clanInfo.badgeUrls?.medium} 
                    alt={clanInfo.name}
                    className="w-24 h-24 rounded-xl shadow-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/96?text=Clan';
                    }}
                  />
                </div>

                {/* Clan Info */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">{clanInfo.name}</h2>
                    <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full">
                      Level {clanInfo.clanLevel}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                      {clanInfo.tag}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{clanInfo.description || 'No description'}</p>
                  
                  {/* Quick Stats */}
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="text-gray-600">
                        {clanInfo.members}/50 members
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span className="text-gray-600">
                        {clanInfo.requiredTrophies}+ trophies required
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Swords className="w-4 h-4 text-red-500" />
                      <span className="text-gray-600">
                        {formatWarFrequency(clanInfo.warFrequency)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-600">
                        {formatClanType(clanInfo.type)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100">
              <div className="p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <span className="text-2xl font-bold text-gray-900">{clanInfo.warWinStreak}</span>
                </div>
                <p className="text-sm text-gray-500">War Win Streak</p>
              </div>
              <div className="p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <span className="text-2xl font-bold text-gray-900">{clanInfo.warWins}</span>
                </div>
                <p className="text-sm text-gray-500">Total War Wins</p>
              </div>
              <div className="p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-yellow-500" />
                  <span className="text-2xl font-bold text-gray-900">{clanInfo.warTies}</span>
                </div>
                <p className="text-sm text-gray-500">War Ties</p>
              </div>
              <div className="p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-red-500" />
                  <span className="text-2xl font-bold text-gray-900">{clanInfo.warLosses}</span>
                </div>
                <p className="text-sm text-gray-500">War Losses</p>
              </div>
            </div>
          </div>
        )}

        {/* Current War Status */}
        {warData && warData.state !== 'notInWar' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Swords className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold text-gray-900">Current War</h3>
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                warData.state === 'inWar' ? 'bg-green-100 text-green-700' :
                warData.state === 'preparation' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {formatWarState(warData.state)}
              </span>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Our Clan */}
              <div className="flex items-center gap-4">
                <img 
                  src={warData.clan.badgeUrls?.medium}
                  alt={warData.clan.name}
                  className="w-16 h-16 rounded-lg"
                />
                <div>
                  <p className="font-semibold text-gray-900">{warData.clan.name}</p>
                  <p className="text-sm text-gray-500">Level {warData.clan.clanLevel}</p>
                </div>
              </div>

              {/* Score */}
              <div className="text-center">
                <div className="flex items-center gap-4 text-3xl font-bold">
                  <span className="text-primary">{warData.clan.stars}</span>
                  <span className="text-gray-400">-</span>
                  <span className="text-red-500">{warData.opponent.stars}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {warData.teamSize}v{warData.teamSize} War
                </p>
              </div>

              {/* Opponent */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{warData.opponent.name}</p>
                  <p className="text-sm text-gray-500">Level {warData.opponent.clanLevel}</p>
                </div>
                <img 
                  src={warData.opponent.badgeUrls?.medium}
                  alt={warData.opponent.name}
                  className="w-16 h-16 rounded-lg"
                />
              </div>
            </div>

            {/* Destruction Percentage */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Our Destruction</span>
                  <span className="font-semibold">{warData.clan.destructionPercentage.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${warData.clan.destructionPercentage}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Opponent Destruction</span>
                  <span className="font-semibold">{warData.opponent.destructionPercentage.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500 rounded-full transition-all duration-500"
                    style={{ width: `${warData.opponent.destructionPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* War Performance Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">War Performance</h3>
            {warLogLoading ? (
              <div className="h-64 md:h-80 flex items-center justify-center">
                <Loader text="Loading war data..." />
              </div>
            ) : warStats.wins + warStats.losses + warStats.ties > 0 ? (
              <DoughnutChart
                labels={['Wins', 'Losses', 'Ties']}
                data={[warStats.wins, warStats.losses, warStats.ties]}
                backgroundColor={['#10b981', '#ef4444', '#f59e0b']}
                height="280px"
              />
            ) : (
              <div className="h-64 md:h-80 flex items-center justify-center text-gray-400">
                No war data available
              </div>
            )}
          </div>

          {/* Top Donors Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Top Donors</h3>
            {clanLoading ? (
              <div className="h-64 md:h-80 flex items-center justify-center">
                <Loader text="Loading donor data..." />
              </div>
            ) : topDonors.length > 0 ? (
              <BarChart
                labels={topDonors.map(d => d.name.length > 10 ? d.name.slice(0, 10) + '...' : d.name)}
                datasets={[
                  {
                    label: 'Donations Given',
                    data: topDonors.map(d => d.donations),
                    backgroundColor: '#10b981',
                  },
                  {
                    label: 'Donations Received',
                    data: topDonors.map(d => d.donationsReceived),
                    backgroundColor: '#f59e0b',
                  },
                ]}
                height="280px"
              />
            ) : (
              <div className="h-64 md:h-80 flex items-center justify-center text-gray-400">
                No donor data available
              </div>
            )}
          </div>

          {/* Capital Contributors Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Top Capital Contributors</h3>
            {capitalLoading ? (
              <div className="h-64 md:h-80 flex items-center justify-center">
                <Loader text="Loading capital data..." />
              </div>
            ) : topCapitalContributors.length > 0 ? (
              <DoughnutChart
                labels={topCapitalContributors.map(c => c.name.length > 10 ? c.name.slice(0, 10) + '...' : c.name)}
                data={topCapitalContributors.map(c => c.capitalResourcesLooted)}
                backgroundColor={[
                  '#FFD700',
                  '#FFA500',
                  '#FF8C00',
                  '#FF6347',
                  '#DC143C',
                  '#8B0000',
                ]}
                height="280px"
              />
            ) : (
              <div className="h-64 md:h-80 flex items-center justify-center text-gray-400">
                No capital raid data available
              </div>
            )}
          </div>

          {/* Clan Points */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Clan Points</h3>
            {clanInfo ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-8 h-8 text-yellow-500" />
                    <div>
                      <p className="text-sm text-gray-600">Home Village</p>
                      <p className="text-2xl font-bold text-gray-900">{clanInfo.clanPoints.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                {clanInfo.clanBuilderBasePoints && (
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Shield className="w-8 h-8 text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-600">Builder Base</p>
                        <p className="text-2xl font-bold text-gray-900">{clanInfo.clanBuilderBasePoints.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                )}
                {clanInfo.clanCapitalPoints && (
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Target className="w-8 h-8 text-purple-500" />
                      <div>
                        <p className="text-sm text-gray-600">Clan Capital</p>
                        <p className="text-2xl font-bold text-gray-900">{clanInfo.clanCapitalPoints.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">
                No clan points data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
