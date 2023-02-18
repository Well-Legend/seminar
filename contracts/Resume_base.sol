//SPDX-License-Indentifier: MIT
pragma solidity ^0.8.17;


import "./String_lib.sol";
contract Resume_base{
//the information government have
    address internal government;
    Profile public profile;
    struct Profile{
        string name;
        address account;
        uint8 age;
        Gender gender;
        string contact;
        string autobiography;
    }
    enum Gender{
        male,
        female,
        other
    }

//the information for organizations
    mapping (address => Organization) internal organizations;
    struct Organization{
        string name;
        Organization_type property;
        address account;
        bool permission;
    }
    enum Organization_type{
        everyone,
        school,
        company
    }

//experience from school and work
    education[] internal education_experience;
    job[] internal job_experience;
    
    struct education{
        Organization school;//學校資訊
        education_status status;//就學狀況
        string major;//主修
        Course[] courses;//修課證明
        License[] licenses;//證照
    }

    enum education_status{
        undergraduate,
        learning,
        graduate
    }

    struct Course{
        string name;
        string content;//課程內容
        string comment;//老師評語
        uint8 grade;//成績
    }

    struct License{
        string name;
        string content;//檢定內容
    }

    struct job{
        Organization company;//公司資訊
        string position;//職位
        uint start_date;//就職日
        uint end_date;//離職日
    }

//the skills 
    skill[] internal skills;

    struct skill{
        string class;//類別
        string name;
    }

//when using this contract someone should fill in these informations
    constructor(string memory name, address account, uint8 age, Gender gender){
        government = msg.sender;
        profile = Profile({
            name: name,
            account: account,
            age: age,
            gender: gender,
            contact: "",
            autobiography: ""
        });    
    }

//promissions for all
    modifier only_gov{
        require(msg.sender == government, "Permission denied, please use government account");
        _;
    }

    modifier only_school{
        bool is_school = organizations[msg.sender].property == Organization_type.school;
        require(is_school && organizations[msg.sender].permission, "Permission denied, please use school account");
        _;
    }

    modifier only_company{
        bool is_company = organizations[msg.sender].property == Organization_type.company;
        require(is_company && organizations[msg.sender].permission, "Permission denied, please use company account");
        _;
    }

    modifier only_host{
        require(msg.sender == profile.account, "Permission denied, please use host account");
        _;
    }

    modifier index_valid(uint index, uint max){
        require(index < max, "Out of range");
        _;
    }

//console log
    event done(done_code event_code, string message);

    enum done_code{
        set_permission,    //設置機構權限
        set_education,     //設置學歷
        set_license,       //設置證照
        set_course,        //設置修課證明
        set_experience,    //設置工作經歷
        set_job_end_date,  //設置離職日
        set_autobiography, //設置自傳
        set_skill,         //設置專業技術
        set_contact,       //設置連絡方式
        remove_permission, //移除機構權限
        remove_skill       //移除專業技術
    }

//search where the organization place in array
    using StringLib for string;
    function find_organization(address org, string memory property) internal view returns(int){
        int index = -1;
        if(property.compare("education")) {
            for(uint i=0; i<education_experience.length; i++){
                if(education_experience[i].school.account == org){
                    index = int(i);
                    break;
                }
            }
        }

        else if(property.compare("experience")){
            for (uint i=0; i<job_experience.length; i++){
                if(job_experience[i].company.account == org){
                    index = int(i);
                    break;
                }
            }
        }
        return index;
    }
}

