import React from "react";
import Marquee from "react-fast-marquee";
export default function Header() {
  return (
    <>
      {" "}
      <Marquee
        className="marquee-text"
        style={{
          backgroundColor: "#173334", // Background color of the marquee
          color: "#febd2f", // Text color
          whiteSpace: "nowrap", // Prevent text from wrapping
          animation: "marquee 100s linear infinite", // Apply the marquee animation
        }}
      >
        "Our website is under maintenance. We’re making improvements and will be
        back shortly. Thank you for your patience."
      </Marquee>
    </>
  );
}
