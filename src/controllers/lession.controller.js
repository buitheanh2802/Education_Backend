import LessionModel from "./../models/lession.model";

export const fetchAll = (req, res) => {
    LessionModel.find({}, (err, docs) => {
        if (err) {
            res.status(500).json({
                message: err.message
            })
        }
        res.status(200).json({
            docs
        })
    })
}

export const create = (req, res) => {
    const lession = new LessionModel(req.body);
    lession.save((err, data) => {
        if (err) {
            res.status(400).json({
                error: 'Không thêm được bài giảng'
            })
        }
        res.json({ data, message: "Thêm bài giảng thành công !!!" })
    })
}