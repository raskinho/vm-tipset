import React, { useState, useEffect } from "react";

// ✅ KONFIG – KLART ATT ANVÄNDA
const API_URL = "https://script.google.com/macros/s/REPLACE_ME/exec";


const matches = [
  { id: "m1", hem: "Sverige", borta: "Brasilien" },
  { id: "m2", hem: "Argentina", borta: "Tyskland" }
];


const teams = [
  "Argentina","Brasilien","Frankrike","Sverige","Tyskland"
].sort();

export default function App() {
  const [answers, setAnswers] = useState({});
  const [winner, setWinner] = useState("");
  const [name, setName] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [results, setResults] = useState({});
  const [admin, setAdmin] = useState(false);


  // ✅ AUTO REFRESH
  useEffect(() => {
    fetchLeaderboard();
    const i = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(i);
  }, []);

  // ✅ HÄMTA POÄNGLISTA
  const fetchLeaderboard = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setLeaderboard(data);
    } catch (e) {
      console.log("API ej kopplat ännu");
    }
  };

  // ✅ TIPS
  const handle = (match, team, val) => {
    setAnswers({
      ...answers,
      [match]: {
        ...answers[match],
        [team]: val
      }
    });
  };

  // ✅ SKICKA IN TIPS
  const submit = async () => {
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ name, answers, winner })
    });
    alert("Tips skickat ✅");
  };

  // ✅ ADMIN – spara resultat
  const saveResults = async () => {
    await fetch(API_URL + "?admin=1", {
      method: "POST",
      body: JSON.stringify(results)
    });
    alert("Resultat sparade ✅");
  };
  return (
    <div style={{
      minHeight: "100vh",
      padding: 20,
      background: "linear-gradient(135deg,#003399,#ffcc00)"
    }}>
      <h1 style={{ color: "white" }}>⚽ VM 2026 Tipset</h1>
      {/* NAMN */}
      <input
        placeholder="Ditt namn"
        style={{ padding: 10, marginBottom: 20 }}
        onChange={(e) => setName(e.target.value)}
      />
      {/* MATCHER */}
      {matches.map(m => (
        <div key={m.id} style={{ background: "white", padding: 15, marginBottom: 10 }}>
          <b>{m.hem} - {m.borta}</b>
          <div>
            <input style={{ width: 40 }} onChange={(e) => handle(m.id, "h", e.target.value)} />
            {' - '}
            <input style={{ width: 40 }} onChange={(e) => handle(m.id, "b", e.target.value)} />
          </div>
        </div>
      ))}
      {/* VINNARE */}
      <div style={{ background: "white", padding: 15, marginBottom: 20 }}>
        <b>VM-vinnare (9 poäng)</b>
        <select style={{ display: "block", marginTop: 10 }} onChange={(e) => setWinner(e.target.value)}>
          <option>Välj lag</option>
          {teams.map(t => (<option key={t}>{t}</option>))}
        </select>
      </div>
      <button onClick={submit}>Skicka tips</button>
      {/* LEADERBOARD */}
      <div style={{ background: "white", marginTop: 20, padding: 15 }}>
        <h2>🏆 Poänglista</h2>
        {leaderboard.map((p, i) => (
          <div key={i} style={{
            display: "flex",
            justifyContent: "space-between",
            animation: "fade 0.5s"
          }}>
            <span>{i + 1}. {p.name}</span>
            <b>{p.points} p</b>
          </div>
        ))}
      </div>
      {/* ADMIN */}
      <button onClick={() => setAdmin(!admin)} style={{ marginTop: 20 }}>
        Admin
      </button>


      {admin && (
        <div style={{ background: "white", padding: 15, marginTop: 10 }}>
          <h3>Admin – resultat</h3>
          {matches.map(m => (
            <div key={m.id}>
              {m.hem}-{m.borta}
              <input style={{ width: 40 }} onChange={(e) => setResults({ ...results, [m.id]: { ...results[m.id], h: e.target.value } })} />
              {' - '}
              <input style={{ width: 40 }} onChange={(e) => setResults({ ...results, [m.id]: { ...results[m.id], b: e.target.value } })} />
            </div>
          ))}
          <button onClick={saveResults}>Spara</button>
        </div>
      )}
      <style>{`
        @keyframes fade {
          from { opacity: 0 }
          to { opacity: 1 }
        }
      `}</style>
    </div>
  );
}

// =======================================================
// ✅ GOOGLE APPS SCRIPT (KLART ATT KLISTRA IN DIREKT)
// =======================================================
/*
function doGet() {
  var s = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Poänglista');
  var data = s.getDataRange().getValues();
  var out = [];
  for (var i = 1; i < data.length; i++) {
    out.push({ name: data[i][1], points: data[i][3] });
  }
  return ContentService.createTextOutput(JSON.stringify(out))
    .setMimeType(ContentService.MimeType.JSON);
}
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tips');
  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    new Date(), data.name, JSON.stringify(data.answers), data.winner
  ]);
  return ContentService.createTextOutput("OK");
}

*/
