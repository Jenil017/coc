import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Trophy, 
  ArrowUp, 
  ArrowDown, 
  Star, 
  Filter,
  RefreshCw,
  Crown,
  Shield,
  User,
  Users,
  ChevronDown,
  Loader2
} from 'lucide-react';
import { useClanMembers, useWarStars } from '@/hooks/useClanData';
import { Loader } from '@/components/Common/Loader';
import { APIErrorDisplay } from '@/components/Common/ErrorDisplay';
import type { ClanMember, SortOption, RoleFilter, THFilter } from '@/types/coc';

// Role badge component
const RoleBadge: React.FC<{ role: string }> = ({ role }) => {
  const roleConfig: Record<string, { icon: React.ReactNode; className: string; label: string }> = {
    leader: {
      icon: <Crown className="w-3 h-3" />,
      className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      label: 'Leader',
    },
    coLeader: {
      icon: <Shield className="w-3 h-3" />,
      className: 'bg-purple-100 text-purple-700 border-purple-200',
      label: 'Co-Leader',
    },
    admin: {
      icon: <Shield className="w-3 h-3" />,
      className: 'bg-blue-100 text-blue-700 border-blue-200',
      label: 'Elder',
    },
    member: {
      icon: <User className="w-3 h-3" />,
      className: 'bg-gray-100 text-gray-700 border-gray-200',
      label: 'Member',
    },
  };

  const config = roleConfig[role] || roleConfig.member;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${config.className}`}>
      {config.icon}
      {config.label}
    </span>
  );
};

// Member Card Component
interface MemberCardProps {
  member: ClanMember;
  warStars?: number;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, warStars }) => {
  return (
    <Link 
      to={`/player/${encodeURIComponent(member.tag)}`}
      className="block bg-white rounded-xl shadow-md border border-gray-100 p-5 hover:shadow-lg hover:border-primary/20 transition-all duration-200 group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
            <span className="text-lg font-bold text-primary">
              {member.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
              {member.name}
            </h3>
            <RoleBadge role={member.role} />
          </div>
        </div>
        {member.league && (
          <img 
            src={member.league.iconUrls?.small || member.league.iconUrls?.tiny}
            alt={member.league.name}
            className="w-8 h-8"
            title={member.league.name}
          />
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Town Hall */}
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">Town Hall</p>
          <p className="font-semibold text-gray-900">
            {member.townHallLevel ? `TH ${member.townHallLevel}` : 'Unknown'}
          </p>
        </div>

        {/* Trophies */}
        <div className="bg-yellow-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">Trophies</p>
          <div className="flex items-center gap-1">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="font-semibold text-gray-900">{member.trophies.toLocaleString()}</span>
          </div>
        </div>

        {/* Donations Given */}
        <div className="bg-green-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">Donations</p>
          <div className="flex items-center gap-1">
            <ArrowUp className="w-4 h-4 text-green-500" />
            <span className="font-semibold text-gray-900">{member.donations.toLocaleString()}</span>
          </div>
        </div>

        {/* War Stars */}
        <div className="bg-purple-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">War Stars</p>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-purple-500" />
            <span className="font-semibold text-gray-900">
              {warStars !== undefined ? warStars.toLocaleString() : '-'}
            </span>
          </div>
        </div>
      </div>

      {/* Donations Received */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Received</span>
          <div className="flex items-center gap-1">
            <ArrowDown className="w-4 h-4 text-orange-500" />
            <span className="font-medium text-gray-900">{member.donationsReceived.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Player Tag */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-400 font-mono">{member.tag}</p>
      </div>
    </Link>
  );
};

export const Members: React.FC = () => {
  const { data: members, loading, error, refetch } = useClanMembers();
  const { warStarsMap, loading: warStarsLoading, fetchWarStars } = useWarStars();
  
  // Filter states
  const [sortBy, setSortBy] = useState<SortOption>('trophies');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [thFilter, setTHFilter] = useState<THFilter>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch war stars when members load
  useEffect(() => {
    if (members && members.length > 0) {
      fetchWarStars(members);
    }
  }, [members, fetchWarStars]);

  // Filter and sort members
  const filteredMembers = useMemo(() => {
    if (!members) return [];

    let result = [...members];

    // Apply role filter
    if (roleFilter !== 'all') {
      result = result.filter(m => m.role === roleFilter);
    }

    // Apply TH filter
    if (thFilter !== 'all') {
      const thLevel = parseInt(thFilter);
      result = result.filter(m => m.townHallLevel === thLevel);
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'trophies':
          return b.trophies - a.trophies;
        case 'townHall':
          return (b.townHallLevel || 0) - (a.townHallLevel || 0);
        case 'donations':
          return b.donations - a.donations;
        case 'warStars':
          const starsA = warStarsMap[a.tag] || 0;
          const starsB = warStarsMap[b.tag] || 0;
          return starsB - starsA;
        case 'activity':
          // Sort by donations + donations received as activity indicator
          return (b.donations + b.donationsReceived) - (a.donations + a.donationsReceived);
        default:
          return 0;
      }
    });

    return result;
  }, [members, sortBy, roleFilter, thFilter, warStarsMap]);

  if (loading && !members) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Loader fullScreen text="Loading members..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <APIErrorDisplay error={error} onRetry={refetch} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Clan Members</h1>
            <p className="text-gray-500 mt-1">
              Showing {filteredMembers.length} of {members?.length || 0} members
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {sortBy === 'warStars' && (
              <button
                onClick={() => members && fetchWarStars(members)}
                disabled={warStarsLoading}
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors disabled:opacity-50"
              >
                {warStarsLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                Refresh War Stars
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                showFilters 
                  ? 'bg-primary text-white' 
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 mb-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="trophies">Trophies</option>
                  <option value="townHall">Town Hall Level</option>
                  <option value="donations">Donations</option>
                  <option value="warStars">War Stars</option>
                  <option value="activity">Activity</option>
                </select>
              </div>

              {/* Role Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="all">All Roles</option>
                  <option value="leader">Leader</option>
                  <option value="coLeader">Co-Leader</option>
                  <option value="admin">Elder</option>
                  <option value="member">Member</option>
                </select>
              </div>

              {/* TH Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Town Hall
                </label>
                <select
                  value={thFilter}
                  onChange={(e) => setTHFilter(e.target.value as THFilter)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="all">All Levels</option>
                  <option value="16">TH 16</option>
                  <option value="15">TH 15</option>
                  <option value="14">TH 14</option>
                  <option value="13">TH 13</option>
                  <option value="12">TH 12</option>
                  <option value="11">TH 11</option>
                  <option value="10">TH 10</option>
                  <option value="9">TH 9</option>
                  <option value="8">TH 8</option>
                  <option value="7">TH 7</option>
                  <option value="6">TH 6</option>
                  <option value="5">TH 5</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Members Grid */}
        {filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <MemberCard 
                key={member.tag} 
                member={member} 
                warStars={warStarsMap[member.tag]}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No members found</h3>
            <p className="text-gray-500">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Members;
