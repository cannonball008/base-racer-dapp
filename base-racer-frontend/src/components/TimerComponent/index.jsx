import React, { useEffect, useState } from "react";

const StakeTimerComponent = ({ startDate }) => {
  const startDate1 = new Date(startDate)
  const currentDate = new Date();
  const time = new Date(startDate1).getTime();
  const diff = time - currentDate.getTime();

  const [sec, setSec] = useState(
    diff > 0 ? Math.floor((diff % (1000 * 60)) / 1000) : 0
  );
  const [min, setMin] = useState(
    diff > 0 ? Math.floor((diff % (1000 * 3600)) / (1000 * 60)) : 0
  );
  const [hour, setHour] = useState(
    diff > 0 ? Math.floor((diff % (1000 * 3600 * 24)) / (1000 * 3600)) : 0
  );
  const [days, setDays] = useState(
    diff > 0 ? Math.floor(diff / (1000 * 60 * 60 * 24)) : 0
  );
  useEffect(() => {
    const myInterval = setInterval(() => {
      const currentTime = new Date().getTime();
      const diff = time - currentTime;
      setSec(Math.floor((diff % (1000 * 60)) / 1000));
      setMin(Math.floor((diff % (1000 * 3600)) / (1000 * 60)));
      setHour(Math.floor((diff % (1000 * 3600 * 24)) / (1000 * 60 * 60)));
      setDays(Math.floor(diff / (1000 * 60 * 60 * 24)));
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  }, [sec, min, hour, days]);

  return (
    <>
        {(days > 0) ? days.toLocaleString("en-US", {minimumIntegerDigits: 2,useGrouping: false}) : '00'}:
        {(hour > 0) ? hour.toLocaleString("en-US", {
            minimumIntegerDigits: 2,
            useGrouping: false,
        }) : '00'}:
        {(min > 0) ? min.toLocaleString("en-US", {
            minimumIntegerDigits: 2,
            useGrouping: false,
        }) : '00'}:
        {(sec > 0) ? sec.toLocaleString("en-US", {
            minimumIntegerDigits: 2,
            useGrouping: false,
        }) : '00'}
   
    </>
  );
};

export default StakeTimerComponent;