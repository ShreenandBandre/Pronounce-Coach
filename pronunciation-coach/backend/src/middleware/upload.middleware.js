import multer from "multer";
 
const ALLOWED_MIME = ["audio/wav","audio/mpeg","audio/mp4","audio/webm","audio/x-m4a","audio/mp3","video/webm"];
 
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME.includes(file.mimetype)) return cb(new Error("Unsupported audio format"));
    cb(null, true);
  },
});
