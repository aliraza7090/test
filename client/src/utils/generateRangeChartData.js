const generateRangeChartData = (days = 30, data = []) => {
    
    return Array(days).fill(0).map((_, day) => {
        const y = data[day]?.profit || 0
  
        return {x: (day +1).toString(), y: [y]}
    
    });
};

export default generateRangeChartData