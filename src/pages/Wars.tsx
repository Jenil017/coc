import React from 'react';
import { Swords, Trophy, Calendar } from 'lucide-react';
import { useWarData, useWarLog, useCWLData } from '@/hooks/useClanData';
import { Loader } from '@/components/Common/Loader';
import { APIErrorDisplay } from '@/components/Common/ErrorDisplay';
import { BarChart } from '@/components/Charts/BarChart';

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

// War Result Badge
const WarResultBadge: React.FC<{ result?: 'win' | 'lose' | 'tie' }> = ({ result }) => {
  if (!result) return <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">-</span>;
  
  const config = {
    win: { className: 'bg-green-100 text-green-700', label: 'WIN' },
    lose: { className: 'bg-red-100 text-red-700', label: 'LOSE' },
    tie: { className: 'bg-yellow-100 text-yellow-700', label: 'TIE' },
  };

  const { className, label } = config[result];

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-bold ${className}`}>
      {label}
    </span>
  );
};

export const Wars: React.FC = () => {
  const { data: warData, loading: warLoading, error: warError, refetch: refetchWar } = useWarData();
  const { data: warLog, loading: warLogLoading, error: warLogError, refetch: refetchWarLog } = useWarLog();
  const { data: cwlData, loading: cwlLoading } = useCWLData();

  // Prepare war history chart data
  const warHistoryData = React.useMemo(() => {
    if (!warLog?.items) return { labels: [], ourStars: [], opponentStars: [] };
    
    // Reverse to show oldest first
    const items = [...warLog.items].reverse();
    
    return {
      labels: items.map((_, i) => `War ${i + 1}`),
      ourStars: items.map(w => w.clan.stars),
      opponentStars: items.map(w => w.opponent.stars),
    };
  }, [warLog]);

  const isLoading = warLoading && warLogLoading && cwlLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Loader fullScreen text="Loading war data..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">War Statistics</h1>
          <p className="text-gray-500 mt-1">Track your clan's war performance</p>
        </div>

        {/* Current War Section */}
        {warError ? (
          <div className="mb-8">
            <APIErrorDisplay error={warError} onRetry={refetchWar} />
          </div>
        ) : warData && warData.state !== 'notInWar' ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Swords className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-bold text-gray-900">Current War</h2>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                  warData.state === 'inWar' ? 'bg-green-100 text-green-700' :
                  warData.state === 'preparation' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {formatWarState(warData.state)}
                </span>
              </div>
            </div>

            <div className="p-6">
              {/* War Header */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                {/* Our Clan */}
                <div className="flex items-center gap-4">
                  <img 
                    src={warData.clan.badgeUrls?.medium}
                    alt={warData.clan.name}
                    className="w-20 h-20 rounded-xl shadow-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80?text=Clan';
                    }}
                  />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{warData.clan.name}</h3>
                    <p className="text-sm text-gray-500">Level {warData.clan.clanLevel}</p>
                  </div>
                </div>

                {/* Score */}
                <div className="text-center">
                  <div className="flex items-center gap-6 text-4xl font-bold">
                    <span className="text-primary">{warData.clan.stars}</span>
                    <span className="text-gray-300">-</span>
                    <span className="text-red-500">{warData.opponent.stars}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {warData.teamSize}v{warData.teamSize} War
                  </p>
                  {warData.battleModifier && (
                    <span className="inline-block mt-2 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                      {warData.battleModifier}
                    </span>
                  )}
                </div>

                {/* Opponent */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <h3 className="text-lg font-bold text-gray-900">{warData.opponent.name}</h3>
                    <p className="text-sm text-gray-500">Level {warData.opponent.clanLevel}</p>
                  </div>
                  <img 
                    src={warData.opponent.badgeUrls?.medium}
                    alt={warData.opponent.name}
                    className="w-20 h-20 rounded-xl shadow-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80?text=Clan';
                    }}
                  />
                </div>
              </div>

              {/* War Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-500 mb-1">Our Attacks</p>
                  <p className="text-2xl font-bold text-gray-900">{warData.clan.attacks}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-500 mb-1">Our Destruction</p>
                  <p className="text-2xl font-bold text-primary">{warData.clan.destructionPercentage.toFixed(1)}%</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-500 mb-1">Opponent Attacks</p>
                  <p className="text-2xl font-bold text-gray-900">{warData.opponent.attacks}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-500 mb-1">Opponent Destruction</p>
                  <p className="text-2xl font-bold text-red-500">{warData.opponent.destructionPercentage.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8 text-center">
            <Swords className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Not in War</h3>
            <p className="text-gray-500">Your clan is currently not participating in any war.</p>
          </div>
        )}

        {/* CWL Section */}
        {cwlData && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-6 border-b border-yellow-200">
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-yellow-600" />
                <h2 className="text-xl font-bold text-gray-900">Clan War League</h2>
                <span className="px-3 py-1 bg-yellow-200 text-yellow-800 text-sm font-semibold rounded-full">
                  {cwlData.state === 'ended' ? 'Ended' : 
                   cwlData.state === 'inWar' ? 'In Progress' : 
                   cwlData.state === 'preparation' ? 'Preparation' : 'Not Started'}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">Season: {cwlData.season}</span>
              </div>

              {/* CWL Standings */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Rank</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Clan</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Level</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Members</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cwlData.clans.map((clan, index) => (
                      <tr 
                        key={clan.tag} 
                        className={`border-b border-gray-50 ${
                          index === 0 ? 'bg-yellow-50/50' : ''
                        }`}
                      >
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                            index === 0 ? 'bg-yellow-100 text-yellow-700' :
                            index === 1 ? 'bg-gray-100 text-gray-700' :
                            index === 2 ? 'bg-orange-100 text-orange-700' :
                            'bg-gray-50 text-gray-600'
                          }`}>
                            {index + 1}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img 
                              src={clan.badgeUrls?.small}
                              alt={clan.name}
                              className="w-8 h-8 rounded"
                            />
                            <span className="font-medium text-gray-900">{clan.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full">
                            {clan.clanLevel}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center text-gray-600">
                          {clan.members.length}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* War History Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* War History Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">War History</h3>
            {warLogLoading ? (
              <div className="h-64 md:h-80 flex items-center justify-center">
                <Loader text="Loading war history..." />
              </div>
            ) : warLogError ? (
              <APIErrorDisplay error={warLogError} onRetry={refetchWarLog} />
            ) : warHistoryData.labels.length > 0 ? (
              <BarChart
                labels={warHistoryData.labels}
                datasets={[
                  {
                    label: 'Our Stars',
                    data: warHistoryData.ourStars,
                    backgroundColor: '#10b981',
                  },
                  {
                    label: 'Opponent Stars',
                    data: warHistoryData.opponentStars,
                    backgroundColor: '#ef4444',
                  },
                ]}
                height="280px"
              />
            ) : (
              <div className="h-64 md:h-80 flex items-center justify-center text-gray-400">
                No war history available
              </div>
            )}
          </div>

          {/* War History Table */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Wars</h3>
            {warLogLoading ? (
              <div className="h-64 flex items-center justify-center">
                <Loader text="Loading war history..." />
              </div>
            ) : warLogError ? (
              <APIErrorDisplay error={warLogError} onRetry={refetchWarLog} />
            ) : warLog?.items && warLog.items.length > 0 ? (
              <div className="overflow-x-auto max-h-80 overflow-y-auto">
                <table className="w-full">
                  <thead className="sticky top-0 bg-white">
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Opponent</th>
                      <th className="text-center py-3 px-2 text-sm font-semibold text-gray-600">Result</th>
                      <th className="text-center py-3 px-2 text-sm font-semibold text-gray-600">Stars</th>
                      <th className="text-center py-3 px-2 text-sm font-semibold text-gray-600">Destruction</th>
                    </tr>
                  </thead>
                  <tbody>
                    {warLog.items.map((war, index) => (
                      <tr key={index} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <img 
                              src={war.opponent.badgeUrls?.small}
                              alt={war.opponent.name}
                              className="w-6 h-6 rounded"
                            />
                            <span className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                              {war.opponent.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <WarResultBadge result={war.result} />
                        </td>
                        <td className="py-3 px-2 text-center">
                          <span className={`text-sm font-semibold ${
                            (war.clan.stars > war.opponent.stars) ? 'text-green-600' :
                            (war.clan.stars < war.opponent.stars) ? 'text-red-600' :
                            'text-yellow-600'
                          }`}>
                            {war.clan.stars} - {war.opponent.stars}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <span className="text-sm text-gray-600">
                            {war.clan.destructionPercentage.toFixed(0)}% - {war.opponent.destructionPercentage.toFixed(0)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">
                No war history available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wars;
