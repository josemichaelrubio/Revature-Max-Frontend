export class UserProfile {

    id: number;
    role: string;
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    pictureUrl: string;

    constructor(_id:number, _role:string,_name:string,_email:string,_phoneNumber:string,_address:string,_pictureUrl:string){

        this.id=_id;
        this.role=_role;
        this.name=_name;
        this.email=_email;
        this.phoneNumber=_phoneNumber;
        this.address=_address;
        this.pictureUrl=_pictureUrl;
        
    }

}
