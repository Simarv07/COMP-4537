class Note{
    constructor(content, id, onDelete){
        this.content = content;
        this.id = id;
        this.instiateRemoveButton(onDelete);
        this.instiateNoteBlock();
    }

    instiateNoteBlock() {
        this.noteBlock = document.createElement("div");
        this.noteBlock.className = "note";
        this.noteBlock.innerHTML = `<textarea class="note-text" rows="4" cols="40">${this.content}</textarea>`;
        this.noteBlock.appendChild(this.removeButton);
    }

    instiateRemoveButton(onDelete) {
        const self = this
        this.removeButton = document.createElement("button");
        this.removeButton.className = "remove";
        this.removeButton.textContent = "Remove";

        this.removeButton.addEventListener("click", function () {
            onDelete(this.id)
            self.noteBlock.remove();
        });

    }
}

class NoteApp{
    constructor(){

        if (document.title == "reader.html"){
            this.displayReader();
            this.updateTimestamp();
            setInterval(() => {
                this.displayReader();
                this.updateTimestamp();
            }, 2000);
            return;
        }

        this.addButton = document.getElementById("add-button");
        this.noteContainer = document.getElementById("note-container");
        this.insitateAddButton();
        // localStorage.setItem("notes", JSON.stringify([]));
        this.loadNotesFromLocalStorage();
        this.updateTimestamp();

        // Save notes to local storage every 2 seconds
        setInterval(() => {
            this.saveNotesToLocalStorage();
            this.updateTimestamp();
        }, 2000);
    }

    insitateAddButton(){
        const self = this
        this.addButton.addEventListener("click", function () {
            self.addNote("",document.querySelectorAll(".note").length);
        });
    }

    removeNoteById(noteId) {
        const notes = this.retrieveNotesFromDOM();
        notes.splice(noteId, 1);
        this.saveNotesToLocalStorage(notes);
    }

    addNote(note_text, id){
        const note = new Note(note_text, id, this.removeNoteById.bind(this));
        this.noteContainer.appendChild(note.noteBlock);
    }


    loadNotesFromLocalStorage() {
        const storedNotesData = localStorage.getItem("notes");
        if (storedNotesData) {
            const notesData = JSON.parse(storedNotesData);
            notesData.forEach(data => {
                this.addNote(data.content, data.id);
            });
        }
    }

    saveNotesToLocalStorage(notes = this.retrieveNotesFromDOM()) {
        const notesData = notes.map(note => ({
            id: note.id,
            content: note.content,
        }));
    
        // Save notes data to local storage
        localStorage.setItem("notes", JSON.stringify(notesData));
    }
    
    retrieveNotesFromDOM() {
        const noteElements = document.querySelectorAll(".note");
        const notes = []
        noteElements.forEach((noteElement, index) => {
            const noteText = noteElement.querySelector(".note-text").value;
            const note = new Note(noteText, index);
            notes.push(note);
        });
        return notes;
    }

    displayReader(){
        const noteContainer = document.getElementById("note-container");
        
        // Remove all existing note elements from the container
        while (noteContainer.firstChild) {
            noteContainer.removeChild(noteContainer.firstChild);
        }

        // Retrieve notes from local storage
        const savedNotesJSON = localStorage.getItem("notes");

        if (savedNotesJSON) {
            // Parse the JSON string into an array of objects
            const notes = JSON.parse(savedNotesJSON);
        
            // Loop through the array of notes and create HTML elements to display them
            notes.forEach((note) => {
                const noteBlock = document.createElement("div");
                noteBlock.className = "note";
                noteBlock.textContent = note.content;
                noteContainer.appendChild(noteBlock);
            });
        
        }
    }

    updateTimestamp() {
        const timestampElement = document.getElementById("timestamp");
        const now = new Date();
        const hours = now.getHours();
        const amPm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        const timestamp = `${formattedHours}:${minutes}:${seconds} ${amPm}`;
        timestampElement.textContent = `Timestamp: ${timestamp}`;
    }

}





const noteApp = new NoteApp();