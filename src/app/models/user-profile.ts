export class UserProfile {

    id: number;
    role: string;
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    pictureUrl: string;

    constructor(profile:any){
        this.id=profile.id;
        this.role=profile.role;
        this.name=profile.name;
        this.email=profile.email;
        this.phoneNumber=profile.phoneNumber;
        this.address=profile.address;
        this.pictureUrl=profile.pictureUrl;
    }

}
