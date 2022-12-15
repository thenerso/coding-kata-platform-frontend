import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { IUser } from "../../../interfaces/user";
import { Dayjs } from "dayjs";
import { Group, Person } from "@mui/icons-material";
import CreateSingleMember from "./CreateSingleMember";
import CreateBulkMember from "./CreateBulkMember";
import { Card } from "@mui/material";

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
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
export interface ICreateBulkMember {
  members: IUser[];
  setMembers: (members: IUser[]) => void;
  startDate: Dayjs | null;
}

const CreateMemberWrapper = ({
  members,
  setMembers,
  startDate,
}: ICreateBulkMember) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Card>
      {/* <CardHeader> */}
      <Box
      // sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab icon={<Person />} label="Single Member" {...a11yProps(0)} />
          <Tab icon={<Group />} label="Bulk Create" {...a11yProps(1)} />
        </Tabs>
      </Box>
      {/* </CardHeader> */}
      {/* <CardContent> */}
      <TabPanel value={value} index={0}>
        <CreateSingleMember
          members={members}
          setMembers={setMembers}
          startDate={startDate}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <CreateBulkMember
          members={members}
          setMembers={setMembers}
          startDate={startDate}
        />
      </TabPanel>
      {/* </CardContent> */}
    </Card>
  );
};

export default CreateMemberWrapper;
