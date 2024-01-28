"use client";
import { useState } from "react";
import request from "@/services/request-service";
import { useRouter } from "next/navigation";

interface ISkill {
  name: string;
  id: number;
}

export default function Home() {
  const [name, setName] = useState("");
  const [skills, setSkills] = useState<ISkill[]>([]);
  const [skill, setSkill] = useState("");

  const router = useRouter();

  function addSkill() {
    if (skill.trim()) {
      setSkills([...skills, { name: skill, id: skills.length }]);
    }
    setSkill("");
  }

  async function handleForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name.trim()) return alert("Preencha o nome do candidato");

    if (!skills.length && !skill.trim())
      return alert("Adicione pelo menos uma habilidade");

    const skillsWithLastInput: ISkill[] = [
      ...skills,
      { name: skill, id: skills.length },
    ];

    const skillsNameList = skillsWithLastInput.map((skill) => skill.name);

    const candidate = {
      name,
      skills: skillsNameList,
    };

    await request
      .post("/candidates", candidate)
      .then((res) => {
        alert("Candidato cadastrado com sucesso");
        setName("");
        setSkills([]);
        setSkill("");
      })
      .catch((err) => {
        alert("Erro ao cadastrar candidato");
        console.log(err);
      });
  }

  return (
    <main>
      <h5>Cadastrar candidato</h5>
      <button onClick={() => router.push("/candidatos")}>
        Buscar candidatos
      </button>
      <form onSubmit={(e) => handleForm(e)}>
        <label htmlFor="candidateName">Nome</label>
        <input
          type="text"
          id="candidateName"
          placeholder="Digite o nome do candidato"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
        <button type="submit">Cadastrar</button>
      </form>
    </main>
  );
}
