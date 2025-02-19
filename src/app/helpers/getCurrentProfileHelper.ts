import { DBProfile } from "../../../public/types";

export const GetCurrentProfile = (jsonProfile: any, profileId: string)  => {
    const allProfileKeys = Object.keys(jsonProfile);
    const currentProfile = allProfileKeys.filter( (profile: string )=> jsonProfile[profile].id === profileId)
    return currentProfile;
    
}