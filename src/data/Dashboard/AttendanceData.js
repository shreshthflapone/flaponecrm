const AttendanceData = [
    {
      name: "Present",
      value: 300,
      breakdown: [
        {
          source: "Course1",
          amount: 150,
          breakdown: [
            { source: "Batch1", amount: 80 },
            { source: "Batch2", amount: 70 },
          ],
        },
        {
          source: "Course2",
          amount: 120,
          breakdown: [
            { source: "Batch1", amount: 60 },
            { source: "Batch2", amount: 60 },
          ],
        },
        {
          source: "Course3",
          amount: 30,
          breakdown: [
            { source: "Batch1", amount: 15 },
            { source: "Batch2", amount: 15 },
          ],
        },
      ],
    },
    {
      name: "Absent",
      value: 100,
      breakdown: [
        {
          source: "Course1",
          amount: 50,
          breakdown: [
            { source: "Batch1", amount: 20 },
            { source: "Batch2", amount: 30 },
          ],
        },
        {
          source: "Course2",
          amount: 30,
          breakdown: [
            { source: "Batch1", amount: 15 },
            { source: "Batch2", amount: 15 },
          ],
        },
        {
          source: "Course3",
          amount: 20,
          breakdown: [
            { source: "Batch1", amount: 10 },
            { source: "Batch2", amount: 10 },
          ],
        },
      ],
    },
  ];
  
  export default AttendanceData;
  