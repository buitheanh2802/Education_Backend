import SolutionModel from 'models/solution.model';


export const gets = (req,res) => {
    console.log('running');
}
export const get = (req,res) => {

}
export const update = (req,res) => {

}
export const remove = (req,res) => {

}
export const create = (req,res) => {
    const request = {
        title : req.body.title,
        descriptions : req.body.descriptions,
        demoUrl : req.body.demoUrl,
        repoUrl : req.body.repoUrl,
        createBy : req.userId,
        challengeId : req.body.challengeId
    }
    const solutionData = new SolutionModel(request);
    solutionData.save((err,docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        return response(res, 200, []);
    })
}