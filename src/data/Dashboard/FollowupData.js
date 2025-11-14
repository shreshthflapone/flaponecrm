const FollowupData = [
  {
    name: "Today",
    value: 50,
    percentage: "60%",
    breakdown: [
      { source: "T1", amount: 120, percentage: "60%" },
      { source: "T2", amount: 80, percentage: "20%" },
      { source: "T3", amount: 100, percentage: "20%" },
    ],
    redirectData: {
      tab: "all",
      date_type: "enquirydate",
    },
  },
  {
    name: "Upcoming",
    value: 1400,
    breakdown: [
      {
        source: "Upcoming1",
        amount: 150,
        breakdown: [
          {
            source: "Upcoming11",
            amount: 75,
            breakdown: [
              {
                source: "Upcoming20",
                amount: 35,
                redirectData: {
                  tab: "all",
                  date_type: "followupdate",
                },
              },
              {
                source: "Upcoming21",
                amount: 40,
                redirectData: {
                  tab: "all",
                  date_type: "followupdate",
                },
              },
            ],
          },
          { source: "FB Ads2", amount: 75 },
        ],
      },
      {
        source: "Upcoming2",
        amount: 100,
        breakdown: [
          { source: "Upcoming21", amount: 75 },
          { source: "Upcoming22", amount: 75 },
        ],
      },
      { source: "Upcoming30", amount: 50 },
      { source: "Upcoming31", amount: 100 },
    ],
    redirectData: {
      tab: "all",
      date_type: "followupdate",
    },
  },
  {
    name: "Missed",
    value: 300,
    breakdown: [
      {
        source: "Missed1",
        amount: 120,
        redirectData: {
          tab: "all",
          date_type: "followupdate",
        },
      },
      {
        source: "Missed2",
        amount: 80,
        redirectData: {
          tab: "all",
          date_type: "followupdate",
        },
      },
      {
        source: "Missed3",
        amount: 100,
        redirectData: {
          tab: "all",
          date_type: "followupdate",
        },
      },
    ],
    redirectData: {
      tab: "all",
      date_type: "followupdate",
    },
  },
];
export default FollowupData;
