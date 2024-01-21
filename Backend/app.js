const express = require("express");
const app = express();
// Enable CORS for all routes


// const io = require('socke.io')(http);
const bodyParser = require("body-parser");
const morgan = require("morgan");
const registerRoutes = require("./routes/register");// this is the shhign up
const loginRoutes = require("./routes/login");
const talentDashboard = require("./routes/talentDashboard");
const dashboardRoutes = require("./routes/dashboard");
const { Pool } = require("pg");
const cors = require("cors");
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();


// PostgreSQLzz connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  ssl:{
    rejectUnauthorized: false,
  },
  sslmode: 'require'
});


 pool.connect((err) =>{
  if(err){
      console.log(err)
  }else{
      console.log("connected to db");
  }
})
// pool.on('error', (err, client) => {
//   console.error('Unexpected error on idle client', err);
//   process.exit(-1);
// });

// pool.query('SELECT NOW()', (err, res) => {
//   console.log('PostgreSQL Connection String:', pool.options.connectionString);
//   if (err) {
//     console.error('Error executing query', err);
//   } else {
//     console.log('Query result:', res.rows);
//   }
// });

// console.log('PostgreSQL Connection String:', pool.options.connectionString)


// const corsOptions = {
//   origin: "http://127.0.0.1:5501",
//   methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//   credentials: true,
// };
app.use(express.static("views"));
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
// app.use(cors(corsOptions));
app.use("/register", cors(), registerRoutes);
app.use("/login",cors(), loginRoutes);
app.use("/talentDashboard", cors(), talentDashboard);
app.use("/dashboard", cors(), dashboardRoutes);
// Enable CORS for all routes
app.use(cors({ origin: 'https://skill-workcommunity.com.ng', credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
    res.setHeader('Set-Cookie', 'Secure; SameSite=None');
    next();
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://skill-workcommunity.com.ng');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// Cloudinary configuratio
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});


// Multer middleware for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadImage = (imageBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { 
        folder: "folder1", // Replace with your desired folder name
        use_filename: true, // Optional, use the original filename as the Cloudinary public ID
      },
      (error, result) => {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          console.log("Image uploaded to Cloudinary:", result);
          resolve(result);
        }
      }
    ).end(imageBuffer);
  });
};
app.options('/api/messages', (req, res) => {
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.sendStatus(200);
});

