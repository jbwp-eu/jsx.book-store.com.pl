import { isValidObjectId } from 'mongoose';

function checkObjectId(req, res, next) {
  if (!isValidObjectId(req.params.id)) {
    res.status(401);
    return next({ message: req.t("middleware.invalidObjectId", { id: req.params.id }) });
  }
  next();
}

export default checkObjectId;