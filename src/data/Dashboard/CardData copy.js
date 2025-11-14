const data = [
  {
    name: "Facebook",
    value: 400,
    breakdown: [
      {
        source: "FB Ads",
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
        source: "FB Promotions",
        amount: 100,
        breakdown: [
          { source: "FB Promotions1", amount: 75 },
          { source: "FB Promotions2", amount: 75 },
        ],
      },
      { source: "FB Organic", amount: 50 },
      { source: "FB Referrals", amount: 100 },
    ],
  },
  {
    name: "Google",
    value: 300,
    breakdown: [
      { source: "Google Ads", amount: 120 },
      { source: "Google SEO", amount: 80 },
      { source: "Google Referrals", amount: 100 },
    ],
  },
  {
    name: "Insta",
    value: 300,
    breakdown: [
      { source: "Insta Ads", amount: 200 },
      { source: "Insta Organic", amount: 50 },
      { source: "Insta Influencers", amount: 50 },
    ],
  },
];
export default data;
