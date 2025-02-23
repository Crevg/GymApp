import { HardCodedProfiles1 } from "../../../public/data/hardcodeProfiles";
import { checkIfSignedIn } from "../actions";

const isAdminUser = async () => {
    const userData = await checkIfSignedIn();
    return userData.name === HardCodedProfiles1;
    
}


export default isAdminUser;