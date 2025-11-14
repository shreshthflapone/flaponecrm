const CategoryData = [
    {
      name: "Drone",
      value: 300,
      percentage:"60%",
      breakdown: [
        {
          source: "Small RPC",
          amount: 100,
          breakdown: [
            { 
              source: "Small RPC1", 
              amount: 50 
            },
            {
               source: "Small RPC2",
                amount: 50 
            },
          ],
        },
        {
          source: "Medium RPC",
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
      name: "Aircraft",
      value: 400,
      breakdown: [
        { source: "Aircraft CPL", amount: 120 },
        { source: "ATPL", amount: 100 },
        {
          source: "A320 Rated Pilots",
          amount: 80,
          breakdown: [
            { source: "A320 Rated Pilots1", amount: 40 },
            { source: "A320 Rated Pilots2", amount: 40 },
          ],
        },
        {
          source: "Radio Telephony",
          amount: 100,
          breakdown: [
            { source: "Radio Telephony1", amount: 50 },
            { source: "Radio Telephony2", amount: 50 },
          ],
        },
      ],
    },
  ];
  
  export default CategoryData;
  