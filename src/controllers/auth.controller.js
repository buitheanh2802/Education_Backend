import UserModel from './../models/user.model';


export const register = (req,res) => {
    const document = new UserModel(req.body);
    document.save((err,docs) => {
        if(err){
            return res.status(500).json({
                message : [
                    'ERROR_SERVER',
                    err.message
                ],
                status : false
            })
        };
        res.status(200).json({
            message : [],
            status : false,
            data : docs
        })
    })
}