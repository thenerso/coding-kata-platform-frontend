import styled from "@emotion/styled";
import {
  Grid,
  Card,
  CardContent,
  Divider,
  Typography,
  CardHeader,
  List,
  Chip,
  Box,
  Tab,
  Tabs,
} from "@mui/material";
import React from "react";
import { IEvalResponse } from "../../../interfaces/eval";
import { IProblem } from "../../../interfaces/problemSet";
import DifficultyChip from "../DifficultyChip";
import Tags from "../Tags";
import TestCases from "../test-case/TestCases";
import AttemptOutput from "./AttemptOutput";
import { renderHTML } from "../../global/Rendering";

/**
 * Injected styles
 *
 */
const StyledCard = styled(Card)`
  min-height: 550px;
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

const StyledCardTestCaseContent = styled(CardContent)`
  padding-top: 0;
`;

interface IAttemptDetailsWrapper {
  problem: IProblem;
  evalResponse: IEvalResponse | null | undefined;
  value: number;
  setValue: (value: number) => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`create-member-tabpanel-${index}`}
      aria-labelledby={`create-member-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `create-member-tab-${index}`,
    "aria-controls": `create-member-tabpanel-${index}`,
  };
}

const AttemptDetailsWrapper = ({
  problem,
  evalResponse,
  value,
  setValue,
}: IAttemptDetailsWrapper) => {
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <>
      <Grid item md={5} container spacing={2} direction="column">
        <Grid item md={12}>
          <StyledCard>
            <Box>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Instructions" {...a11yProps(0)} />
                <Tab label="Output" {...a11yProps(1)} />
              </Tabs>
            </Box>
            <CardContent>
              <TabPanel value={value} index={0}>
                <ChipWrapper>
                  <DifficultyChip label={problem.difficulty || ""} />
                  <Divider orientation="vertical" flexItem />
                  <Tags tags={problem.tags} />
                </ChipWrapper>

                <Typography variant="h1">{problem.title}</Typography>

                <Typography variant="subtitle1">
                  <div dangerouslySetInnerHTML={renderHTML(problem.description)} />
                </Typography>

                <CardHeader title="Test Cases" />
                <StyledCardTestCaseContent>
                  <List>
                    <StyledChip label="Public" color="success" />
                    {problem.testSuite?.publicCases?.map((item, index) => {
                      return (
                        <TestCases
                          key={`${index}-${item.id}`}
                          functionName={problem.title || ""}
                          testCase={item}
                        />
                      );
                    })}
                  </List>
                </StyledCardTestCaseContent>
              </TabPanel>
              <TabPanel value={value} index={1}>
                <AttemptOutput problem={problem} evalResponse={evalResponse} />
              </TabPanel>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </>
  );
};

export default AttemptDetailsWrapper;
