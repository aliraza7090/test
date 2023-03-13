import Joi from 'joi'
import _ from 'lodash'
import {COINS, RISKS} from "../constants";

const createBotValidation = (botData) => {
    const schema = Joi.object({
        exchange: Joi.string().messages({"string.empty": "Please select Exchange"}),
        coin: Joi.string().valid(..._.values(COINS)).required().messages({"any.only": `Please select coin`}, {"any.required": "Please select coin"}),
        investment: Joi.number().min(11).required(),
        stop_at: Joi.number().positive().messages({'number.positive': "Stop/Loss must be positive number"}),
        user: Joi.string(),
        isActive: Joi.boolean(),
        risk: Joi.string().valid(...RISKS).required(),
        day: Joi.number().max(365)
            .when('risk', {is: 'LOW', then: Joi.number().min(7).required()})
            .when('risk', {is: 'MODERATE', then: Joi.number().min(15).required()})
            .when('risk', {is: 'HIGH', then: Joi.number().min(30).required()})
    });

    return schema.validate(botData);
};

export default createBotValidation
