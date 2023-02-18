//SPDX-License-Indetifier: MIT
pragma solidity ^0.8.17;

contract NoteContract {
    mapping(address => string [] ) public notes;

    constructor() {
    }

    event NewNote(address, string note);

// 添加记事
    function addNote( string memory note) public {
        notes[msg.sender].push(note);
        emit NewNote(msg.sender, note);
    }

    function getNotesLen(address own) public view returns (uint) {
        return notes[own].length;
    }
}