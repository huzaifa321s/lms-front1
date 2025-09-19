import { TimerIcon } from "lucide-react";
import { useEffect, useState, memo } from "react";




const Timer = ({ level, validate, index, isRunning }) => {

    const TEMPLATE = {};

    if (level === 'beginner') {
        TEMPLATE.minutes = 1;
        TEMPLATE.seconds = 0;
    }
    if (level === 'intermediate') {
        TEMPLATE.minutes = 0;
        TEMPLATE.seconds = 45;
    }
    if (level === 'expert') {
        TEMPLATE.minutes = 0;
        TEMPLATE.seconds = 30;
    }


    const [time, setTime] = useState(TEMPLATE);


    useEffect(() => {
        if (isRunning) {
            const timeout = setTimeout(() => {
                const { minutes, seconds } = time;
                if (minutes === 0 && seconds === 0) {
                    validate({
                        timeup: true,
                        errorMessage: 'Time up!'
                    });

                } else if (minutes > 0 && seconds === 0) {
                    setTime((prev) => ({
                        ...prev,
                        minutes: minutes - 1,
                        seconds: 59
                    }))
                } else if (seconds > 0) {
                    setTime((prev) => ({
                        ...prev,
                        seconds: seconds - 1
                    }))
                }
            }, 1000);

            return () => clearTimeout(timeout);
        }
    }, [time, isRunning])


    useEffect(() => {
        setTime(TEMPLATE);
    }, [index])


    return (
        <div className='flex justify-center items-center text-2xl font-semibold w-full'>
          <TimerIcon/> <span>{time.minutes.toString().padStart(2, '0')}</span>:<span>{time.seconds.toString().padStart(2, '0')}</span>
        </div>
    )

}


// export default Timer;

export default memo(Timer);
// export default memo(Timer, (prevProps, nextProps) => prevProps.index === nextProps.index);