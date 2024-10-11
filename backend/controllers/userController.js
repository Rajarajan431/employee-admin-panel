import User from "../models/userModel.js"
import { errorHandler } from "../utils/errorHandler.js"

export const getUser = async(req, res, next) => {
    try {
        const user = await User.findById(req.params.id)

        if(!user) {
            return next(errorHandler(404, 'User not found!'))
        }

        const { password, ...rest} = user._doc;
        res.status(200).json(rest)
    } catch (error) {
        next(error)
    }
}