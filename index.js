// node modules
import fs from "node:fs";

// third-party modules
import express, { urlencoded } from "express";
import nodemailer from "nodemailer";

// my modules

// variables
const port = 3000;
const projects = JSON.parse(fs.readFileSync("./public/projects.json", "utf-8"));

// setup the app
const app = express();
app.use(urlencoded({ extended: false }));
app.set("view engine", "ejs");

// serving static files
app.use(express.static("public"));

// routes
app.get("/", (req, res, next) => {
	res.status(200).render("index", {
		status: "success",
		title: "Home",
		projects,
	});
});

app.post("/", (req, res) => {
	if (!req.body.subject) {
		// create transporter
		const transporter = nodemailer.createTransport({
			host: "mail.noip.com",
			port: 465,
			secure: true,
			auth: {
				user: "email@vinceporter.com",
				pass: "need2save",
			},
		});

		//* define the email options
		const mailOptions = {
			from: "email@vinceporter.com",
			replyTo: req.body.email,
			to: "email@vinceporter.com",
			subject: `${req.body.name} filled in the contact form at vinceporter.dev`,
			text: req.body.message,
		};

		//* send the email
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				console.log(error);
				res.render("index");
			} else {
				console.log("Email sent: " + info.response);
				res.render("index");
			}
		});
	}
});

app.listen(port, () => {
	console.log(`Server running on port ${port}.`);
});
