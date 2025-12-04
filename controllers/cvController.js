import CV from "../models/CV.js";

export const createCV = async (req, res) => {
  try {
    // console.log("^^^^^^^%%%%%%%%%%%%%%%%%%%!!!!!!!!!@!",req.body)
    const cv = await CV.create({ userId: req.user.id, ...req.body });
    res.json(cv);
  } catch (err) {
     console.log("*****************",err.message)
    res.status(500).json({ msg: err.message });
  }
};

export const getCVs = async (req, res) => {
   try {
  const cvs = await CV.find({ userId: req.user.id });
  console.log(cvs)
  res.json(cvs);
  } catch (err) {
    console.log("%%%%%%%%%%%%%%%%%%%%",err.message)
    res.status(500).json({ msg: err.message });
  }
};

export const updateCV = async (req, res) => {
   try {
  const { id } = req.params;
  const updated = await CV.findByIdAndUpdate(id, req.body, { new: true });
  res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const deleteCV = async (req, res) => {
  try{
  const { id } = req.params;
  await CV.findByIdAndDelete(id);
  console.log("CV deleted",id)
  res.json({ msg: "Deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getCVById = async (req, res) => {
  try {
    const { id } = req.params;

    const cv = await CV.findOne({ _id: id, userId: req.user.id });

    if (!cv) {
      return res.status(404).json({ msg: "CV not found" });
    }

    res.json(cv);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
