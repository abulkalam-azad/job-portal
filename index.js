const express = require('express');
const app = express();
const port = 3000;

// This is our "database" for now
const jobs = [
    { title: "Software Engineer", company: "TechCorp", salary: "$100k" },
    { title: "Graphic Designer", company: "CreativeStudio", salary: "$70k" },
    { title: "Data Scientist", company: "DataViz", salary: "$120k" }
];

app.get('/', (req, res) => {
    let jobListings = jobs.map(job => `
        <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 10px; border-radius: 5px;">
            <h3>${job.title}</h3>
            <p><strong>Company:</strong> ${job.company}</p>
            <p><strong>Salary:</strong> ${job.salary}</p>
            <button>Apply Now</button>
        </div>
    `).join('');

    res.send(`
        <h1 style="color: #2c3e50;">Job Portal Listings</h1>
        <hr>
        ${jobListings}
    `);
});

app.listen(port, () => {
    console.log(`Server updated! Refresh your browser at http://localhost:${port}`);
});