const colors = { "-1": "text-red",  "0": "text-white",  "1": "text-green" }

const textColorClass = (number = 0) => colors[Math.sign(number)];


export default textColorClass