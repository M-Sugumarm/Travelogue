const nodemailer = require('nodemailer');

// Create transporter (using Gmail - you can change to other providers)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
    }
});

// Email templates
const templates = {
    bookingConfirmation: (booking, trip) => ({
        subject: `🎉 Booking Confirmed - ${trip.title}`,
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #ff7a59, #f472b6); padding: 40px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .header p { color: rgba(255,255,255,0.9); margin: 10px 0 0; }
          .content { padding: 40px; }
          .trip-image { width: 100%; height: 200px; object-fit: cover; border-radius: 12px; margin-bottom: 20px; }
          .details { background: #f8f9fa; border-radius: 12px; padding: 24px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e9ecef; }
          .detail-row:last-child { border-bottom: none; }
          .label { color: #6c757d; }
          .value { font-weight: 600; color: #212529; }
          .total { background: linear-gradient(135deg, #ff7a59, #f472b6); color: white; padding: 20px; border-radius: 12px; text-align: center; margin-top: 20px; }
          .total .amount { font-size: 32px; font-weight: 700; }
          .cta { text-align: center; margin-top: 30px; }
          .cta a { display: inline-block; background: #ff7a59; color: white; padding: 14px 32px; border-radius: 50px; text-decoration: none; font-weight: 600; }
          .footer { text-align: center; padding: 30px; color: #6c757d; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✈️ Booking Confirmed!</h1>
            <p>Your adventure awaits</p>
          </div>
          <div class="content">
            <img src="${trip.image}" alt="${trip.title}" class="trip-image" />
            <h2 style="margin: 0 0 8px;">${trip.title}</h2>
            <p style="color: #6c757d; margin: 0;">${trip.location}</p>
            
            <div class="details">
              <div class="detail-row">
                <span class="label">Booking ID</span>
                <span class="value">${booking.bookingId}</span>
              </div>
              <div class="detail-row">
                <span class="label">Travel Date</span>
                <span class="value">${new Date(booking.startDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div class="detail-row">
                <span class="label">Travelers</span>
                <span class="value">${booking.travelers} ${booking.travelers > 1 ? 'people' : 'person'}</span>
              </div>
              <div class="detail-row">
                <span class="label">Duration</span>
                <span class="value">${trip.duration}</span>
              </div>
              ${booking.accommodation ? `
              <div class="detail-row">
                <span class="label">Accommodation</span>
                <span class="value">${booking.accommodation}</span>
              </div>
              ` : ''}
            </div>
            
            <div class="total">
              <p style="margin: 0;">Total Amount Paid</p>
              <div class="amount">$${booking.totalPrice.toLocaleString()}</div>
            </div>
            
            <div class="cta">
              <a href="http://localhost:5173/my-bookings">View My Bookings</a>
            </div>
          </div>
          <div class="footer">
            <p>Thank you for choosing Travelogue!</p>
            <p>Questions? Contact us at hello@travelogue.com</p>
          </div>
        </div>
      </body>
      </html>
    `
    }),

    bookingCancellation: (booking, trip) => ({
        subject: `Booking Cancelled - ${trip.title}`,
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; }
          .header { background: #6c757d; padding: 40px; text-align: center; }
          .header h1 { color: white; margin: 0; }
          .content { padding: 40px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Booking Cancelled</h1>
          </div>
          <div class="content">
            <h2>${trip.title}</h2>
            <p>Your booking (${booking.bookingId}) has been cancelled.</p>
            <p>A refund of $${booking.totalPrice.toLocaleString()} will be processed within 5-7 business days.</p>
            <p style="margin-top: 30px;">We hope to see you on another adventure soon!</p>
          </div>
        </div>
      </body>
      </html>
    `
    }),

    welcomeEmail: (user) => ({
        subject: '🌍 Welcome to Travelogue!',
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #ff7a59, #f472b6); padding: 40px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { padding: 40px; text-align: center; }
          .cta { margin-top: 30px; }
          .cta a { display: inline-block; background: #ff7a59; color: white; padding: 14px 32px; border-radius: 50px; text-decoration: none; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome, ${user.firstName}! 🎉</h1>
          </div>
          <div class="content">
            <h2>Your Adventure Starts Here</h2>
            <p>Thank you for joining Travelogue! You now have access to:</p>
            <ul style="text-align: left; max-width: 300px; margin: 20px auto;">
              <li>50+ curated destinations</li>
              <li>Exclusive member deals</li>
              <li>24/7 travel support</li>
              <li>Easy booking management</li>
            </ul>
            <div class="cta">
              <a href="http://localhost:5173/book">Explore Destinations</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
    })
};

// Send email function
const sendEmail = async (to, template, data) => {
    try {
        const emailContent = templates[template](data.booking || data.user, data.trip);

        const mailOptions = {
            from: '"Travelogue" <noreply@travelogue.com>',
            to,
            subject: emailContent.subject,
            html: emailContent.html
        };

        // Only send if email credentials are configured
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            await transporter.sendMail(mailOptions);
            console.log(`✉️ Email sent to ${to}: ${template}`);
            return true;
        } else {
            console.log(`📧 Email would be sent to ${to}: ${template} (Email not configured)`);
            return true;
        }
    } catch (error) {
        console.error('Email error:', error);
        return false;
    }
};

module.exports = { sendEmail, templates };
