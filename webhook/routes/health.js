const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  const response = {
    "status": "ok",
    "timestamp": Date.now(),
  };
  return res.status(200).json(response);
});

module.exports = router;
