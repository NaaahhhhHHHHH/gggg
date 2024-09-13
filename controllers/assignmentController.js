const Assignment = require('../models/assignmentModel');
const Employee = require('../models/employeeModel');
const Service = require('../models/serviceModel');
const Job = require('../models/jobModel');

// Get all assignments
exports.getAllAssignments = async (req, res) => {
    // #swagger.tags = ['assignment']
    try {
        const assignments = await Assignment.findAll({
            include: [Employee, Service, Job], // Optionally include related models
        });
        res.status(200).json(assignments);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching assignments', error: err.message });
    }
};

// Get an assignment by ID
exports.getAssignmentById = async (req, res) => {
    // #swagger.tags = ['assignment']
    const { id } = req.params;

    try {
        const assignment = await Assignment.findByPk(id, {
            include: [Employee, Service, Job], // Optionally include related models
        });

        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        res.status(200).json(assignment);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching assignment', error: err.message });
    }
};

// Create a new assignment
exports.createAssignment = async (req, res) => {
    // #swagger.tags = ['assignment']
    const { sid, pay1, pay2, jid, reassignment, eId } = req.body;

    try {
        // Check if Service, Job, and Employee exist
        const serviceExists = await Service.findByPk(sid);
        const jobExists = await Job.findByPk(jid);
        const employeeExists = await Employee.findByPk(eId);
        
        if (!serviceExists) {
            return res.status(404).json({ message: 'Service not found' });
        }
        if (!jobExists) {
            return res.status(404).json({ message: 'Job not found' });
        }
        if (!employeeExists) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        if (req.user.role == 'employee') {
            if (pay1 || pay1 === 0 || pay2 || pay2 === 0) {
                return res.status(403).json({ message: 'Permission denied' });
            }
            const filter = {
                eId: eId,
                jid: req.user.id
            };
            const Assignments = await Assignment.findOne({ where: filter });
            if (!Assignments || !Assignments.reassignment) {
                return res.status(403).json({ message: 'Permission denied' });
            }
        }


        // Validate pay1 and pay2
        if (pay1 < 0 || pay1 > 100) {
            return res.status(400).json({ message: 'Percentage pay (pay1) must be between 0 and 100' });
        }
        if (pay2 < 0) {
            return res.status(400).json({ message: 'Fixed pay (pay2) must be a non-negative number' });
        }

        const newAssignment = await Assignment.create({
            sid,
            pay1,
            pay2,
            jid,
            reassignment,
            eId,
        });

        res.status(201).json({ message: 'Assignment created successfully', assignment: newAssignment });
    } catch (err) {
        res.status(500).json({ message: 'Error creating assignment', error: err.message });
    }
};

// Update an existing assignment
exports.updateAssignment = async (req, res) => {
    // #swagger.tags = ['assignment']
    const { id } = req.params;
    const { sid, pay1, pay2, jid, reassignment, eId } = req.body;

    try {
        const assignment = await Assignment.findByPk(id);

        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        // Check if Service, Job, and Employee exist
        if (sid) {
            const serviceExists = await Service.findByPk(sid);
            if (!serviceExists) {
                return res.status(404).json({ message: 'Service not found' });
            }
        }
        if (jid) {
            const jobExists = await Job.findByPk(jid);
            if (!jobExists) {
                return res.status(404).json({ message: 'Job not found' });
            }
        }
        if (eId) {
            const employeeExists = await Employee.findByPk(eId);
            if (!employeeExists) {
                return res.status(404).json({ message: 'Employee not found' });
            }
        }

        if (req.user.role == 'employee') {
            if (pay1 || pay1 === 0 || pay2 || pay2 === 0) {
                return res.status(403).json({ message: 'Permission denied' });
            }
            const filter = {
                eId: eId,
                jid: req.user.id
            };
            const Assignments = await Assignment.findOne({ where: filter });
            if (!Assignments || !Assignments.reassignment) {
                return res.status(403).json({ message: 'Permission denied' });
            }
        }

        // Validate pay1 and pay2
        if (pay1 < 0 || pay1 > 100) {
            return res.status(400).json({ message: 'Percentage pay (pay1) must be between 0 and 100' });
        }
        if (pay2 < 0) {
            return res.status(400).json({ message: 'Fixed pay (pay2) must be a non-negative number' });
        }

        assignment.sid = sid || assignment.sid;
        assignment.pay1 = (pay1 || pay1 === 0) ? pay1 : assignment.pay1;
        assignment.pay2 = (pay2 || pay2 === 0) ? pay2 : assignment.pay2;
        assignment.jid = jid || assignment.jid;
        assignment.reassignment = (reassignment || reassignment === false) ? reassignment : assignment.reassignment;
        assignment.eId = eId || assignment.eId;

        await assignment.save();
        res.status(200).json({ message: 'Assignment updated successfully', assignment });
    } catch (err) {
        res.status(500).json({ message: 'Error updating assignment', error: err.message });
    }
};

// Delete an assignment
exports.deleteAssignment = async (req, res) => {
    // #swagger.tags = ['assignment']
    const { id } = req.params;

    try {
        const assignment = await Assignment.findByPk(id);

        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        await assignment.destroy();
        res.status(200).json({ message: 'Assignment deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting assignment', error: err.message });
    }
};
