app.post("/purchase_cart", function (request, response) {
    console.log(request.body.invoice.html);
    var invoicehtml = request.body.invoicehtml;
            // return;
            var username = request.cookies["username"];
            var the_email = user_data[username].email;
            var transporter = nodemailer.createTransport({
                host: "mail.hawaii.edu",
                port: 25,
                secure: false, // Use TLS
                tls: {
                    // Invalid Certifications
                    rejectUnauthorized: false
                }
            });
            var mailOptions = {
                from: 'UHAthleticsStore@gmail.com',
                to: the_email,
                subject: 'Your UH Manoa Athletics Purchase',
                html: invoicehtml
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    status_str = 'There was an error and your invoice could not be emailed!';
                } else {
                    status_str = `Your invoice was mailed to ${user_data[username].email}`;
                }
                response.json({ "status" : status_str });
            });
            request.session.destroy();

});