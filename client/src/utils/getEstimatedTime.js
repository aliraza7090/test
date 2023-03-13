import moment from "moment";

const getEstimatedTime = (startTime = moment(), endTIme = moment()) => {
    const diff = endTIme.diff(startTime);

    const diffDuration = moment.duration(diff);

    return {
        days: diffDuration.days(),
        hours: diffDuration.hours(),
        minutes: diffDuration.minutes()
    }
};

export default getEstimatedTime
