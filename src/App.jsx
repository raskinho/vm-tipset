import React, { useState } from "react";

export default function App() {
  const [email,setEmail] = useState("");

  return (
    <div style={{padding:20}}>
      <h1>⚽ Tippa VM 2026</h1>

      <input
        placeholder="E-post"
        onChange={e=>setEmail(e.target.value)}
      />

      <p>Hej {email}</p>
    </div>
  );
}
