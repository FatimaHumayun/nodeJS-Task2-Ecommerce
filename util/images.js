const multer = require("multer");
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = ["image/jpeg", "image/png"];

  if (allowedTypes.includes(file.mimetype)) {
    //mimetype files
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Only JPEG, PNG files are allowed!"), false); // Reject the file
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads"); //stored in this folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // timestamp to the filename to maintain singularity and no overlap 
  },
});

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;
