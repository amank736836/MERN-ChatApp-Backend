import { TryCatch } from "./error";

const isAuthenticated = TryCatch((req, res, next) => {
  const token = req.cookies.StealthyNoteToken;

  if (!token) {
    return next(new ErrorHandler("Please Login to access this resource", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  if (!decodedData) {
    return next(new ErrorHandler("Invalid Token", 401));
  }

  req.userId = decodedData.id;

  next();
});
TryCatch(async (req, res, next) => {
  console.log(req.cookies);
  next();
});

export default isAuthenticated;
export { isAuthenticated };
