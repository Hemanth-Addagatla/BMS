import { Inngest, step } from "inngest";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import { model } from "mongoose";
import sendEmail from "../configs/nodeMailer.js";


// Create a client to send and receive events
export const inngest = new Inngest({ id: "my-app" });


//save the userData
const syncUserCreation = inngest.createFunction(
    { id: 'sync-user-from-clerk' },
    { event: 'clerk/user.created' },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            image: image_url
        }
        await User.create(userData)
    }
)

//Delete user
const syncUserDeletion = inngest.createFunction(
    { id: 'delete-user-with-clerk' },
    { event: 'clerk/user.deleted' },
    async ({ event }) => {
        const { id } = event.data
        await User.findByIdAndDelete(id)
    }

)

//update user
const syncUserUpdation = inngest.createFunction(
    { id: 'update-user-from-clerk' },
    { event: 'clerk/user.updated' },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data
        const userData = {
            _id: id,
            email: email_addresses[0].email_addresse,
            name: first_name + ' ' + last_name,
            image: image_url
        }
        await User.findByIdAndUpdate(id, userData)
    }
)

const releaseSeatsAndDeleteBooking = inngest.createFunction(
    { id: 'release-seats-delete-booking' },
    { event: 'app/checkpayment' },
    async ({ event, step }) => {
        const tenMintuesLater = new Date(Date.now() + 10 * 60 * 1000);
        await step.sleepUntil('wait-for-10-minutes', tenMintuesLater);

        await step.run('check-payment-status', async () => {
            const bookingId = event.data.bookingId;
            const booking = await Booking.findById(bookingId)

            if (!booking.isPaid) {
                const show = await Show.findById(booking.show)
                booking.bookedSeats.forEach((seat) => {
                    delete show.occupiedSeats[seat]
                });
                show.markModified('occupiedSeats')
                await show.save()
                await Booking.findByIdAndDelete(booking._id)
            }
        })
    }
)


const sendBookingConfirmationEmail = inngest.createFunction(
    { id: "send-booking-confiramtion-email" },
    { event: "app/show.booked" },
    async ({ event, step }) => {
        const { bookingId } = event.data;
        const booking = await Booking.findById(bookingId).populate({
            path: 'show',
            populate: { path: "movie", model: "Movie" }
        }).populate('user');
        await sendEmail({
            to: booking.user.email,
            subject: `Payment-Confirmation : "${booking.show.movie.title}" booked!!`,
            body: `
            <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px; border:1px solid #ddd; border-radius:10px;">
                <h2 style="color:#16a34a; text-align:center;">
                    ✅ Booking Confirmed
                </h2>
                <p>Hi <strong>${booking.user.name}</strong>,</p>
                <p>
                    Your payment has been received successfully and your movie tickets have been booked.
                    We hope you enjoy your show!
                </p>
                <hr>
                <h3>🎬 Booking Details</h3>
                <table style="width:100%; border-collapse:collapse;">
                    <tr>
                        <td><strong>Movie</strong></td>
                        <td>${booking.show.movie.title}</td>
                    </tr>
                    <tr>
                        <td><strong>Date</strong></td>
                        <td>${new Date(booking.show.showDateTime).toLocaleDateString()}</td>
                    </tr>
                    <tr>
                        <td><strong>Time</strong></td>
                        <td>${new Date(booking.show.showDateTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            })}</td>
                    </tr>
                    <tr>
                        <td><strong>Seats</strong></td>
                        <td>${booking.bookedSeats.join(", ")}</td>
                    </tr>
                    <tr>
                        <td><strong>Amount Paid</strong></td>
                        <td>₹${booking.amount}</td>
                    </tr>
                    <tr>
                        <td><strong>Booking ID</strong></td>
                        <td>${booking._id}</td>
                    </tr>
                </table>
                <hr>
                <p style="margin-top:20px;">
                    Please arrive at the theatre at least
                    <strong>20-30 minutes before the show starts.</strong>
                </p>
                <p>
                    Keep this email as your booking confirmation.
                </p>
                <br>
                <p>Thank you for choosing <strong>QuickShow</strong>! 🍿</p>
                <p style="color:#666;">
                    Happy Watching! 🎥
                </p>

            </div>
            `
        })
    }
)

