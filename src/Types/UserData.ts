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
  
  export const userDataExample: UserData = {
    userId: "abc123",
    statsPeriod: 'All time',
    stats: {
      last5Games: {
        gamesPlayed: 5,
        wins: 1,
        rolesPlayed: {
          "Monarch": 1,
          "Knight": 1,
          "Bandit": 2,
          "Renegade": 1,
          "Noble": 0
        },
        winsPerRole: {
            "Monarch": 0,
            "Knight": 0,
            "Bandit": 0,
            "Renegade": 1,
            "Noble": 0
          },
      },
      last10Games: {
        gamesPlayed: 10,
        wins: 3,
        rolesPlayed: {
          "Monarch": 3,
          "Knight": 2,
          "Bandit": 3,
          "Renegade": 1,
          "Noble": 1
        },
        winsPerRole: {
            "Monarch": 1,
            "Knight": 0,
            "Bandit": 0,
            "Renegade": 0,
            "Noble": 0
          },
      },
      allTime: {
        gamesPlayed: 100,
        wins: 25,
        rolesPlayed: {
          "Monarch": 26,
          "Knight": 45,
          "Bandit": 25,
          "Renegade": 3,
          "Noble": 1
        },
        winsPerRole: {
            "Monarch": 10,
            "Knight": 5,
            "Bandit": 8,
            "Renegade": 1,
            "Noble": 0
        },
      },
    },
  };