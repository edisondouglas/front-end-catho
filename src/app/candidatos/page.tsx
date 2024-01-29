"use client";
import { useEffect, useState } from "react";
import request from "@/services/request-service";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

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

  const router = useRouter();

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
          alert(`Erro ao buscar candidatos ${err.response.data.message}`);
          setCandidates([]);
          console.log(err);
        });
    }
    fetchCandidates();
  }, [skillsNameList]);

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
          Buscar Candidatos por Habilidades
        </Typography>
        <Box
          component="form"
          onSubmit={(e) => handleForm(e)}
          noValidate
          sx={{ mt: 1 }}
        >
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
            onClick={() => router.push("/")}
          >
            Voltar
          </Button>
          <Button sx={{ m: 1 }} variant="contained" type="submit">
            Buscar
          </Button>
        </Box>
      </Box>
      <Box sx={{ m: 8 }}>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Nome Candidato</TableCell>
                <TableCell align="left">Habilidades</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {candidates.map((candidate) => (
                <TableRow
                  key={candidate.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="left">{candidate.name}</TableCell>
                  <TableCell align="left">
                    {candidate.skills.join(", ")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
}
