"use client";
import { useEffect, useState } from "react";
import request from "@/services/request-service";

interface ISkill {
  name: string;
  id: number;
}
interface ICandidate {
  id: string;
  name: string;
  skills: string[];
}

export default function Search() {
  const [skills, setSkills] = useState<ISkill[]>([]);
  const [skill, setSkill] = useState("");
  const [candidates, setCandidates] = useState<ICandidate[]>([]);
  const [skillsNameList, setSkillsNameList] = useState<string[]>([]);

  function addSkill() {
    if (skill.trim()) {
      setSkills([...skills, { name: skill, id: skills.length }]);
    }
    setSkill("");
  }

  async function handleForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!skills.length && !skill.trim())
      return alert("Adicione pelo menos uma habilidade");

    const skillsWithLastInput: ISkill[] = [
      ...skills,
      { name: skill, id: skills.length },
    ];

    setSkillsNameList(skillsWithLastInput.map((skill) => skill.name));
  }

  useEffect(() => {
    async function fetchCandidates() {
      let url: string = "/candidates";
      if (skillsNameList.length) {
        url += "?skills=" + skillsNameList;
      }
      await request
        .get(url)
        .then((res) => {
          setCandidates(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    fetchCandidates();
  }, [skillsNameList]);

  return (
    <main>
      <form onSubmit={(e) => handleForm(e)}>
        <h5>Buscar Candidato por Habilidade</h5>
        <label htmlFor="candidateSkill">Habilidade</label>
        <ul>
          {skills.map((skillData) => (
            <li key={skillData.id}>
              <input
                type="text"
                id="candidateSkill"
                placeholder="TypeScript"
                disabled
                value={skillData.name}
              />
            </li>
          ))}
          <li>
            <input
              type="text"
              id="candidateSkill"
              placeholder="TypeScript..."
              onChange={(e) => setSkill(e.target.value)}
              value={skill}
            />
          </li>
        </ul>
        <button
          onClick={(e) => {
            e.preventDefault();
            addSkill();
          }}
        >
          +
        </button>
        <button type="submit">Buscar</button>
      </form>
      <div>
        <h5>Candidatos</h5>
        <ul>
          {candidates.map((candidate) => (
            <li key={candidate.id}>
              <p>{candidate.name}</p>
              <ul>
                {candidate.skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
