import { AdminProfile } from "../../../public/data/adminData";
import { checkIfSignedIn } from "../actions";

const isAdminUser = async () => {
    
    const userData = await checkIfSignedIn();
    return userData.id === AdminProfile;
    
}


export default isAdminUser;