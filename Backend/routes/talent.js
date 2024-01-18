// Sample server-side code using Node.js and Express

// ... (your server setup)

app.post('/freelancer-form', async (req, res) => {
    try {
        const { name, email, phoneNumber, category } = req.body;

        // Insert data into the database
        const result = await pool.query('INSERT INTO freelancers (name, email, phone_number, category) VALUES ($1, $2, $3, $4) RETURNING *', [name, email, phoneNumber, category]);

        res.status(200).json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error submitting freelancer form:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});
