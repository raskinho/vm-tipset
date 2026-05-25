import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, onSnapshot, collection } from "firebase/firestore";

// ✅ FIREBASE CONFIG (byt ut!)
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_APP.firebaseapp.com",
  projectId: "YOUR_APP"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ======================================
// ✅ GRUPPER
// ======================================
const groups = {
  A: ["Mexiko","Sydkorea","Sydafrika","Tjeckien"],
  B: ["Kanada","Qatar","Schweiz","Bosnien-Hercegovina"],
  C: ["Brasilien","Marocko","Haiti","Skottland"],
  D: ["USA","Paraguay","Australien","Turkiet"],
  E: ["Tyskland","Curaçao","Elfenbenskusten","Ecuador"],
  F: ["Nederländerna","Japan","Tunisien","Sverige"],
  G: ["Belgien","Iran","Nya Zeeland","Egypten"],
  H: ["Spanien","Saudiarabien","Uruguay","Kap Verde"],
  I: ["Frankrike","Senegal","Norge","Irak"],
  J: ["Argentina","Algeriet","Österrike","Jordanien"],
  K: ["Portugal","Uzbekistan","Colombia","DR Kongo"],
  L: ["England","Ghana","Kroatien","Panama"]
};

// ======================================
// ✅ GENERERA GRUPPMATCHER
// ======================================
let id = 1;
const groupMatches = Object.entries(groups).flatMap(([group, teams]) => {
  const matches = [];
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      matches.push({
        id: id++,
        group,
        home: teams[i],
        away: teams[j]
      });
    }
  }
  return matches;
});

// ======================================
// ✅ SLUTSPEL
// ======================================
const knockout = [
  {id:65, stage:"16-del", home:"2A", away:"2B"},
  {id:66, stage:"16-del", home:"1C", away:"2F"},
  {id:81, stage:"åttondel", home:"W65", away:"W66"},
  {id:89, stage:"kvartsfinal", home:"W81", away:"W82"},
  {id:93, stage:"semi", home:"W89", away:"W90"},
  {id:100, stage:"final", home:"W93", away:"W94"}
];

// ======================================
// ✅ RESULT (admin senare)
// ======================================
const results = {};

// ======================================
// ✅ POÄNGRÄKNING
// ======================================
const calcPoints = (answers) => {
  let points = 0;

  Object.entries(answers).forEach(([id, tip]) => {
    const res = results[id];
    if (!res) return;

    const h = parseInt(tip.h);
    const b = parseInt(tip.b);

    if (h === res.h && b === res.b) points += 3;
    else if (
      (h > b && res.h > res.b) ||
      (b > h && res.b > res.h) ||
      (h === b && res.h === res.b)
    ) points += 1;
  });

  return points;
};

// ======================================
// ✅ APP
// ======================================
export default function App() {

  const [email,setEmail] = useState("");
  const [verified,setVerified] = useState(false);
  const [answers,setAnswers] = useState({});
  const [leaderboard,setLeaderboard] = useState([]);

  // ✅ AUTH (enkel)
  useEffect(()=>{
    const user = localStorage.getItem("user");
    if(user){
      setEmail(user);
      setVerified(true);
    }
  },[]);

  const login = ()=>{
    const user = prompt("Ange e-post:");
    localStorage.setItem("user", user);
    setEmail(user);
    setVerified(true);
  };

  // ✅ SAVE
  const save = async ()=>{
    await setDoc(doc(db,"tips",email), answers);
    alert("Sparat ✅");
  };

  // ✅ LIVE LEADERBOARD
  useEffect(()=>{
    const unsub = onSnapshot(collection(db,"tips"), snap=>{
      const data = [];

      snap.forEach(docSnap=>{
        const userAnswers = docSnap.data();

        data.push({
          name: docSnap.id,
          points: calcPoints(userAnswers)
        });
      });

      data.sort((a,b)=>b.points-a.points);
      setLeaderboard(data);
    });

    return ()=>unsub();
  },[]);

  if(!verified){
    return (
      <div style={{padding:20}}>
        <h2>Start</h2>
        <button onClick={login}>Starta tipset</button>
      </div>
    );
  }

  return (
    <div style={{padding:15}}>

      <h1>⚽ Tippa VM 2026</h1>

      {/* ✅ GRUPPSPEL */}
      <h2>Gruppspel</h2>

      {Object.keys(groups).map(group => {

        const matches = groupMatches.filter(m => m.group === group);

        return (
          <div key={group} style={{marginBottom:15}}>
            <h3>Grupp {group}</h3>

            {matches.map(m => {
              const h = answers[m.id]?.h || "";
              const b = answers[m.id]?.b || "";

              return (
                <div key={m.id}>
                  {m.home} - {m.away}

                  <input
                    value={h}
                    onChange={e=>setAnswers({
                      ...answers,
                      [m.id]: {...answers[m.id], h:e.target.value}
                    })}
                  />
                  -
                  <input
                    value={b}
                    onChange={e=>setAnswers({
                      ...answers,
                      [m.id]: {...answers[m.id], b:e.target.value}
                    })}
                  />
                </div>
              );
            })}
          </div>
        );
      })}

      {/* ✅ SLUTSPEL */}
      <h2>Slutspel</h2>

      {knockout.map(m=>(
        <div key={m.id}>
          {m.home} - {m.away}
        </div>
      ))}

      <button onClick={save}>Spara</button>

      {/* ✅ LEADERBOARD */}
      <h2>🏆 Leaderboard</h2>

      {leaderboard.map((p,i)=>(
        <div key={i}>
          {i+1}. {p.name} – {p.points}
        </div>
      ))}

    </div>
  );
}
