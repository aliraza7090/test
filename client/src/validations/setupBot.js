import Joi from 'joi'
import {EXCHANGES, INDICATORS, OPERATIONS} from "../constants";

const setupBotValidation = (data) => {
    const schema = Joi.object({
        bot: Joi.object({
            configured_by: Joi.string().required(),
            investment: Joi.number().required(),
            exchange: Joi.string().required()
        }),
        botSetting: Joi.object({
            manual: Joi.object({
                _id: Joi.string().required(),
                risk: Joi.string().required(),
                low: Joi.number().required(),
                up: Joi.number().required(),
                isActive: Joi.bool().required(),
                investment: Joi.number()
                    .when('isActive', {
                        is: true,
                        then: Joi.number().min(11).allow(0).required()
                    }),
                operation: Joi.string().valid(OPERATIONS.manual).required(),
                takeProfit: Joi.number(),
                stats: Joi.object()
            }),
            trailing: Joi.object({
                _id: Joi.string().required(),
                risk: Joi.string().required(),
                low: Joi.number().required(),
                up: Joi.number().required(),
                isActive: Joi.bool().required(),
                investment: Joi.number()
                    .when('isActive', {
                        is: true,
                        then: Joi.number().min(11).required()
                    }),
                operation: Joi.string().valid(...Object.values(OPERATIONS)).required(),
                indicator: Joi.string().valid(...Object.values(INDICATORS)).required(),
                takeProfit: Joi.number(),
                stats: Joi.object()
            }),
            rsi: Joi.object({
                _id: Joi.string().required(),
                indicator: Joi.string().valid(...Object.values(INDICATORS)).required(),
                risk: Joi.string().required(),
                isActive: Joi.bool().required(),
                investment: Joi.number()
                    .when('isActive', {
                        is: true,
                        then: Joi.number().min(11).required()
                    }),
                operation: Joi.string().valid(...Object.values(OPERATIONS)).required(),
                low: Joi.number().required(),
                up: Joi.number().required(),
                time: Joi.string()
                    .when('isActive', {
                        is: true,
                        then: Joi.string().required().messages({"any.required": 'Please select time'})
                    }),
                takeProfit: Joi.number(),
                stats: Joi.object()
            })
        }),
        user_id: Joi.string().required(),
    });

    return schema.validate(data);
}

export default setupBotValidation