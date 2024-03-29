import React, { useState } from "react";
import { Button } from "react-bootstrap";

const Advertisment = () => {
  const [moneyToDonate, setMoneyToDonate] = useState(0);

  const handleSubmit = () => {
    fetch( process.env.REACT_APP_DONATION_API || "http://localhost:5000/api/donation/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [{ id: 1, name: "donation", quantity:1, priceInCents: moneyToDonate }],
      }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        return res.json().then((json) => Promise.reject(json));
      })
      .then(({ url }) => {
        window.location = url;
      })
      .catch((e) => {
        console.error(e.error);
      });
  };

  return (
    <div>
      <h1>Help Us by contributing.</h1>
      <input
        placeholder="amount you will to contribute"
        value={moneyToDonate}
        onChange={(e) => setMoneyToDonate(e.target.value)}
      />

      <Button variant="secondary" onClick={handleSubmit}>Donate Us!</Button>
    </div>
  );
};

export default Advertisment;