const sendShowReminders = inngest.createFunction(
    { id: "show-show-reminders" },
    { cron: "0 */8 * * *" }, // every 8 hrs
    async ({ step }) => {
        const now = new Date();
        const in8hrs = new Date(now.getTime() + 8 * 60 * 60 * 1000);
        const windowStart = new Date(in8hrs.getTime() - 10 * 60 * 1000);

        const reminderTasks = await step.run
            ("prepare-reminder-tasks", async () => {
                const shows = await Show.find({
                    showTime: { $gte: windowStart, $lte: in8hrs }
                }).populate('movie');
                const tasks = [];
                for (const show of shows) {
                    if (show.movie || !show.occupiedSeats) continue;

                    const userIds = [...new Set(Object.values(show.occupiedSeats))];
                    if (userIds.length === 0) continue;

                    const users = await User.find({ _id: { $in: userIds } }).select("name email");

                    for (const user of users) {
                        tasks.push({
                            userEmail: user.email,
                            userName: user.name,
                            movieTitle: show.movie.Title,
                            showTime: show.showTime

                        })
                    }
                }
                return tasks;
            })

        if (reminderTasks.length === 0) {
            return { sent: 0, message: "No remainders to send." }
        }

        const results = await step.run('send-all-remainders', async () => {
            return await Promise.allSettled(
                reminderTasks.map(task => sendEmail({
                    to: task.userEmail,
                    subject: `Reminder: your movie "${task.movieTitle}" starts soon!!!!`,
                    body: `
            <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:20px;border:1px solid #ddd;border-radius:10px;">
                
                <h2 style="color:#2563eb;text-align:center;">
                    🎬 Showtime Reminder
                </h2>

                <p>Hi <strong>${task.userName}</strong>,</p>

                <p>
                    Just a quick reminder that your movie
                    <strong>${task.movieTitle}</strong> starts soon.
                </p>

                <div style="background:#f8f9fa;padding:12px;border-radius:8px;margin:15px 0;">
                    <p style="margin:5px 0;">
                        <strong>🕒 Show Time:</strong>
                        ${new Date(task.showTime).toLocaleString([], {
                        dateStyle: "medium",
                        timeStyle: "short"
                    })}
                    </p>
                </div>

                <p>
                    Please arrive <strong>20–30 minutes early</strong> to avoid missing the beginning of the show.
                </p>

                <p style="margin-top:20px;">
                    Enjoy your movie! 🍿🎥
                </p>

            </div>
            `
                }))
            )
        })
        const sent = results.filter(r => r.status === "fulfilled").length;
        const failed = results.length - sent;

        return {
            sent,
            failed,
            message: `Sent ${sent} reminder(s) , ${failed} failed .`
        }
    }

)


const sendNewShowNotifications = inngest.createFunction(
    { id: "send-new-show-notifications" },
    { event: "app/show.added" },
    async ({ event }) => {
        const { movieTitle, movieId } = event.data;

        const users = await User.find({})
        for (const user of users) {
            const userEmail = user.email;
            const userName = user.name;
            const subject = 'New show Added'
            const body = `
                            <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:20px;border:1px solid #ddd;border-radius:10px;">

                                <h2 style="color:#dc2626;text-align:center;">
                                    🎬 New Movie Alert!
                                </h2>

                                <p>Hi <strong>${userName}</strong>,</p>

                                <p>
                                    We're excited to let you know that a new movie has just been added to <strong>QuickShow</strong>.
                                </p>

                                <div style="background:#f8f9fa;padding:12px;border-radius:8px;margin:15px 0;">
                                    <p style="margin:5px 0;">
                                        <strong>🍿 ${movieTitle}</strong>
                                    </p>
                                </div>

                                <p>
                                    Book your tickets now and grab your favorite seats before they're gone!
                                </p>

                                <p style="margin-top:20px;">
                                    Happy Watching! 🎥🍿
                                </p>

                            </div>
                            `;

                            await sendEmail({
                                to:userEmail,
                                subject,
                                body
                            })
        }
        return {message : "Notification sent."}
    }
)

export const functions = [
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdation,
    releaseSeatsAndDeleteBooking,
    sendBookingConfirmationEmail,
    sendShowReminders,
    sendNewShowNotifications

];