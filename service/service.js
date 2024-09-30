// cronTasks.js
const cron = require('node-cron');
const { Op } = require('sequelize');
const Assignment = require('../models/assignmentModel'); // Adjust the path as necessary

exports.setupCronJobs = () => {
    // Schedule the task to run daily
    cron.schedule('0 0 * * *', async () => {
        try {
            const now = new Date();

            // Find assignments that are still "Waiting"
            const assignmentsToExpire = await Assignment.findAll({
                where: {
                    status: 'Waitting',
                },
            });

            for (const assignment of assignmentsToExpire) {
                const expireDays = assignment.expire || 3; // Default to 3 if not set
                const expirationDate = new Date(assignment.createdAt);
                expirationDate.setDate(expirationDate.getDate() + expireDays);

                // Check if the current date has passed the expiration date
                if (now >= expirationDate) {
                    // Update the status to "Expired"
                    assignment.status = 'Expired';
                    await assignment.save();
                    console.log(`Updated assignment ${assignment.id} to 'Expired'`);
                }
            }

            console.log('Checked and updated expired assignments successfully.');
        } catch (error) {
            console.error('Error updating expired assignments:', error);
        }
    });
};

