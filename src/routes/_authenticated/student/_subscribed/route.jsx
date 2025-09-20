import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from '@tanstack/react-router';
import { useSelector, useDispatch } from 'react-redux';
import { createFileRoute } from '@tanstack/react-router';
import { openModal } from '../../../../shared/config/reducers/student/studentDialogSlice';

// Subscription routes that don't require checks
const SUBSCRIPTION_ROUTES = [
  '/student/subscription-plans',
  '/student/resubscription-plans',
  '/student/failed-subscription',
  '/student',
];

export const Route = createFileRoute('/_authenticated/student/_subscribed')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const subscription = useSelector((state) => state.studentAuth.subscription);

  useEffect(() => {
    // Skip checks for subscription routes
    if (SUBSCRIPTION_ROUTES.includes(location.pathname)) {
      return;
    }

    // Missing subscription
    if (!subscription || !subscription?.subscriptionId) {
      dispatch(
        openModal({
          type: 'subscription-modal',
          props: { redirect: location.pathname },
        })
      );
      navigate({ to: '/student', replace: true });
      return;
    }

    // Pending subscription
    if (subscription?.subscriptionId && subscription.status === 'pending') {
      dispatch(
        openModal({
          type: 'activate-subscription-modal',
          props: { redirect: '/student' },
        })
      );
      navigate({ to: '/student', replace: true });
      return;
    }

    // Failed states
    if (['incomplete', 'incomplete_expired', 'past_due', 'unpaid'].includes(subscription?.status)) {
      navigate({
        to: '/student/failed-subscription',
        replace: true,
        search: { redirect: location.pathname },
      });
      return;
    }

    // Cleanup to prevent multiple dispatches
    return () => {
      // Optional: Close modal if needed
      // dispatch(closeModal());
    };
  }, [subscription, location.pathname, dispatch, navigate]);

  // Fallback UI for invalid subscription state
  if (!subscription) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <p className="text-lg text-slate-600">Checking subscription status...</p>
        </div>
      </div>
    );
  }

  return <Outlet />;
}

