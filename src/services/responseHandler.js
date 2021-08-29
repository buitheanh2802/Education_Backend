
export const response = (resHandler,status,message = [], data) => {
    const responseConfig = {
        message: message,
        status: status >= 400 ? false : true,
    }
    if (data) responseConfig.data = data;
    return resHandler.status(status).json(responseConfig)
}