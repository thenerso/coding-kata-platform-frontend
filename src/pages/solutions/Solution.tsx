import styled from "@emotion/styled";
import { ArrowBack, Done } from "@mui/icons-material";
import {
    Button,
    Typography,
    Fab,
    Divider,
    Grid,
    Card,
    CardHeader,
    CardContent,
    List,
    Chip,
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
} from "@mui/material";
import { useEffect, useState } from "react";
import {useNavigate, useParams } from "react-router-dom";
import EmptyState from "../../components/global/EmptyState";
import Loading from "../../components/global/Loading";
// import DeleteProblem from "../../components/problem/DeleteProblem";
import DifficultyChip from "../../components/problem/DifficultyChip";

import Tags from "../../components/problem/Tags";
import TestCases from "../../components/problem/TestCases";

import authService from "../../services/authService";
import { ISolution } from "../../interfaces/solutions";
import solutionService from "../../services/solutionService";
import CodeEditor from "../../components/editor/CodeEditor";

/**
 * Injected styles
 *
 */
const TitleWrapper = styled("div")`
  display: flex;
  justify-content: space-between;
`;

const TitleActionWrapper = styled("div")`
  a {
    margin: 0 5px;
  }
`;

const StyledChip = styled(Chip)`
  margin: 10px 0;
`;

const ChipWrapper = styled("div")`
  display: flex;
  align-items: center;
  div {
    margin: 0 10px;
  }
  margin: 15px 0;
`;

const Solution = () => {
    const [solution, setSolution] = useState<ISolution | undefined>();
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = authService.getAccessToken();

        if (token) {
            if (!solution && id) {
                setError("");
                setLoading(true);
                solutionService
                    .getById(token, id)
                    .then((result) => {
                        setSolution(result);
                        setLoading(false);
                    })
                    .catch((err) => {
                        console.log("Error getting problem sets", err);
                        setError("Error fetching data");
                        setLoading(false);
                    });
            }
        } else {
            setError("Authentication error, please log in again");
            setLoading(false);
        }
    }, [solution, id]);

    if (loading) return <Loading />;
    if (error || !solution) return <EmptyState message={error} />;
    return (
        <>
            <Button
                color="info"
                onClick={() => navigate(-1)}
                startIcon={<ArrowBack />}
            >
                Back
            </Button>
            <ChipWrapper>
                <DifficultyChip label={solution.problem.difficulty || ""} />
                <Divider orientation="vertical" flexItem />
                <Tags tags={solution.problem?.tags} />
            </ChipWrapper>
            <TitleWrapper>
                <Typography variant="h1">{`Solution for '${solution.problem.title}' by '${solution.user.username}'`}</Typography>
                <TitleActionWrapper>
                    <Fab
                        color="secondary"
                        aria-label="Edit problem set"
                    >
                        <Done />
                    </Fab>

                    {/* {problem.id && <DeleteProblem id={problem.id} />} */}
                </TitleActionWrapper>
            </TitleWrapper>

            <Typography variant="subtitle1">{solution.problem?.description}</Typography>

            <br />
            <Grid container spacing={5}>
                <Grid item md={6} sm={12} xs={12}>
                    <Card>
                        <CardHeader title="Test Cases" />
                        <CardContent>
                            <List>
                                <StyledChip label="Public" color="success" />
                                {solution.problem?.testSuite?.publicCases?.map((item, index) => {
                                    return (
                                        <TestCases
                                            key={`${index}-${item.id}`}
                                            testCase={item}
                                            defaultOpen
                                        />
                                    );
                                })}
                                <Divider />
                                <StyledChip label="Private" color="warning" />

                                {solution.problem?.testSuite?.privateCases?.map((item, index) => {
                                    return (
                                        <TestCases key={`${index}-${item.id}`} testCase={item} />
                                    );
                                })}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item md={6} sm={12} xs={12}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="Solutions table">
                            <TableHead>
                                <TableRow>
                                    <TableCell><Typography>{`User: ${solution.user.username}`}</Typography></TableCell>
                                    <TableCell><Typography>{`Language: ${solution.lang === "js" ? "javascript" : solution.lang}`}</Typography></TableCell>
                                    <TableCell><Typography>{`Sumbitted: ${solution.submissionDate}`}</Typography></TableCell>
                                </TableRow>
                            </TableHead>
                        </Table>
                    </TableContainer>
                    <CodeEditor fontSize={16}
                        theme={'monokai'}
                        language={solution.lang === "js" ? "javascript" : solution.lang}
                        value={solution.code}
                        onEditorValueChange={() => { }}
                        readOnly />
                </Grid>
            </Grid>
        </>
    );
};

export default Solution;
