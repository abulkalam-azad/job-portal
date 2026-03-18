const express = require('express');
const app = express();
const port = 3000;

// This is our temporary database
let jobs = [
    { title: "Software Engineer", company: "TechCorp", salary: "$100k" }
];

// This allows us to read data from the form
app.use(express.urlencoded({ extended: true }));

// HOME PAGE - Show Jobs
app.get('/', (req, res) => {
    let jobListings = jobs.map(job => `
        <div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 8px; font-family: sans-serif;">
            <h2 style="margin: 0; color: #007bff;">${job.title}</h2>
            <p><strong>Company:</strong> ${job.company} | <strong>Salary:</strong> ${job.salary}</p>
        </div>
    `).join('');

    res.send(`
        <body style="max-width: 600px; margin: auto; padding: 20px;">
            <h1>Job Portal</h1>
            <a href="/post" style="padding: 10px; background: green; color: white; text-decoration: none; border-radius: 5px;">+ Post New Job</a>
            <hr>
            ${jobListings}
        </body>
    `);
});

// POST JOB PAGE - The Form
app.get('/post', (req, res) => {
    res.send(`
        <body style="max-width: 600px; margin: auto; padding: 20px; font-family: sans-serif;">
            <h1>Post a New Job</h1>
            <form action="/add-job" method="POST">
                <input type="text" name="title" placeholder="Job Title" required style="display:block; width:100%; margin-bottom:10px; padding:10px;">
                <input type="text" name="company" placeholder="Company Name" required style="display:block; width:100%; margin-bottom:10px; padding:10px;">
                <input type="text" name="salary" placeholder="Salary (e.g. $80k)" required style="display:block; width:100%; margin-bottom:10px; padding:10px;">
                <button type="submit" style="padding: 10px 20px; background: #007bff; color: white; border: none; cursor: pointer;">Add Job</button>
            </form>
            <br><a href="/">Back to Home</a>
        </body>
    `);
});

// LOGIC - Adding the job to the list
app.post('/add-job', (req, res) => {
    const { title, company, salary } = req.body;
    jobs.push({ title, company, salary });
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});