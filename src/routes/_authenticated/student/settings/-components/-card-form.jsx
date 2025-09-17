import axios from "axios";
import React, { useEffect, useState } from "react";
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement, CardElement, PaymentElement } from "@stripe/react-stripe-js";
import { useDispatch } from "react-redux";
import { updateSubscription } from "../../../../../shared/config/reducers/student/studentAuthSlice";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const CardForm = ({ plan, setCardDetailsFlag }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [cardComplete, setCardComplete] = useState(false);

    const stripe = useStripe();
    const elements = useElements();


    // Handle changes in CardElement
    const handleChange = (event) => {
        setCardComplete(event.complete);
    };


    // Save card details
    const saveCardDetails = async () => {

        if (!stripe || !elements) {
            return;
        }

        const { token } = await stripe.createToken(elements.getElement(CardElement));
        const { paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: { token: token.id }
        });

        const reqBody = { 
            plan: plan?.name,
            paymentMethodId: paymentMethod.id
        }

        try {
            let response = await axios.post("/student/payment/subscribe", reqBody);
            response = response.data;
            if (response.success) {
                toast.success(response.message)
                const { subscription, remainingEnrollmentCount } = response.data;
                dispatch(updateSubscription({ subscription, remainingEnrollmentCount }));
                navigate({to:"/student/"})
            }
        } catch (error) {
            console.log("Registration Error --> ", error);
        }


    };

    const mutation = useMutation({
        mutationFn:saveCardDetails
    })
    const submitDetails = (e) =>{
    e.preventDefault();
    mutation.mutate()
    }

    const cardElementOptions = {
        style: {
            base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                    color: '#aab7c4',
                },
            },
            invalid: {
                color: '#9e2146',
            },
        },
    };

    return (
        <div className='flex justify-center items-center min-h-[80vh]'>
            <div className="card px-6 py-10 bg-base-100 shadow-xl mt-2 w-[550px]">
                <div className="flex justify-between items-center mb-6">
                    <div className="w-full">
                        <div className="flex justify-between items-center">
                            <h1 className="text-[20px] font-semibold">{plan?.name} Plan</h1>
                            <Button variant="ghost"  onClick={() => setCardDetailsFlag(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </Button>
                        </div>
                        <div className="h-5/6">
                            <h2 className="text-5xl font-bold mt-2 mb-6">{plan?.price}</h2>
                            <ul className="text-gray-700 text-left flex flex-col gap-4">
                                {plan?.features.map((feature, index) => (
                                    <li key={index} className="flex items-between gap-2">
                                        <span className='text-blue-800'>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                            </svg>
                                        </span>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                </div>
                <div className="mb-6">
                    Insert the card details to buy subscription.
                </div>
                <form onSubmit={(e) => submitDetails(e)}>
                    <CardElement options={cardElementOptions} onChange={handleChange} />
                    <div className="mt-6 text-right">
                        <Button type="submit" className='float-right' disabled={!stripe || loading || !cardComplete || mutation.status === 'pending'} loading={mutation.status === 'pending'}>
                            Buy Subscription
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CardForm;
