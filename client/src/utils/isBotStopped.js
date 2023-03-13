import _ from "lodash";

const isBotStopped = (setting1 = {}, setting2 = {}) => {
    if (_.isEmpty(setting1) || _.isEmpty(setting2)) {
        console.error('invalid params pass in isBotStopped()');
        return false;
    }

    const botSettings1 = _.values(setting1)
    const botSettings2 = _.values(setting2)

    const result = botSettings1.reduce((botStatus, botSetting, index) => {
        /*For making sure that comparing right values*/
        if (botSetting.indicator === botSettings2[index].indicator) {
            botStatus[botSetting._id] = botSetting.isActive && !botSettings2[index].isActive
        } else {
            console.error(`Objects doesn't have same types`)
        }

        return botStatus;
    }, {});

    return _.keys(result).filter(key => result[key]);
    // console.log({result, status});
};

export default isBotStopped;