const UserTypeData = [
  {
    name: "Company",
    value: 300,
    breakdown: [
      {
        source: "Student1",
        amount: 100,
        breakdown: [
          { source: "Small RPC1", amount: 50 },
          { source: "Small RPC2", amount: 50 },
        ],
      },
      {
        source: "Student2",
        amount: 120,
        breakdown: [
          { source: "Medium RPC1", amount: 60 },
          { source: "Medium RPC2", amount: 60 },
        ],
      },
      {
        source: "Small RPC and TTT",
        amount: 80,
      },
    ],
  },
  {
    name: "Individual",
    value: 400,
  },
];

export default UserTypeData;
