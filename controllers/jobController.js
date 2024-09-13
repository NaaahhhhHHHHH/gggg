const Job = require('../models/jobModel');
const Customer = require('../models/customerModel');
const Service = require('../models/serviceModel');
const Form = require('../models/formModel');

// Get all jobs
exports.getAllJobs = async (req, res) => {
    // #swagger.tags = ['job']
    try {
        const jobs = await Job.findAll({
            include: [Customer, Service, Form], // Optionally include related models
        });
        res.status(200).json(jobs);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching jobs', error: err.message });
    }
};

// Get a job by ID
exports.getJobById = async (req, res) => {
    // #swagger.tags = ['job']
    const { id } = req.params;

    try {
        const job = await Job.findByPk(id, {
            include: [Customer, Service, Form], // Optionally include related models
        });

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        res.status(200).json(job);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching job', error: err.message });
    }
};

// Create a new job
exports.createJob = async (req, res) => {
    // #swagger.tags = ['job']
    const { cid, sid, progress, formid, startdate, enddate, additionalprice } = req.body;

    try {
        // Validate startdate and enddate
        if (new Date(enddate) < new Date(startdate)) {
            return res.status(400).json({ message: 'End date must be after the start date.' });
        }

        // Check if Customer, Service, and Form exist
        const customerExists = await Customer.findByPk(cid);
        const serviceExists = await Service.findByPk(sid);
        const formExists = await Form.findByPk(formid);

        if (!customerExists) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        if (!serviceExists) {
            return res.status(404).json({ message: 'Service not found' });
        }
        if (!formExists) {
            return res.status(404).json({ message: 'Form not found' });
        }

        const newJob = await Job.create({
            cid,
            sid,
            progress,
            formid,
            startdate,
            enddate,
            additionalprice,
        });

        res.status(201).json({ message: 'Job created successfully', job: newJob });
    } catch (err) {
        res.status(500).json({ message: 'Error creating job', error: err.message });
    }
};

// Update an existing job
exports.updateJob = async (req, res) => {
    // #swagger.tags = ['job']
    const { id } = req.params;
    const { cid, sid, progress, formid, startdate, enddate, additionalprice } = req.body;

    try {
        const job = await Job.findByPk(id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Validate startdate and enddate
        if (enddate && new Date(enddate) < new Date(startdate)) {
            return res.status(400).json({ message: 'End date must be after the start date.' });
        }

        // Check if Customer, Service, and Form exist
        if (cid) {
            const customerExists = await Customer.findByPk(cid);
            if (!customerExists) {
                return res.status(404).json({ message: 'Customer not found' });
            }
        }
        if (sid) {
            const serviceExists = await Service.findByPk(sid);
            if (!serviceExists) {
                return res.status(404).json({ message: 'Service not found' });
            }
        }
        if (formid) {
            const formExists = await Form.findByPk(formid);
            if (!formExists) {
                return res.status(404).json({ message: 'Form not found' });
            }
        }

        job.cid = cid || job.cid;
        job.sid = sid || job.sid;
        job.progress = progress || job.progress;
        job.formid = formid || job.formid;
        job.startdate = startdate || job.startdate;
        job.enddate = enddate || job.enddate;
        job.additionalprice = additionalprice || job.additionalprice;

        await job.save();
        res.status(200).json({ message: 'Job updated successfully', job });
    } catch (err) {
        res.status(500).json({ message: 'Error updating job', error: err.message });
    }
};

// Delete a job
exports.deleteJob = async (req, res) => {
    // #swagger.tags = ['job']
    const { id } = req.params;

    try {
        const job = await Job.findByPk(id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        await job.destroy();
        res.status(200).json({ message: 'Job deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting job', error: err.message });
    }
};
