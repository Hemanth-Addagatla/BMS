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

export const functions = [
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdation,
    releaseSeatsAndDeleteBooking,
    sendBookingConfirmationEmail

];