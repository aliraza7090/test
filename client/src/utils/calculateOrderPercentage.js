const risks = {'LOW': 0.05, 'MODERATE': 0.07, 'HIGH': 0.10}


const calculateOrderPercentage = (risk) => risks[risk];


export default calculateOrderPercentage