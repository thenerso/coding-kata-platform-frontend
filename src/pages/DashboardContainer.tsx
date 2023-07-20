import { Dashboard } from "@mui/icons-material";
import { UserRoles } from "../routing/routes";
import AdminDashboard from "./AdminDashboard";
import ListPublicProfiles from "./users/ListPublicProfiles";

const DashboardContainer = ({role} : {role: UserRoles})=> {
    return role === UserRoles.ADMIN ? <AdminDashboard /> : role === UserRoles.USER ?
        <Dashboard /> : role === UserRoles.CLIENT ? <ListPublicProfiles /> : <p>Yo</p>;
}

export default DashboardContainer;