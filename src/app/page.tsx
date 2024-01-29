"use client";
import { useState } from "react";
import request from "@/services/request-service";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import { ListItem, ListItemButton } from "@mui/material";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";

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
    <Container component="main">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 16,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Cadastrar Candidato
        </Typography>
        <Box
          component="form"
          onSubmit={(e) => handleForm(e)}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="candidateName"
            label="Nome do candidato"
            name="nome"
            autoFocus
            onChange={(e) => setName(e.target.value)}
            type="text"
            value={name}
          />
          <List>
            {skills.map((skillData) => (
              <ListItem key={skillData.id} style={{ padding: 0 }}>
                <TextField
                  margin="normal"
                  fullWidth
                  type="text"
                  id="candidateSkill"
                  label="Habilidade"
                  disabled
                  value={skillData.name}
                />
              </ListItem>
            ))}
            <ListItem style={{ padding: 0 }}>
              <TextField
                margin="normal"
                type="text"
                id="candidateSkill"
                label="Adicionar habilidade"
                onChange={(e) => setSkill(e.target.value)}
                value={skill}
              />
              <ListItemButton
                onClick={(e) => {
                  e.preventDefault();
                  addSkill();
                }}
              >
                <AddBoxOutlinedIcon />
              </ListItemButton>
            </ListItem>
          </List>
          <Button
            sx={{ m: 1 }}
            variant="contained"
            onClick={() => router.push("/candidatos")}
          >
            Buscar candidatos
          </Button>
          <Button sx={{ m: 1 }} variant="contained" type="submit">
            Cadastrar
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
