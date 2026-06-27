// checking seat Availability
import Booking from "../models/Booking.js";
import Show from "../models/Show.js"
import stripe from "stripe"
import {inngest} from '../inngest/index.js'

const checkSeatAvailability = async (showId, selectedSeats) => {
    
    try {
        const showData = await Show.findById(showId)
        if (!showData) return false;
        const occupiedSeats = showData.occupiedSeats;
        const isTaken = selectedSeats.some(seat => occupiedSeats[seat]);

        return !isTaken
    } catch (error) {
        console.log(error.message);
        return false;
    }
}

export const createBooking = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { showId, selectedSeats } = req.body;
        const { origin } = req.headers;
        

        const isAvail = await checkSeatAvailability(showId, selectedSeats);
        if (!isAvail) {
            return res.json({ success: false, message: "Selected seats are not available " })
        }
        const showData = await Show.findById(showId).populate('movie');
        const booking = await Booking.create({
            user: userId,
            show: showId,
            amount: showData.showPrice * selectedSeats.length,
            bookedSeats: selectedSeats
        })
         console.log(showData.showPrice);
        console.log(selectedSeats.length);
        console.log(booking.amount);
        selectedSeats.map((seat) => {
            showData.occupiedSeats[seat] = userId;
        })
        showData.markModified('occupiedSeats')
        await showData.save();

        // stripe Gateway initialize
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)
        console.log(process.env.STRIPE_SECRET_KEY);

        // creating line items for stripe
        const line_items = [{
            price_data : {
                currency: 'usd',
                product_data: {
                    name: showData.movie.title
                },
                unit_amount : Math.floor(booking.amount) *100
            },
            quantity: 1
        }]

       
        const session = await stripeInstance.checkout.sessions.create({
            success_url : `${origin}/loading/my-bookings`,
            cancel_url : `${origin}/my-bookings`,
            line_items: line_items,
            mode:'payment',
            metadata:{
                bookingId: booking._id.toString()
            },
            expires_at: Math.floor(Date.now() / 1000) + 30*60 // expires in 30min

        })
        booking.paymentLink = session.url
        await booking.save()

        await inngest.send({
            name: "app/checkpayment",
            data:{
                bookingId: booking._id.toString()
            }
        })

        res.json({ success: true, url:session.url })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: "Booking Failed" })
    }
}

export const getOccupiedSeats = async (req, res) => {
    try {

        const { showId } = req.params;
        const showData = await Show.findById(showId)
        const occupiedSeats = Object.keys(showData.occupiedSeats)
        res.json({ success: true, occupiedSeats })

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}