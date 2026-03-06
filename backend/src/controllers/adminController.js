const Driver = require('../models/Driver'); 

const processRealKyc = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const files = req.files;
    if (!files || !files.aadhaar || !files.license || !files.rcBook) {
      return res.status(400).json({ message: "Incomplete document upload. Please check all 3 fields." });
    }

    const documentImages = {
      aadhaarUrl: `/uploads/${files.aadhaar[0].filename}`,
      licenseUrl: `/uploads/${files.license[0].filename}`,
      rcBookUrl: `/uploads/${files.rcBook[0].filename}`
    };

    const driver = await Driver.findByIdAndUpdate(
      req.user._id,
      {
        documentImages,
        verificationStatus: 'pending'
      },
      { new: true }
    );

    res.json({ message: "Documents uploaded successfully. Awaiting admin review.", driver });
  } catch (error) {
    console.error("KYC Upload Error:", error);
    res.status(500).json({ message: "Failed to upload documents.", error: error.message });
  }
};

const getPendingDrivers = async (req, res) => {
    try {
        const drivers = await Driver.find({}).sort({ createdAt: -1 }); 
        res.json(drivers); 
    } 
    catch (error) { 
        console.error(error);
        res.status(500).json({ message: "Error fetching drivers" }); 
    }
};

const reviewDriver = async (req, res) => {
    try { 
        const { status } = req.body; 
        const driver = await Driver.findByIdAndUpdate(req.params.id, { verificationStatus: status }, { new: true }); 
        res.json({ driver }); 
    } 
    catch (error) { 
        console.error(error);
        res.status(500).json({ message: "Error updating driver status" }); 
    }
};

module.exports = { processRealKyc, getPendingDrivers, reviewDriver };