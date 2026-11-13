import React from 'react';
import { ScreenId } from '../types/models';
import { Bell, ChevronLeft, Map, Mic, MoreHorizontal, User, Wifi, WifiOff } from 'lucide-react';

interface StatusBarProps {
  darkTheme?: boolean;
  offlineMode?: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({ darkTheme = false, offlineMode = false }) => {
  const textColor = darkTheme ? 'text-white' : 'text-[#1A1A1A]';
  return (
    <div className={`w-full px-7 pt-3 pb-1.5 flex items-center justify-between select-none shrink-0 ${textColor}`}>
      <span className="font-bold text-[16px] tracking-tight">9:41</span>
      <div className="flex items-center gap-2">
        {offlineMode && (
          <span className="px-1.5 py-0.5 rounded bg-[#EF9F27]/20 text-[#854F0B] text-[9px] font-bold flex items-center gap-1">
            <WifiOff className="w-2.5 h-2.5" /> OFFLINE
          </span>
        )}
        {/* Signal Bars */}
        <div className="flex items-end gap-[2px] h-3">
          <span className={`w-[3px] h-[4px] rounded-[1px] ${darkTheme ? 'bg-white' : 'bg-[#1A1A1A]'}`} />
          <span className={`w-[3px] h-[6px] rounded-[1px] ${darkTheme ? 'bg-white' : 'bg-[#1A1A1A]'}`} />
          <span className={`w-[3px] h-[8px] rounded-[1px] ${darkTheme ? 'bg-white' : 'bg-[#1A1A1A]'}`} />
          <span className={`w-[3px] h-[10px] rounded-[1px] ${darkTheme ? 'bg-white' : 'bg-[#1A1A1A]'}`} />
        </div>
        {!offlineMode && <Wifi className="w-3.5 h-3.5 stroke-[2.3]" />}
        {/* Battery */}
        <div className="flex items-center">
          <div className={`w-[22px] h-[11px] rounded-[3px] border ${darkTheme ? 'border-white/80' : 'border-[#1A1A1A]/80'} p-[1.5px] flex items-center`}>
            <div className={`w-[15px] h-full rounded-[1.5px] ${darkTheme ? 'bg-white' : 'bg-[#1A1A1A]'}`} />
          </div>
          <div className={`w-[1.5px] h-[4px] rounded-r ${darkTheme ? 'bg-white/80' : 'bg-[#1A1A1A]/80'} ml-[1px]`} />
        </div>
      </div>
    </div>
  );
};

interface TopSubHeaderProps {
  title: string;
  onBack?: () => void;
  rightBadge?: string;
  rightBadgeColor?: 'green' | 'purple' | 'amber';
  showMore?: boolean;
  onMoreClick?: () => void;
}

export const TopSubHeader: React.FC<TopSubHeaderProps> = ({
  title,
  onBack,
  rightBadge,
  rightBadgeColor = 'green',
  showMore = false,
  onMoreClick,
}) => {
  const badgeClasses =
    rightBadgeColor === 'purple'
      ? 'bg-[#EEEDFE] text-[#534AB7]'
      : rightBadgeColor === 'amber'
      ? 'bg-[#FAECD8] text-[#854F0B]'
      : 'bg-[#EAF2E2] text-[#3B6D11]';

  return (
    <div className="w-full h-13 px-5 py-3 bg-white border-b border-[#E5E3DC] flex items-center justify-between shrink-0">
      <button
        type="button"
        onClick={onBack}
        className="w-8 h-8 -ml-1.5 rounded-full hover:bg-[#F7F6F1] flex items-center justify-center text-[#1A1A1A] transition"
        aria-label="Voltar"
      >
        <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
      </button>
      <h1 className="font-bold text-[16px] text-[#1A1A1A] truncate max-w-[210px] text-center">
        {title}
      </h1>
      <div className="min-w-[32px] flex items-center justify-end">
        {rightBadge ? (
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide ${badgeClasses}`}>
            {rightBadge}
          </span>
        ) : showMore ? (
          <button
            type="button"
            onClick={onMoreClick}
            className="w-8 h-8 rounded-full hover:bg-[#F7F6F1] flex items-center justify-center text-[#1A1A1A]"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        ) : (
          <span className="w-6" />
        )}
      </div>
    </div>
  );
};

interface BottomNavBarProps {
  activeTab: 'MAPA' | 'ALERTAS' | 'VOZ' | 'PERFIL';
  unreadAlertsCount?: number;
  onNavigate: (screen: ScreenId) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  unreadAlertsCount = 2,
  onNavigate,
}) => {
  const tabs: Array<{
    key: 'MAPA' | 'ALERTAS' | 'VOZ' | 'PERFIL';
    label: string;
    screen: ScreenId;
    icon: React.ReactNode;
    badge?: boolean;
  }> = [
    {
      key: 'MAPA',
      label: 'Mapa',
      screen: 'tela-09',
      icon: <Map className="w-5 h-5" />,
    },
    {
      key: 'ALERTAS',
      label: 'Alertas',
      screen: 'tela-11',
      icon: <Bell className="w-5 h-5" />,
      badge: unreadAlertsCount > 0,
    },
    {
      key: 'VOZ',
      label: 'Voz',
      screen: 'tela-30',
      icon: <Mic className="w-5 h-5" />,
    },
    {
      key: 'PERFIL',
      label: 'Perfil',
      screen: 'tela-12',
      icon: <User className="w-5 h-5" />,
    },
  ];

  return (
    <div className="w-full bg-white border-t border-[#E5E3DC] pt-2 pb-1.5 px-6 shrink-0 select-none">
      <div className="grid grid-cols-4 gap-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onNavigate(tab.screen)}
              className={`relative flex flex-col items-center justify-center py-1 rounded-xl transition ${
                isActive ? 'text-[#3B6D11] font-bold' : 'text-[#5F5E5A] hover:text-[#1A1A1A] font-normal'
              }`}
            >
              <div className="relative">
                {tab.icon}
                {tab.badge && (
                  <span className="absolute -top-0.5 -right-1 w-2.5 h-2.5 rounded-full bg-[#E24B4A] ring-2 ring-white" />
                )}
              </div>
              <span className="text-[10px] mt-1">{tab.label}</span>
            </button>
          );
        })}
      </div>
      <div className="w-full flex justify-center mt-2">
        <div className="w-[134px] h-[5px] rounded-full bg-[#1A1A1A]/90" />
      </div>
    </div>
  );
};

export const HomeIndicatorOnly: React.FC<{ dark?: boolean }> = ({ dark = false }) => (
  <div className="w-full py-2 flex justify-center shrink-0">
    <div className={`w-[134px] h-[5px] rounded-full ${dark ? 'bg-white/70' : 'bg-[#1A1A1A]/85'}`} />
  </div>
);
