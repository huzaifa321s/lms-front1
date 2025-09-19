import * as React from 'react'
import { CheckCircle, ArrowRight } from 'lucide-react'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PLANS } from '../../../shared/utils/helperFunction';

// --- Mocking External Dependencies ---
// This code is self-contained. In a real project, you would import these
// from their respective libraries.
const useNavigate = () => {
    return (to) => console.log(`Navigating to: ${to}`);
};
const useDispatch = () => {
    return (action) => console.log('Dispatching action:', action);
};
const axiosMock = {
    post: async (url, data) => {
        console.log(`Sending POST request to ${url} with data:`, data);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
            data: {
                success: true,
                data: {
                    subscription: 'new_sub_id'
                }
            }
        };
    }
};
const updateSubscription = (data) => ({ type: 'UPDATE_SUBSCRIPTION', payload: data });
const Show = {
    When: ({ isTrue, children }) => isTrue ? children : null,
    Else: ({ children }) => children
};
// --- Main Component ---
export function Plans({ mode, setThings}) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const buySubscription = async (subscriptionType) => {
        try {
            let response = await axiosMock.post("/student/payment/buy-subscription", { plan: subscriptionType });
            response = response.data;
            if (response.success) {
                dispatch(updateSubscription(response.data));
                navigate('/student');
            }
        } catch (error) {
            console.error("Subscription Error --> ", error);
        }
    }

    const handleClick = (subscription) => {
        if (setThings) {
            setThings(true, subscription);
        } else {
            console.log(`Selected plan: ${subscription.name}`);
        }
    }

    return (
       <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 sm:p-12">
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <Show.When isTrue={mode === 'resubscribe'}>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 mb-3 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 font-[Segoe UI, Tahoma, Geneva, Verdana, sans-serif]">
              Welcome Back! Select Your Ideal Plan
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-[Segoe UI, Tahoma, Geneva, Verdana, sans-serif]">
              Choose a plan that fits your needs today. You can always upgrade later for more features and benefits.
            </p>
          </Show.When>
          <Show.Else>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 mb-3 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 font-[Segoe UI, Tahoma, Geneva, Verdana, sans-serif]">
              Choose Your Plan
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-[Segoe UI, Tahoma, Geneva, Verdana, sans-serif]">
              Get the right plan for you, your plan can be upgraded in the future.
            </p>
          </Show.Else>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {PLANS.map((s, k) => (
            <Card
              key={k}
              className="p-6 sm:p-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border-0 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_0_25px_5px_rgba(59,130,246,0.2)]"
            >
              <CardHeader className="p-0 mb-6">
                <h2 className="text-2xl font-bold text-center mb-2 text-slate-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 font-[Segoe UI, Tahoma, Geneva, Verdana, sans-serif]">
                  {s.name}
                </h2>
                <p className="text-5xl font-bold text-center text-slate-800 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 font-[Segoe UI, Tahoma, Geneva, Verdana, sans-serif]">
                  {s.price}
                </p>
              </CardHeader>

              <CardContent className="p-0 mb-8">
                <ul className="space-y-4 text-slate-600 font-[Segoe UI, Tahoma, Geneva, Verdana, sans-serif]">
                  {s.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                      <span className="text-base font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="p-0 flex justify-center">
                <Button
                  onClick={() => handleClick(s)}
                  className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold py-3 px-6 text-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center gap-2 justify-center font-[Segoe UI, Tahoma, Geneva, Verdana, sans-serif]"
                >
                  <span>Buy Now</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
    )
}

export default Plans;
