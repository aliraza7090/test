import Joi from "joi";

const apisValidation = (data) => {
    const schema = Joi.object({
        binance: Joi.object({
            apiKey: Joi.string().allow('').min(64).max(64).messages({'string.min': "Binance Api key is invalid"}),
            secret: Joi.string().allow('').min(64).max(64).messages({'string.min': "Binance secret is invalid"})
        }),
        ku_coin: Joi.object({
            apiKey: Joi.string().allow('').min(24).max(24).messages({'string.min': "Ku Coin Api key is invalid"}),
            secret: Joi.string().allow('').min(36).max(36).messages({'string.min': "Ku Coin secret is invalid"}),
            passphrase: Joi.string().allow('')
        })
    });

    return schema.validate(data)
};

export default apisValidation