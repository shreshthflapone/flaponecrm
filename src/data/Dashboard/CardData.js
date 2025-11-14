const data = [
  {
    name: "Facebook",
    value: 400,
    breakdown: [
      {
        source: "Drone",
        amount: 150,
        breakdown: [
          {
            source: "Drone Products",
            amount: 75,
            breakdown: [
              { source: "FB Ads11", amount: 35 },
              { source: "FB Ads21", amount: 40 },
            ],
          },
          {
            source: "Drone Pilot training",
            amount: 25,
            breakdown: [
              { source: "Medium Drone Pilot", amount: 35 },
              { source: "Drone Instructor", amount: 40 },
            ],
          },
        ],
      },
      {
        source: "Aircraft",
        amount: 100,
        breakdown: [
          { source: "FB Promotions1", amount: 75 },
          { source: "FB Promotions2", amount: 75 },
        ],
      },
    ],
  },
  {
    name: "Google",
    value: 300,
   breakdown: [
      {
        source: "Drone",
        amount: 150,
        breakdown: [
          {
            source: "FB Ads1",
            amount: 75,
            breakdown: [
              { source: "FB Ads11", amount: 35 },
              { source: "FB Ads21", amount: 40 },
            ],
          },
          { source: "FB Ads2", amount: 75 },
        ],
      },
      {
        source: "Aircraft",
        amount: 100,
        breakdown: [
          { source: "FB Promotions1", amount: 75 },
          { source: "FB Promotions2", amount: 75 },
        ],
      },
    ],
  },
  {
    name: "Insta",
    value: 300,
    breakdown: [
      {
        source: "Drone",
        amount: 150,
        breakdown: [
          {
            source: "FB Ads1",
            amount: 75,
            breakdown: [
              { source: "FB Ads11", amount: 35 },
              { source: "FB Ads21", amount: 40 },
            ],
          },
          { source: "FB Ads2", amount: 75 },
        ],
      },
      {
        source: "Aircraft",
        amount: 100,
        breakdown: [
          { source: "FB Promotions1", amount: 75 },
          { source: "FB Promotions2", amount: 75 },
        ],
      },
    ],
  },
];
export default data;