app.get('/api/messages', async (req, res) => {
  const { senderEmail, receiverEmail } = req.query;

  try {
    const result = await pool.query(
      'SELECT * FROM messages WHERE (sender_email = $1 AND receiver_email = $2) OR (sender_email = $2 AND receiver_email = $1) ORDER BY timestamp',
      [senderEmail, receiverEmail]
    );

    const messages = result.rows;
    res.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Endpoint to fetch sender emails
app.get('/fetchSenderEmails', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT sender_email FROM messages');
    const senderEmails = result.rows.map(row => row.sender_email);
    res.status(200).json({ senderEmails });
  } catch (error) {
    console.error('Error fetching sender emails:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/categories', async (req, res) => {
  try {
    console.log('Received request to /categories');
    const result = await pool.query('SELECT * FROM caties'); // Use the correct table name
    const categories = result.rows;
    res.status(200).json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Endpoint to get receiver information
app.get('/fetchReceiverInfo', async (req, res) => {
  const { receiverEmail } = req.query;

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [receiverEmail]
    );

    const receiverInfo = result.rows[0];
    res.status(200).json({ receiverInfo });
  } catch (error) {
    console.error('Error fetching receiver information:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Endpoint to fetch chat users
app.get('/fetchChatUsers', async (req, res) => {
  try {
    const result = await pool.query('SELECT email FROM users'); // Replace with your actual user table name
    const chatUsers = result.rows;
    res.status(200).json({ users: chatUsers });
  } catch (error) {
    console.error('Error fetching chat users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to get messages for the logged-in user as a receiver
app.get('/fetchReceiverMessages', async (req, res) => {
  const { receiverEmail } = req.query;

  try {
    const result = await pool.query(
      'SELECT * FROM messages WHERE receiver_email = $1 ORDER BY timestamp',
      [receiverEmail]
    );

    const receiverMessages = result.rows;
    res.status(200).json({ messages: receiverMessages });
  } catch (error) {
    console.error('Error fetching receiver messages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Route for handling form submissions with image uploads
app.post("/submit", upload.single("image"), async (req, res) => {
  try {
    console.log("Received form submission:", req.body);

    const {
      name,
      phoneNumber,
      email,
      jobTitle,
      about,
      location,
      language,
      hourlyRate,
    } = req.body;

    // Check if a file is uploaded
    const image = req.file;

    // If an image is uploaded, upload it to Cloudinary
    let image_path;
    if (image) {
      const result = await uploadImage(image.buffer);
      image_path = result.secure_url;

      // Insert data into the database
      const dbResult = await pool.query(
        "INSERT INTO former (job_title, about, location, language, hourly_rate, name, phone_number, email, image_path) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
        [
          jobTitle,
          about,
          location,
          language,
          hourlyRate,
          name,
          phoneNumber,
          email,
          image_path,
        ]
      );

      console.log("Form data inserted successfully:", dbResult.rows);

      // Send the Cloudinary URL in the response
      res.status(200).json({ message: "Form submitted successfully", image_path });
    } else {
      // Handle the case where no image is uploaded
      res.status(400).json({ error: "No image uploaded" });
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Other routes


// Endpoint to get messages between two users
app.get('/api/messages', async (req, res) => {
  const { senderEmail, receiverEmail } = req.query;
  try {
    const result = await pool.query(
      'SELECT * FROM messages WHERE (sender_email = $1 AND receiver_email = $2) OR (sender_email = $2 AND receiver_email = $1) ORDER BY timestamp',
      [senderEmail, receiverEmail]
    );
    const messages = result.rows;
    res.status(200).json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to send a message

app.options('/api/messages', (req, res) => {
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.sendStatus(200);
});

// Endpoint to send a message
app.post('/api/messages', async (req, res) => {
  const { senderEmail, receiverEmail, text } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO messages (sender_email, receiver_email, text) VALUES ($1, $2, $3) RETURNING *',
      [senderEmail, receiverEmail, text]
    );
    const newMessage = result.rows[0];
    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post("/register", async (req, res, next) => {
  try {
    const { name, email, password, roles } = req.body;

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store user information in the database
    const result = await pool.query(
      "INSERT INTO formusers (name, email, password, roles) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, hashedPassword, roles]
    );

    const newUser = result.rows[0];

    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




app.get("/category/former", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, job_title, about, location, language, hourly_rate, name, phone_number, email FROM former");
    const talents = result.rows;
    if (talents.length === 0) {
      console.warn('Warning: No records found in the "former" table.');
    }

    res.status(200).json({ talents });
  } catch (error) {
    console.error('Error retrieving data:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/category/formusers", async (req, res) => {
  try {
    // Specify the correct columns you want to retrieve excluding the 'password' field
    const result = await pool.query("SELECT id, name, email, roles FROM formusers");
    const formUsers = result.rows;
    
    res.status(200).json({ formUsers });
  } catch (error) {
    console.error("Error retrieving form users data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add this route to fetch the user's email
app.get('/fetchUserEmail', async (req, res) => {
  try {
    // Assuming you have a way to identify the logged-in user, replace 'userId' with the actual user identifier
    const userId = req.query.userId;

    // Query the database or use any other method to fetch the user's email based on their ID
    const result = await pool.query('SELECT email FROM users WHERE id = $1', [userId]);

    // Extract the email from the result
    const userEmail = result.rows[0].email;

    // Send the email in the response
    res.status(200).json({ userEmail });
  } catch (error) {
    console.error('Error fetching user email:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.get("/category/:categoryName", async (req, res) => {
  const categoryName = req.params.categoryName.toLowerCase();
  try {
    const result = await pool.query(
      "SELECT * FROM former WHERE job_title = $1", [categoryName]
    );
    const talents = result.rows;
    res.status(200).json({ talents });
  } catch (error) {
    console.error("Error retrieving data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to delete a job
app.delete('/deleteJob/:jobId', async (req, res) => {
  const jobId = req.params.jobId;

  try {
    // Use a PostgreSQL query to delete the job from the database
    const result = await pool.query('DELETE FROM job_posts WHERE id = $1', [jobId]);

    // Check if a row was affected
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    return res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to retrieve messages
app.get('/receive', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard2.html.html'));
});
// / Endpoint to handle message creation
app.post('/api/text', async (req, res) => {
  try {
    const {receiverEmail, jobDescription, messageText } = req.body;
    const insertTextQuery = `
      INSERT INTO text (receiver_email, job_description, message_text)
      VALUES ($1, $2, $3)
    `;
    const values = [senderEmail, receiverEmail, jobDescription, messageText];
    await pool.query(insertTextQuery, values);
    res.status(201).send('Text sent successfully');
  } catch (error) {
    console.error('Error saving text:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.get("/fetch/talents", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM former");
    const talents = result.rows;
    res.status(200).json({ talents });
  } catch (error) {
    console.error("Error fetching talents:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/fetch/formusers", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM formusers");
    const formUsers = result.rows;
    res.status(200).json({ formUsers });
  } catch (error) {
    console.error("Error fetching form users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Sample server-side route for submitting jobs
// Sample server-side route for submitting jobs with email
app.post("/submitJob", async (req, res) => {
  try {
    const { userId, jobTitle, jobDescription, email } = req.body;

    // Insert data into the database
    const dbResult = await pool.query(
      "INSERT INTO job_posts (user_id, job_title, job_description, email, created_at) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING *",
      [userId, jobTitle, jobDescription, email]
    );

    // Respond with the inserted data
    res.status(201).json({ success: true, jobPost: dbResult.rows[0] });
  } catch (error) {
    console.error("Error submitting job:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Endpoint to fetch receiver messages
app.get('/fetchReceiverMessages', async (req, res) => {
    const receiverEmail = req.query.receiverEmail;

    try {
        // Fetch messages from the database based on the receiver's email
        const messages = await Message.find({ receiverEmail });

        res.json({ messages });
    } catch (error) {
        console.error('Error fetching receiver messages:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to fetch job details
app.get('/fetchJobDetails', (req, res) => {
  const jobDescription = req.query.jobDescription;

  // Check if jobDetails for the specified jobDescription exist
  if (jobDetails.hasOwnProperty(jobDescription)) {
      // Send the job details as a JSON response
      res.json({ jobDetails: jobDetails[jobDescription] });
  } else {
      // If jobDetails not found, send a 404 response
      res.status(404).json({ error: 'Job details not found' });
  }
});

// Endpoint to fetch sender emails
app.get('/fetchSenderEmails', async (req, res) => {
    try {
        // Fetch distinct sender emails from the database
        const senderEmails = await Message.distinct('senderEmail');

        res.json({ senderEmails });
    } catch (error) {
        console.error('Error fetching sender emails:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get("/fetchJobs", async (req, res) => {
  try {
    const { category } = req.query;

    // Fetch jobs from the database based on job_title
    const dbResult = await pool.query(
      "SELECT * FROM job_posts WHERE job_title = $1",
      [category]
    );

    // Extract job data and user emails
    const jobs = dbResult.rows.map((job) => ({
      job_title: job.job_title,
      job_description: job.job_description,
      created_at: job.created_at,
      email: job.email, // Include the email field
    }));

    res.status(200).json({ success: true, jobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Example code to store user information in local storage
const handleLogin = async () => {
  try {
    // Make a request to your login route
    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "user@example.com",
        password: "password123",
      }),
    });
    
    app.delete('/deleteJob/:jobId', async (req, res) => {
      const jobId = req.params.jobId;
  
      try {
          // Assuming your table is named 'job_posts' and 'id' is the primary key
          const result = await pool.query('DELETE FROM job_posts WHERE id = $1 RETURNING *', [jobId]);
  
          if (result.rowCount === 0) {
              // No job with the given jobId found in the database
              res.status(404).json({ success: false, message: `Job ${jobId} not found` });
          } else {
              // Job successfully deleted
              res.status(200).json({ success: true, message: `Job ${jobId} deleted successfully` });
          }
      } catch (error) {
          console.error('Error deleting job:', error);
          res.status(500).json({ success: false, message: 'Internal Server Error' });
      }
  });
  
    // Parse the response
    const data = await response.json();

    // Check if login was successful
    if (data.token) {
      // Store user information in local storage
      localStorage.setItem("user", JSON.stringify(data));
    } else {
      console.error("Login failed:", data.message);
    }
  } catch (error) {
    console.error("Error during login:", error);
  }
};



// Error handling middleware
// app.use(function(req, res, next) {
//   let err = new Error("Not Found");
//   err.status = 404;
//   next(err);
// });

if (app.get("env") === "development") {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send({
      message: err.message,
      error: err
    });
  });
}

app.listen(305, function() {
  console.log("Server starting on port 305!");
});


// app.listen(305, function() {
//   console.log("Server starting on port 305!");
// });