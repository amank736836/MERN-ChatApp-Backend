import multer from "multer";

const multerUpload = multer({
  limits: {
    fileSize: 1024 * 1024 * 50,
  },
});

const singleAvatar = multerUpload.single("avatar");

const attachmentsMulter = multerUpload.array("files", 5);

export { attachmentsMulter, multerUpload, singleAvatar };
