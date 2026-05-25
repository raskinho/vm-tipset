import React, { useState, useEffect } from "react";

// ======================================
// ✅ GRUPPER (från ditt riktiga schema)
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
// ✅ GENERERA ALLA MATCHER AUTOMATISKT
// ======================================
let matchId = 1;

const groupMatches = Object.entries(groups).flatMap(([group, teams]) => {
  const matches = [];

  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      matches.push({
        id: "G" + matchId++,
        group,
        home: teams[i],
        away: teams[j]
      });
    }
  }

  return matches;
});

// DEBUG (kan tas bort)
console.log("Antal gruppmatcher:", groupMatches.length); 
// 👉 ska bli 72

// ======================================
// ✅ APP
// ======================================
export default function App() {

  // ✅ AUTH
  const [email,setEmail] = useState("");
  const [code,setCode] = useState("");
  const [gen,setGen] = useState("");
  const [verified,setVerified] = useState(false);

  // ✅ DATA
  const [answers,setAnswers] = useState({});

  // ======================================
  // ✅ AUTH FLOW
  // ======================================
