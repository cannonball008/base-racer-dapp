//@ts-nocheck
import { useState, useEffect } from "react";
import "./style.css";
export default function LiveNowSingle(props) {
  const [embed, setEmbed] = useState(null);

  useEffect(() => {
    if (embed) {
      embed.addEventListener(Twitch.Player.ONLINE, () => {
        console.log("online!");
        document
          .querySelector(`#twitch-${props.channelName}`)
          .classList.remove("hide");
      });

      embed.addEventListener(Twitch.Player.OFFLINE, () => {
        console.log("offline!");
        document
          .querySelector(`#twitch-${props.channelName}`)
          .classList.add("hide");
      });
    } else if (!document.querySelector(`#twitch-${props.channelName} iframe`)) {
      setEmbed(
        new Twitch.Player(`twitch-${props.channelName}`, {
          width: "100%",
          height: 400,
          channel: props.channelName,
        })
      );
    }
  }, [embed]);

  return <div id={`twitch-${props.channelName}`} className="hide"></div>;
}
