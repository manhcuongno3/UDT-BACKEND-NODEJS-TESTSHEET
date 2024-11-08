const testCase = [
  {
    neededContainer: 3,
    listContainer: [
      {
        name: 'Container renter A',
        container: 1,
        totalCost: 1
      },
      {
        name: 'Container renter B',
        container: 2,
        totalCost: 1
      },
      {
        name: 'Container renter C',
        container: 3,
        totalCost: 3
      }
    ]
  },
  {
    neededContainer: 10,
    listContainer: [
      {
        name: 'Container renter A',
        container: 5,
        totalCost: 5
      },
      {
        name: 'Container renter B',
        container: 2,
        totalCost: 10
      },
      {
        name: 'Container renter C',
        container: 2,
        totalCost: 3
      }
    ]
  },
  {
    neededContainer: 10,
    listContainer: [
      {
        name: 'Container renter A',
        container: 5,
        totalCost: 5
      },
      {
        name: 'Container renter B',
        container: 2,
        totalCost: 10
      },
      {
        name: 'Container renter C',
        container: 10,
        totalCost: 3
      }
    ]
  },
]

testCase.forEach(({ neededContainer, listContainer }, index) => {
  console.log(`[Test Case ${index + 1}]`);
  listContainer.sort((a, b) => a.totalCost/a.container - b.totalCost/b.container);

  let totalContainers = 0;
  let totalCost = 0;
  const selectedContainers = [];

  for (const renter of listContainer) {
    if (totalContainers >= neededContainer) break;

    totalContainers += renter.container;
    totalCost += renter.totalCost;  
    selectedContainers.push(`[Contract with] ${renter.name} ${renter.container} container(s), price: ${renter.totalCost}`);
  }

  selectedContainers.forEach(contract => console.log(contract));
  if(totalContainers<neededContainer){
    console.log('Not enough containers');
  }
  console.log(`[Summary] total cost ${totalCost}`);
});