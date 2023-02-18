//SPDX-License-Indentifier: MIT
pragma solidity ^0.8.17;

import {Resume_base} from "./Resume_base.sol";
import "./String_lib.sol";

contract Resume is Resume_base{

//把部屬合約時的參數帶回Resume_base合約
    constructor(string memory name, address account, uint8 age, Gender gender) Resume_base(name, account, age, gender){}

//to count the number of each element
    function get_education_experience_count()public view returns(uint){
        return education_experience.length;
    }

    function get_job_experience_count()public view returns(uint){
        return job_experience.length;
    }

    function get_skill_count()public view returns(uint){
        return skills.length;
    }

    function get_course_count(uint index)public view index_valid(index, get_education_experience_count())returns(uint){
        return education_experience[index].courses.length;
    }

    function get_license_count(uint index)public view index_valid(index, get_education_experience_count())returns(uint){
        return education_experience[index].licenses.length;
    }

//to get the information inside each element
    function get_education_experience(uint index)public view index_valid(index, get_education_experience_count())returns(string memory, education_status, string memory){
        education memory edu = education_experience[index];
        return(edu.school.name, edu.status, edu.major);
    }

    function get_job_experience(uint index)public view index_valid(index, get_job_experience_count())returns(string memory, string memory, uint, uint){
        job memory work = job_experience[index];
        return(work.company.name, work.position, work.start_date, work.end_date);
    }

    function get_skill(uint index)public view index_valid(index, get_skill_count())returns(string memory, string memory){
        skill memory talent = skills[index];
        return(talent.class, talent.name);
    }

    function get_course(uint eduindex, uint index)public view index_valid(eduindex, get_education_experience_count()) index_valid(index, get_course_count(eduindex)) returns(string memory, string memory, string memory, uint8){
        Course memory course = education_experience[eduindex].courses[index];
        return(course.name, course.content, course.comment, course.grade);
    }

    function get_license(uint eduindex, uint index)public view index_valid(eduindex, get_education_experience_count()) index_valid(index, get_license_count(eduindex)) returns(string memory, string memory){
        License memory license = education_experience[eduindex].licenses[index];
        return(license.name, license.content);
    }

//functions for setting everything
    function set_permission(address account, string memory name, Organization_type property, bool permission)public only_gov{
        organizations[account] = Organization({
            name: name,
            property: property,
            account: account,
            permission: permission
        });
        emit done(done_code.set_permission, "Set Permission");
    }

    function set_job_experience(string memory position, uint start_date)public only_company{
        job memory work = job({
            company: organizations[msg.sender],
            position: position,
            start_date: start_date,
            end_date: 0
        });
        job_experience.push(work);
        emit done(done_code.set_experience, "Set Job Experience");
    }

    function set_job_end_date(uint end_date)public only_company{
        uint index = uint(find_organization(msg.sender, "experience"));
        job_experience[index].end_date = end_date;
        emit done(done_code.set_job_end_date, "Set JobEndDate");
    }

    function set_education(education_status status, string memory major)public only_school{
        education_experience.push();
        education storage edu = education_experience[education_experience.length - 1];
        Course memory course = Course({name: "", content: "", comment: "", grade:0});
        License memory license = License({name: "", content: ""});
        edu.school = organizations[msg.sender];
        edu.status = status;
        edu.major = major;
        edu.courses.push(course);
        edu.licenses.push(license);
        emit done(done_code.set_education, "Set Education");
    }

    function set_license(string memory name, string memory content)public only_school{
        uint index = uint(find_organization(msg.sender, "education"));
        education storage edu = education_experience[index];
        edu.licenses.push(License({name: name, content: content}));
        emit done(done_code.set_license, "Set License");
    }

    function set_course(string memory name, string memory content, string memory comment, uint8 grade)public only_school{
        uint index = uint(find_organization(msg.sender, "education"));
        education storage edu = education_experience[index];
        edu.courses.push(Course({name: name, content: content, comment: comment, grade: grade}));
        emit done(done_code.set_course, "Set Course");
    }

    function set_autobiography(string memory text)public only_host{
        profile.autobiography = text;
        emit done(done_code.set_autobiography, "Set Autobiography");
    }

    function set_skill(string memory class, string memory name)public only_host{
        skills.push(skill({class: class, name: name}));
        emit done(done_code.set_skill, "Set Skill");
    }

    function set_contact(string memory contact)public only_host{
        profile.contact = contact;
        emit done(done_code.set_contact, "Set Contact");
    }

    function remove_permission(address account)public only_gov{
        Organization storage org = organizations[account];
        org.permission = false;
        emit done(done_code.remove_permission, "Remove Permission");
    }

    using StringLib for string;
    function remove_skill(string memory class, string memory name)public only_host{
        uint index=0;
        for(uint i=0; i<skills.length ; i++){
            if(skills[i].name.compare(name) && skills[i].class.compare(class)){
                index = i;
                break;
            }
        }
        for(uint i=index ; i<skills.length-1 ; i++){
            skills[i] = skills[i+1];
        }
        delete skills[skills.length-1];
        skills.pop();
        emit done(done_code.remove_skill, "Remove Skill");
    }
}

