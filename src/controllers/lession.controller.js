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

export const lessionById = (req, res, next, id) => {
    LessionModel.findById(id).exec((err, lession) => {
        if (err || !lession) {
            res.status(400).json({
                error: "Không tìm thấy bài giảng"
            })
        }
        req.lession = lession;
        next();
    })
}



export const remove = (req, res) => {
    const lession = req.lession;
    lession.remove((err, deleteLession) => {
        if (err) {
            return res.status(400).json({
                error: "Xóa thất bại bài giảng"
            })
        }
        res.json({
            deleteLession,
            message: "Xóa thành công bài giảng"
        })
    })
}