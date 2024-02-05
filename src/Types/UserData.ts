export type UserData = {
    userId: string;
    statsPeriod: 'All time' | 'Last 10' | 'Last 5'  ;
    stats: {
      last5Games?: GameStatsSummary;
      last10Games?: GameStatsSummary;
      allTime?: GameStatsSummary;
    };
  };
  
  export type GameStatsSummary = {
    gamesPlayed: number;
    wins: number;
    rolesPlayed: {
        [roleName: string]: number;
    };
    winsPerRole: {
        [roleName: string]: number,
    }
  };